import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import db, { connectDB } from '@/lib/surrealdb'
import { RecordId } from 'surrealdb'
import { Course, Lesson } from '@/types'

export async function DELETE(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    console.log('Starting DELETE request for course')
    const user = await currentUser()
    if (!user) {
      console.log('User not authenticated')
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }
    console.log('User authenticated:', user.id)

    // Check if user is admin
    const isAdmin = user.publicMetadata?.role === 'admin'
    if (!isAdmin) {
      console.log('Unauthorized: User is not admin, role:', user.publicMetadata?.role)
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { courseId } = await params
    if (!courseId || courseId === 'undefined') {
      console.log('Invalid course ID')
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    await connectDB()
    const courseIdRecord = new RecordId('courses', courseId)
    console.log('DELETE Course ID =>', courseId)
    console.log('RECORD ID =>', courseIdRecord)

    // Check if course exists
    const course = await db.select<Course>(courseIdRecord)
    if (!course) {
      console.log(`Course not found: ${courseIdRecord}`)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    console.log('Course found:', course)

    // Check for associated lessons
    const lessons = await db.query<Lesson[]>(`SELECT * FROM lessons WHERE course = $courseId`, {
      courseId: `courses:${courseId}`,
    })
    let lessonCount = 0
    // if (Array.isArray(lessons)) {
    //   lessonCount = Array.isArray(lessons[0]) ? lessons[0].length : lessons.length;
    // } else if (Array.isArray((lessons[0] as any)?.result)) {
    //   lessonCount = (lessons[0] as { result: Lesson[] }).result.length;
    // }

    // if (lessonCount > 0) {
    //   console.log(`Cannot delete course ${courseId}: ${lessonCount} lessons associated`);
    //   return NextResponse.json(
    //     { error: 'Cannot delete course with associated lessons' },
    //     { status: 400 }
    //   );
    // }

    console.log(`Before deleting course: ${courseIdRecord}`)
    await db.delete(courseIdRecord)
    console.log('DELETE RESULT =>', 'Course deleted')

    console.log(`Course deleted: ${courseIdRecord}`)
    return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('DELETE ERROR =>', error.message)
    return NextResponse.json(
      { error: 'Failed to delete course', details: error.message },
      { status: 500 }
    )
  }
}
