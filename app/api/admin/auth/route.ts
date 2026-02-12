import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Debug logging
    console.log('Auth attempt received');
    console.log('Password provided:', password ? 'Yes' : 'No');

    // Get admin password from environment variable
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    console.log('ADMIN_PASSWORD env var exists:', ADMIN_PASSWORD ? 'Yes' : 'No');

    if (!ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error - ADMIN_PASSWORD not set' },
        { status: 500 }
      );
    }

    if (!password) {
      console.error('❌ No password provided in request');
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    // Simple password check
    const passwordsMatch = password === ADMIN_PASSWORD;
    console.log('Passwords match:', passwordsMatch);

    if (passwordsMatch) {
      console.log('✅ Authentication successful');
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.log('❌ Invalid password provided');
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('❌ Auth error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
