import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_token');

  // Doble verificación server-side (el middleware ya protege, pero esto es defensa adicional)
  if (!sessionCookie?.value) {
    redirect('/login');
  }

  let usuario = { nombre: 'Usuario', rol: 'Admin', correo: '' };
  try {
    usuario = JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    // Cookie inválida → redirigir
    redirect('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Pasar usuario a children si es necesario, o usar un contexto */}
      {children}
    </div>
  );
}
