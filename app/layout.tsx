import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/MainLayout';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Brasfortal - Gestão de Pedidos, Orçamentos e Logística',
  description: 'Sistema integrado de gestão comercial, espelho de pedidos e logística com terminal para motoristas da Brasfortal Metais e Conexões Ltda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-slate-100 text-slate-900 min-h-screen antialiased">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
