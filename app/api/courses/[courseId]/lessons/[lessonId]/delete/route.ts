import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import db, { connectDB } from '@/lib/surrealdb'
import { RecordId } from 'surrealdb'
import { Lesson } from '@/types'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    console.log('Starting DELETE request for lesson')
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

    const { courseId, lessonId } = await params
    if (!courseId || courseId === 'undefined' || !lessonId || lessonId === 'undefined') {
      console.log('Invalid course or lesson ID')
      return NextResponse.json({ error: 'Course ID and Lesson ID are required' }, { status: 400 })
    }

    await connectDB()
    const lessonIdRecord = new RecordId('lessons', lessonId)
    console.log('DELETE Lesson ID =>', lessonId)
    console.log('RECORD ID =>', lessonIdRecord)

    const lesson = await db.select<Lesson>(lessonIdRecord)
    if (!lesson) {
      console.log(`Lesson not found: ${lessonIdRecord}`)
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    console.log('Lesson found:', lesson)

    console.log(`Before deleting lesson: ${lessonIdRecord}`)
    await db.delete(lessonIdRecord)
    console.log('DELETE RESULT =>', 'Lesson deleted')

    console.log(`Lesson deleted: ${lessonIdRecord}`)
    return NextResponse.json({ message: 'Lesson deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('DELETE ERROR =>', error.message)
    return NextResponse.json(
      { error: 'Failed to delete lesson', details: error.message },
      { status: 500 }
    )
  }
}
