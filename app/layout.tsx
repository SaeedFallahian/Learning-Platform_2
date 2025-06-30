import './globals.css';
import Header from '../components/Header';
import { ClerkProvider } from '@clerk/nextjs';
import styles from './styles/layout.module.css';

export const metadata = {
  title: 'EduPlatform',
  description: 'A simple online learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className={styles.container}>
            <Header />
            <main className={styles.main}>{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}