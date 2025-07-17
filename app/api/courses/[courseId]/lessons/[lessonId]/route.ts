import { NextResponse } from 'next/server'
import db, { connectDB } from '@/lib/surrealdb'
import { RecordId, Patch } from 'surrealdb'
import { Lesson } from '@/types'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const { courseId, lessonId } = await params
    console.log('Requested courseId:', courseId, 'lessonId:', lessonId)

    if (!courseId || courseId === 'undefined' || !lessonId || lessonId === 'undefined') {
      return NextResponse.json({ error: 'Course ID and Lesson ID are required' }, { status: 400 })
    }

    await connectDB()
    const lessonIdRecord = new RecordId('lessons', lessonId)
    console.log('Constructed lesson RecordId:', lessonIdRecord.toString())

    const lesson = await db.select<Lesson>(lessonIdRecord)
    console.log('Selected lesson:', lesson)

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    let lessonCourseId: string
    if (typeof lesson.course === 'string') {
      lessonCourseId = lesson.course.includes(':') ? lesson.course.split(':').pop()! : lesson.course
    } else if (typeof lesson.course === 'object' && 'id' in lesson.course) {
      lessonCourseId = lesson.course.id
    } else {
      return NextResponse.json({ error: 'Invalid course reference' }, { status: 500 })
    }

    return NextResponse.json(lesson, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching lesson:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch lesson', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const user = await currentUser()
    if (!user) {
      console.log('User not authenticated')
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const isAdmin = user.publicMetadata?.role === 'admin'
    if (!isAdmin) {
      console.log('Unauthorized: User is not admin, role:', user.publicMetadata?.role)
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { courseId, lessonId } = await params
    if (!courseId || courseId === 'undefined' || !lessonId || lessonId === 'undefined') {
      return NextResponse.json({ error: 'Course ID and Lesson ID are required' }, { status: 400 })
    }

    const { title, content, thumbnail, videoEmbed } = await req.json()
    if (!title || !content || !thumbnail || !videoEmbed) {
      return NextResponse.json(
        { error: 'Title, content, thumbnail, and video embed are required' },
        { status: 400 }
      )
    }

    await connectDB()
    const lessonIdRecord = new RecordId('lessons', lessonId)

    const existingLesson = await db.select<Lesson>(lessonIdRecord)
    if (!existingLesson) {
      console.log(`Lesson not found: ${lessonIdRecord}`)
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const patchData: Patch[] = [
      { op: 'replace', path: '/title', value: title },
      { op: 'replace', path: '/content', value: content },
      { op: 'replace', path: '/thumbnail', value: thumbnail },
      { op: 'replace', path: '/videoEmbed', value: videoEmbed },
    ]

    const updatedLesson = await db.patch(lessonIdRecord, patchData)
    console.log('Updated lesson:', updatedLesson)

    return NextResponse.json(updatedLesson, { status: 200 })
  } catch (error: any) {
    console.error('Error updating lesson:', error.message)
    return NextResponse.json(
      { error: 'Failed to update lesson', details: error.message },
      { status: 500 }
    )
  }
}
