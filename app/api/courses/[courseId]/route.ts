import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { Course } from '@/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    if (!courseId || courseId === 'undefined') {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    await connectDB();

    const sql = `SELECT * FROM courses WHERE id = $courseId`;
    const result = await db.query(sql, { courseId: `courses:${courseId}` });
    console.log('Raw course query result:', result); // لاگ برای دیباگ

    let course: Course | null = null;
    if (Array.isArray(result) && result[0] && Array.isArray(result[0].result)) {
      course = result[0].result[0] || null;
    } else if (Array.isArray(result)) {
      course = result[0] || null;
    }

    console.log('Processed course:', course); // لاگ برای دیباگ

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching course ${courseId}:`, error.message);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}