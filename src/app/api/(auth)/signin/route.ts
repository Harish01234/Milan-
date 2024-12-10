import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

interface SignInRequest {
  identifier: string;
  password: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SignInRequest = await request.json();
    const { identifier, password } = body;

    // Validation: Check if identifier and password are provided
    if (!identifier || !password) {
      console.error("Validation Error: Missing identifier or password");
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
      console.error("Authentication Error: User not found");
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Check if the user is verified
    if (!user.verified) {
      console.error("Authentication Error: Account not verified");
      return NextResponse.json(
        { error: "Your account is not verified. Please verify your account." },
        { status: 403 }
      );
    }

    // Check password match
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      console.error("Authentication Error: Invalid password");
      return NextResponse.json(
        { error: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("Server Error: JWT_SECRET environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      } as JwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expiration: 1 day
    );

    // Log token for debugging purposes
    console.log("Generated JWT Token:", token);

    // Set token in HTTP-only, secure cookie
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
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24}` // 1 day
    );

    return response;
  } catch (error: unknown) {
    // Log unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Unexpected Error during sign-in:", errorMessage);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
