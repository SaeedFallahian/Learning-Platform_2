
import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { RecordId } from 'surrealdb';
import { Lesson } from '@/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params;
    console.log('Requested courseId:', courseId, 'lessonId:', lessonId); // لاگ برای دیباگ

    if (!courseId || courseId === 'undefined' || !lessonId || lessonId === 'undefined') {
      return NextResponse.json({ error: 'Course ID and Lesson ID are required' }, { status: 400 });
    }

    await connectDB();
    const lessonIdRecord = new RecordId('lessons', lessonId);
    console.log('Constructed lesson RecordId:', lessonIdRecord.toString()); // لاگ برای دیباگ

    const lesson = await db.select<Lesson>(lessonIdRecord);
    console.log('Selected lesson:', lesson); // لاگ برای دیباگ

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    let lessonCourseId: string;
    if (typeof lesson.course === 'string') {
      lessonCourseId = lesson.course.includes(':') ? lesson.course.split(':').pop()! : lesson.course;
    } else if (typeof lesson.course === 'object' && 'id' in lesson.course) {
      lessonCourseId = lesson.course.id;
    } else {
      return NextResponse.json({ error: 'Invalid course reference' }, { status: 500 });
    }



    return NextResponse.json(lesson, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching lesson:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch lesson', details: error.message },
      { status: 500 }
    );
  }
}
