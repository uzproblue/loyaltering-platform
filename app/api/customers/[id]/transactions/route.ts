import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Get pagination parameters
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';

    // Get transactions via backend API
    const transactionsResponse = await fetch(
      `${API_URL}/api/transactions/customer/${id}?page=${page}&limit=${limit}`,
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
    console.error('Error fetching customer transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
