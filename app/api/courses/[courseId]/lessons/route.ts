import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { Lesson } from '@/types';
import { currentUser } from '@clerk/nextjs/server';

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

    const sql = `SELECT * FROM lessons WHERE course = $courseId ORDER BY created_at ASC`;
    const result = await db.query<Lesson[]>(sql, { courseId: `courses:${courseId}` });
    console.log('Raw lessons query result:', result); // Debug log

    let lessons: Lesson[] = [];
    if (Array.isArray(result)) {
      lessons = Array.isArray(result[0]) ? result[0] : result;
    } else if (Array.isArray((result[0] as any)?.result)) {
      lessons = (result[0] as { result: Lesson[] }).result;
    }

    console.log('Processed lessons:', lessons); // Debug log
    return NextResponse.json(lessons, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching lessons for course ${courseId}:`, error.message);
    return NextResponse.json(
      { error: 'Failed to fetch lessons', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { courseId } = await params;
    if (!courseId || courseId === 'undefined') {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const { title, content, thumbnail, videoEmbed } = await req.json();
    if (!title || !content || !thumbnail || !videoEmbed) {
      return NextResponse.json(
        { error: 'Title, content, thumbnail, and video embed are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify course exists
    const course = await db.select(`courses:${courseId}`);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const newLesson = await db.create<Lesson>('lessons', {
      course: `courses:${courseId}`,
      title,
      content,
      thumbnail,
      videoEmbed,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error: any) {
    console.error(`Error creating lesson for course ${courseId}:`, error.message);
    return NextResponse.json(
      { error: 'Failed to create lesson', details: error.message },
      { status: 500 }
    );
  }
}