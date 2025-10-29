import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarNav } from '@/components/sidebar-nav';
import { ApiTokenInput } from '@/components/api-token-input';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Knak API Explorer',
  description: 'Explore and interact with the Knak Enterprise API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-card">
            <div className="flex h-full flex-col">
              <div className="border-b p-6">
                <h1 className="text-lg font-bold">Knak API Explorer</h1>
                <p className="text-xs text-muted-foreground">
                  Explore Knak Enterprise APIs
                </p>
              </div>
              <div className="flex-1 space-y-4 p-4">
                <ApiTokenInput />
                <SidebarNav />
              </div>
              <div className="border-t p-4">
                <p className="text-xs text-muted-foreground">
                  <a
                    href="https://enterprise.knak.io/docs/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    API Documentation
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
