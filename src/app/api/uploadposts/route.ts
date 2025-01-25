import connectDb from '@/lib/dbconnect';
import User from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request : NextRequest) {
  try {
    await connectDb();

    const body = await request.json();
    const { email, link } = body;

    // Basic input validation
    if (!email || !link || !email.includes('@') || !link.startsWith('http')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or link.' },
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

    // Ensure `postLinks` is initialized
    if (!Array.isArray(user.postLinks)) {
      user.postLinks = [];
    }

    // Add link
    user.postLinks.push(link);
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Link added successfully.', data: user },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error adding link:', error);

    return NextResponse.json(
      { success: false, message: 'An error occurred while adding the link.' },
      { status: 500 }
    );
  }
}





//delete post



export async function DELETE(request : NextRequest) {
  try {
    await connectDb();

    const body = await request.json();
    const { email, link } = body;

    // Basic input validation
    if (!email || !link || !email.includes('@') || !link.startsWith('http')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or link.' },
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

    // Check if the link exists
    if (!user.postLinks.includes(link)) {
      return NextResponse.json(
        { success: false, message: 'Link not found for this user.' },
        { status: 404 }
      );
    }

    // Remove the link
    user.postLinks = user.postLinks.filter((existingLink : string) => existingLink !== link);
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Link deleted successfully.', data: user },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting link:', error);

    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the link.' },
      { status: 500 }
    );
  }
}



