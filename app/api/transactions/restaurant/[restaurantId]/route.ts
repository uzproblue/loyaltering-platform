import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId } = params;
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '20';

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Get transactions via backend API
    const transactionsResponse = await fetch(
      `${API_URL}/api/transactions/restaurant/${restaurantId}?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await transactionsResponse.json().catch(() => ({}));

    return NextResponse.json(data, { status: transactionsResponse.status });
  } catch (error) {
    console.error('Error fetching restaurant transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
