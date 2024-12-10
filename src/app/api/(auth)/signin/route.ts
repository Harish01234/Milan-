import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { identifier, password } = await request.json();

    // Validate input format
    if (!identifier || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid identifier or password format." },
        { status: 400 }
      );
    }

    // Check user existence
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "Your account is not verified. Please verify your account." },
        { status: 403 }
      );
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    response.headers.set(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24}`
    );

    return response;
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
