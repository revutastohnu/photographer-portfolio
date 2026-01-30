import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin666';

// Простий JWT (в продакшні використовуйте бібліотеку типу jsonwebtoken)
function generateToken(username: string) {
  const payload = { username, timestamp: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken(username);
      
      return NextResponse.json({
        success: true,
        token,
      });
    } else {
      return NextResponse.json(
        { error: 'Невірний логін або пароль' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
