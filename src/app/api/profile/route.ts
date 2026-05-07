import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Lê o cookie de sessão do Better Auth
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Repassa a requisição para o NestJS enviando o cookie como Bearer Token
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
    const nestResponse = await fetch(`${backendUrl}/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await nestResponse.json();

    if (!nestResponse.ok) {
      return NextResponse.json(data, { status: nestResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao salvar perfil no backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
