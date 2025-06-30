import Link from 'next/link';
import styles from '../app/styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">EduPlatform</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/courses">Courses</Link>
        <Link href="/auth">Sign In / Sign Up</Link>
      </nav>
    </header>
  );
}