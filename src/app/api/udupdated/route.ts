// pages/api/users/index.ts

import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';

// Add detailed logs for the database connection
console.time('Database Connection');
connectDb()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection failed:', err))
  .finally(() => console.timeEnd('Database Connection'));

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON body
    const { username, email, gender } = await request.json();

    // Validate input
    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      return NextResponse.json(
        { message: 'Invalid gender provided. Must be Male, Female, or Other.' },
        { status: 400 }
      );
    }

    // Find user based on either username or email first
    const userQuery: any = {};
    if (username) userQuery.username = username;
    if (email) userQuery.email = email;

    const user = await UserModel.findOne(userQuery);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found with the provided username or email.' },
        { status: 404 }
      );
    }

    // If user exists, flip the gender for the query
    const oppositeGender = gender === 'Male' ? 'Female' : 'Male';

    // Fetch users of the opposite gender who are not already in the matches array
    const users = await UserModel.find({
      gender: oppositeGender,
      _id: { $nin: user.matches } // Exclude users already in the matches array
    });

    // Return the users as JSON
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching users.' },
      { status: 500 }
    );
  }
}
