import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';

// Measure database connection time
console.time('Database Connection');
connectDb()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection failed:', err))
  .finally(() => console.timeEnd('Database Connection'));

// POST API for swiping right
export async function POST(request: NextRequest) {
  try {
    // Get the request body data (emails and direction)
    const { userEmailA, userEmailB, direction } = await request.json();

    // Validation check
    if (!userEmailA || !userEmailB || direction !== 'right') {
      return NextResponse.json({ success: false, message: 'Invalid input or direction' });
    }

    // Find both users by email
    const userA = await UserModel.findOne({ email: userEmailA });
    const userB = await UserModel.findOne({ email: userEmailB });

    if (!userA || !userB) {
      return NextResponse.json({ success: false, message: 'User(s) not found' });
    }

    // Add User B to User A's matches if not already present
    if (!userA.matches.includes(userB._id)) {
      userA.matches.push(userB._id);
      await userA.save();
    }

    // Check if mutual match exists (User B should have User A in their matches)
    if (userB.matches.includes(userA._id)) {
      return NextResponse.json({
        success: true,
        message: 'Mutual match found!',
        userEmails: { userA: userA.email, userB: userB.email }, // Include user emails in response
      });
    }

    // Otherwise, just return success message
    return NextResponse.json({
      success: true,
      message: 'User added to matches',
      userEmails: { userA: userA.email, userB: userB.email }, // Include user emails in response
    });

  } catch (error) {
    console.error('Error in swipe right API:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
