import { courses } from '@/data/courses';
import styles from '../../../../styles/LessonDetail.module.css';
import Link from 'next/link';

export default function LessonDetail({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const course = courses.find((c) => c.id === params.courseId);
  const lesson = course?.lessons.find((l) => l.id === params.lessonId);

  if (!course || !lesson) {
    return <div className={styles.container}>Lesson not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.thumbnailBackground} style={{ backgroundImage: `url(${lesson.thumbnail})` }}></div>
      <div className={styles.contentWrapper}>
        <Link href={`/courses/${course.id}`} className={styles.backLink}>
          Back to {course.title}
        </Link>
        <div className={styles.lessonHeader}>
          <h1>{lesson.title}</h1>
        </div>
        <div className={styles.lessonContent}>
          <div className={styles.videoWrapper}>
            <iframe
              frameborder="0"
              width="100%"
              height="400px"
              src={lesson.videoEmbed}
              allowFullScreen={true}
              webkitallowfullscreen={true}
              mozallowfullscreen={true}
            ></iframe>
          </div>
          <p>{lesson.content}</p>
        </div>
      </div>
    </div>
  );
}