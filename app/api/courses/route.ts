import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { Course } from '@/types';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '0') || 0;

    await connectDB();

    let sql = `SELECT * FROM courses ORDER BY created_at DESC`;
    if (limit > 0) {
      sql += ` LIMIT ${limit}`;
    }

    const result = await db.query<Course[]>(sql);
    let courses: Course[] = [];
    if (Array.isArray(result)) {
      courses = Array.isArray(result[0]) ? result[0] : result;
    } else if (Array.isArray((result[0] as any)?.result)) {
      courses = (result[0] as { result: Course[] }).result;
    }

    return NextResponse.json(courses, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching courses:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      console.log('POST /api/courses: User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      console.log('POST /api/courses: Unauthorized, user role:', user.publicMetadata?.role);
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    console.log('POST /api/courses: Received body:', body);

    const { title, description, image, icon } = body;


    await connectDB();

    // Let SurrealDB generate the ID automatically
    const newCourse = await db.create<Course>('courses', {
      title,
      description,
      image,
      icon,
      created_at: new Date().toISOString(),
    });
    console.log('POST /api/courses: Course created successfully:', newCourse);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/courses: Error creating course:', error.message);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    );
  }
}