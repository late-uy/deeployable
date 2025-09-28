import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import HealthIndicator from './health-indicator';

export const metadata = {
  title: 'Deeployable',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div>
            <strong>Deeployable</strong>
            <span style={{ marginLeft: '1rem' }}>
              <Link href="/">Inicio</Link>
              <Link href="/dashboard">Dashboard</Link>
            </span>
          </div>
          <div className="status">
            <HealthIndicator />
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
