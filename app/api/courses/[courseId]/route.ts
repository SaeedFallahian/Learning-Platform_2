import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { Course } from '@/types';
import { currentUser } from '@clerk/nextjs/server';
import { RecordId, Patch } from 'surrealdb';

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
    console.log('Raw course query result:', result);

    let course: Course | null = null;
    if (Array.isArray(result) && result[0] && Array.isArray(result[0].result)) {
      course = result[0].result[0] || null;
    } else if (Array.isArray(result)) {
      course = result[0] || null;
    }

    console.log('Processed course:', course);

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      console.log('Unauthorized: User is not admin, role:', user.publicMetadata?.role);
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { courseId } = await params;
    if (!courseId || courseId === 'undefined') {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const { title, description, image, icon } = await req.json();
    if (!title || !description || !image || !icon) {
      return NextResponse.json(
        { error: 'Title, description, image, and icon are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const courseIdRecord = new RecordId('courses', courseId);

    const existingCourse = await db.select<Course>(courseIdRecord);
    if (!existingCourse) {
      console.log(`Course not found: ${courseIdRecord}`);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const patchData: Patch[] = [
      { op: 'replace', path: '/title', value: title },
      { op: 'replace', path: '/description', value: description },
      { op: 'replace', path: '/image', value: image },
      { op: 'replace', path: '/icon', value: icon },
    ];

    const updatedCourse = await db.patch(courseIdRecord, patchData);
    console.log('Updated course:', updatedCourse);

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error: any) {
    console.error('Error updating course:', error.message);
    return NextResponse.json(
      { error: 'Failed to update course', details: error.message },
      { status: 500 }
    );
  }
}