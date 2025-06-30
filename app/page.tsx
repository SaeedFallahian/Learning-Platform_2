import Link from 'next/link';
import styles from './styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to EduPlatform!</h1>
        <p>Learn new skills with our diverse online courses.</p>
        <Link href="/courses" className={styles.ctaButton}>
          Explore Courses
        </Link>
      </section>
      <section className={styles.coursesPreview}>
        <h2>Featured Courses</h2>
        <div className={styles.courseGrid}>
          <div className={styles.courseCard}>
            <h3>Course 1</h3>
            <p>Learn the basics of programming.</p>
          </div>
          <div className={styles.courseCard}>
            <h3>Course 2</h3>
            <p>Master web development.</p>
          </div>
          <div className={styles.courseCard}>
            <h3>Course 3</h3>
            <p>Dive into data science.</p>
          </div>
        </div>
      </section>
    </div>
  );
}