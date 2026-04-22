import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_token');

  if (!sessionCookie?.value) {
    redirect('/login');
  }

  try {
    const { autenticado } = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (!autenticado) redirect('/login');
  } catch {
    redirect('/login');
  }

  return <>{children}</>;
}
