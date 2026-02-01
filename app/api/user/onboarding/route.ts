import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      onboardingCompleted,
      businessName,
      category,
      locations,
      country,
      plan,
      billingCycle
    } = body;

    // Update onboarding status on the server
    const response = await fetch(`${API_URL}/api/users/onboarding`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': session.user.email,
      },
      credentials: 'include',
      body: JSON.stringify({
        onboardingCompleted,
        businessName,
        category,
        locations,
        country,
        plan,
        billingCycle,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update onboarding status' }));
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Failed to update onboarding status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

