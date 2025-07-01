import { NextResponse } from 'next/server';
import db, { connectDB } from '@/lib/surrealdb';
import { Course } from '@/types';

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