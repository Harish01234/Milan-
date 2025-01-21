import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Clear the token stored in cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully!' },
      { status: 200 }
    );

    // Clear the token cookie by setting it with an empty value and `maxAge: 0`
    response.cookies.set('token', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json(
      { message: 'Internal server error during logout' },
      { status: 500 }
    );
  }
}
