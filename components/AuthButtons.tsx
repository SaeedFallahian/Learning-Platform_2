'use client';

import { SignInButton, SignedIn, SignedOut, UserButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styles from '../styles/authButtons.module.css';

export default function AuthButtons() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <div className={styles.authButtons}>
      <SignedIn>
        <div className={styles.authButtons}>
          <Link href="/courses">
            <button className={styles.clerkButton}>Courses</button>
          </Link>
          <UserButton afterSignOutUrl="/" />
          {isAdmin && (
            <Link href="/admin">
              <button className={styles.clerkButton}>Create New Lesson</button>
            </Link>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <div className={styles.authButtons}>
          <SignInButton mode="modal">
            <button className={styles.clerkButton}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className={styles.clerkButton}>Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}