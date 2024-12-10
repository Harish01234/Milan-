import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest) {
  try {
    console.time('API Request'); // Start timing the entire API request

    const { identifier, password } = await request.json();

    // Validate input
    console.time('Input Validation'); // Start timing input validation
    if (!identifier || !password || password.length < 6) {
      console.timeEnd('Input Validation'); // End input validation timing
      return NextResponse.json(
        { error: "Invalid identifier or password format." },
        { status: 400 }
      );
    }
    console.timeEnd('Input Validation'); // End input validation timing

    // Find the user by email or username
    console.time('Database Query'); // Start timing the database query
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    console.timeEnd('Database Query'); // End database query timing

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
    console.time('Password Comparison'); // Start timing password comparison
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    console.timeEnd('Password Comparison'); // End password comparison timing

    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.time('JWT Token Generation'); // Start timing JWT token generation
    const tokenData = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' });
    console.timeEnd('JWT Token Generation'); // End JWT token generation timing

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
    console.time('Cookie Setting'); // Start timing cookie setting
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Corrected to lowercase
      maxAge: 60 * 60 * 24, // 1 day
    });
    console.timeEnd('Cookie Setting'); // End cookie setting timing

    console.timeEnd('API Request'); // End the entire API request timing
    return response;
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
