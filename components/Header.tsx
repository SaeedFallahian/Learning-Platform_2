"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import AuthButtons from './AuthButtons';
import styles from '../app/styles/Header.module.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="EduPlatform Logo" width={40} height={40} />
          <h1 className={styles.logoText}>EduPlatform</h1>
        </div>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/courses" className={styles.navLink}>
                Courses
              </Link>
            </li>
          </ul>
          <AuthButtons />
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileMenuContent}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink} onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/courses" className={styles.navLink} onClick={toggleMenu}>
                Courses
              </Link>
            </li>
          </ul>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;