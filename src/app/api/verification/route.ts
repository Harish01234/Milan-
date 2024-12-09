import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/usermodel'; // Update this path to your User model
import connectDB from '@/lib/dbconnect'; // Utility to connect to MongoDB

// Ensure the database is connected before handling requests
connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Validate the request
    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the OTP matches and if it has expired
    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    // OTP is valid, mark the user as verified
    user.verified = true;
    user.otp = undefined; // Clear the OTP field
    user.otpExpiry = undefined; // Clear OTP expiry field
    await user.save();

    return NextResponse.json({ message: 'Account successfully verified!' }, { status: 200 });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
