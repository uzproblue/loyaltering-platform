import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, restaurantId, type, amount, description, metadata } = body;

    // Validate required fields
    if (!customerId || !restaurantId || !type || amount === undefined || !description) {
      return NextResponse.json(
        { error: 'Please provide customerId, restaurantId, type, amount, and description' },
        { status: 400 }
      );
    }

    // Create transaction via backend API
    const createResponse = await fetch(`${API_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        restaurantId,
        type,
        amount,
        description,
        metadata: metadata || {},
        createdBy: session.user.email,
      }),
    });

    const data = await createResponse.json().catch(() => ({}));

    return NextResponse.json(data, { status: createResponse.status });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
