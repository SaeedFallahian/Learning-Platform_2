import './globals.css';
import Header from '../components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'EduPlatform',
  description: 'Learn new skills with our online courses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}