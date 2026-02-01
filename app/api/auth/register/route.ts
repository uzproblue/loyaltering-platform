import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, businessName, password } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Call server API
    const result = await registerUser({
      fullName,
      email,
      businessName,
      password,
    });

    if (!result.success) {
      const errorMessage = result.message || result.error || 'Registration failed';
      // Use statusCode from API response if available, otherwise check message
      const statusCode = result.statusCode || (errorMessage.toLowerCase().includes('already exists') ? 409 : 400);
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        message: result.message || 'User created successfully',
        user: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
