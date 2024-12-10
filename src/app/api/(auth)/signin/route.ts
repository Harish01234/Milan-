import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    // Validate input
    if (!identifier || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Invalid identifier or password format." },
        { status: 400 }
      );
    }

    // Find the user by email or username
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

    // Compare password
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const tokenData = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Prepare the response
    const response = NextResponse.json({
      message: "Sign-in successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });

    // Set cookies
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Corrected to lowercase
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
