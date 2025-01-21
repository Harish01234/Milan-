import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';

// Measure database connection time
console.time('Database Connection');
connectDb()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection failed:', err))
  .finally(() => console.timeEnd('Database Connection'));

export async function POST(request: NextRequest) {
  try {
    console.log('Incoming request to update profile picture');

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);

    const { email, profilePicture } = body;

    // Validate required fields
    if (!email || !profilePicture) {
      console.warn('Validation failed: Missing email or profilePicture');
      return NextResponse.json({
        success: false,
        message: 'Email and profile picture link are required.',
      }, { status: 400 });
    }

    console.log('Validating user with email:', email);

    // Update the user's profile picture
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { profilePicture },
      { new: true, runValidators: true } // Return the updated document and apply schema validations
    );

    // Check if the user exists
    if (!updatedUser) {
      console.warn('User not found for email:', email);
      return NextResponse.json({
        success: false,
        message: 'User not found.',
      }, { status: 404 });
    }

    console.log('Profile picture updated successfully for user:', updatedUser);

    // Respond with the updated user details
    return NextResponse.json({
      success: true,
      message: 'Profile picture updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while updating the profile picture.',
    }, { status: 500 });
  }
}
