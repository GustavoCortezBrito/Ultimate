import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'Password is required',
      }, { status: 400 });
    }

    // Validar senha no servidor (mais seguro)
    const correctPassword = process.env.ADMIN_PASSWORD || 'ultimate2026';

    if (password === correctPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authenticated successfully',
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid password',
    }, { status: 401 });

  } catch (error) {
    console.error('[AUTH] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication error',
    }, { status: 500 });
  }
}
