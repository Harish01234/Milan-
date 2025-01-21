import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

console.time('Database Connection');
connectDb()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection failed:', err))
  .finally(() => console.timeEnd('Database Connection'));

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON body
    const body = await request.json();

    const { email, Username, Bio, Gender, DateOfBirth, Location, preferences ,Interests,password} = body;

    // Ensure email is provided (required)
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Prepare the update object
    const updateData: { [key: string]: any } = {};

    // Only add the fields that are provided in the request
    if (Username) updateData.username = Username;
    if (Bio) updateData.bio = Bio;
    if (Gender) updateData.gender = Gender;
    if (DateOfBirth) updateData.dateOfBirth = DateOfBirth;
    if (Location) updateData.location = Location;
    if (Interests) updateData.interests = Interests;
    if (preferences) updateData.preferences = preferences;

    if (password) {
       // Define salt rounds
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password synchronously
      console.log('Hashed password:', hashedPassword);
      
      updateData.password = hashedPassword;
    }

    // Perform the update
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: body.email }, // Find user by email
      { $set: updateData }, // Update the specified fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
