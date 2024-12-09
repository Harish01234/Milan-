import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    // Validation: Check if identifier and password are provided
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please provide both identifier (email/username) and password." },
        { status: 400 }
      );
    }

    // Check if user exists using either username or email as identifier
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Check if the user is verified
    if (!user.verified) {
      return NextResponse.json(
        { error: "Your account is not verified. Please verify your account." },
        { status: 403 }
      );
    }

    // Check password match
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role, // Ensure 'role' exists in your schema
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' } // Token expiration: 1 day
    );

    return NextResponse.json(
      {
        message: "Sign-in successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during sign-in:", error.message || error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
