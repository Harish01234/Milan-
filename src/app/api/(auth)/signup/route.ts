import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/usermodel'; // Update this path to your User model
import connectDB from '@/lib/dbconnect'; // Utility to connect to MongoDB
import nodemailer from 'nodemailer'; // Nodemailer for sending emails

// Ensure the database is connected before handling requests
connectDB();

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, SES, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address here (e.g., gmail)
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Generate a 6-digit OTP using basic JS logic
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Recipient address
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, gender, dateOfBirth } = body;

    // Validate required fields
    if (!username || !email || !password || !gender || !dateOfBirth) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already in use' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

    // Create and save the user with OTP and expiry
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      otp, // Store the OTP
      otpExpiry, // Store OTP expiry time
    });

    await newUser.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'Account created successfully! OTP has been sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
