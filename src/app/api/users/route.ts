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

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    // Read the request body as JSON
    const body = await request.json();
    console.log('Incoming request body:', body);

    const { username, email, gender } = body;

    // Validate input
    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      console.error('Invalid gender provided:', gender);
      return NextResponse.json(
        { message: 'Invalid gender provided. Must be Male, Female, or Other.' },
        { status: 400 }
      );
    }

    // Log input validation
    console.log('Input validated: username:', username, 'email:', email, 'gender:', gender);

    // Find user based on either username or email first
    const userQuery: any = {};
    if (username) userQuery.username = username;
    if (email) userQuery.email = email;

    // Log the query being used to search for the user
    console.log('User query:', userQuery);

    const user = await UserModel.findOne(userQuery);

    if (!user) {
      console.error('User not found with the provided username or email:', userQuery);
      return NextResponse.json(
        { message: 'User not found with the provided username or email.' },
        { status: 404 }
      );
    }

    // Log if user found
    console.log('User found:', user);

    // If user exists, flip the gender for the query
    const oppositeGender = gender === 'Male' ? 'Female' : 'Male';

    // Log gender inversion
    console.log('Opposite gender:', oppositeGender);

    // Fetch users of the opposite gender from the database
    const users = await UserModel.find({ gender: oppositeGender });

    // Log the fetched users
    console.log('Fetched users:', users);

    // Return the users as JSON
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error: any) {
    // Log unexpected errors
    console.error('Error processing the request:', error);

    // Improved error handling based on error type
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: 'Malformed JSON in the request.' },
        { status: 400 }
      );
    } else if (error.name === 'MongoError') {
      return NextResponse.json(
        { success: false, message: 'Database error occurred.' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'An unexpected error occurred.' },
        { status: 500 }
      );
    }
  }
}
