import Link from 'next/link';
import { courses } from '../../data/courses';
import styles from '../styles/Courses.module.css';

export default function Courses() {
  return (
    <div className={styles.container}>
      <h1>Our Courses</h1>
      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id} className={styles.courseCard}>
            <div className={styles.iconWrapper}>
              <img src={course.icon} alt={`${course.title} icon`} className={styles.courseIcon} />
            </div>
            <img src={course.image} alt={course.title} className={styles.courseImage} />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}