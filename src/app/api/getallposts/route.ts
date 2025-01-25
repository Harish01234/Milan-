import connectDb from '@/lib/dbconnect';
import User from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const body = await request.json();
    const { email } = body;

    // Basic input validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Ensure `postLinks` is an array
    if (!Array.isArray(user.postLinks)) {
      return NextResponse.json(
        { success: false, message: 'No posts found for this user.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Posts fetched successfully.', data: user.postLinks ,user},
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching posts:', error);

    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching posts.' },
      { status: 500 }
    );
  }
}
