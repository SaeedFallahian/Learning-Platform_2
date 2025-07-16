'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import styles from './Courses.module.css'
import { Course } from '@/types'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log('Fetch response status:', response.status)
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()
        console.log('Fetched courses:', data)

        const coursesArray = Array.isArray(data) ? data : []
        setCourses(coursesArray)
      } catch (err: any) {
        setError(err.message)
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      const res = await fetch(`/api/courses/${courseId}/delete`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSuccess('Course deleted successfully')
        setCourses((prev) =>
          prev.filter((course) => {
            const id =
              typeof course.id === 'string'
                ? course.id.includes(':')
                  ? course.id.split(':').pop()
                  : course.id
                : String(course.id)
            return id !== courseId
          })
        )
        setTimeout(() => setSuccess(null), 3000)
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to delete course')
        setTimeout(() => setError(null), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete course')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className={styles.container}>
      <SignedIn>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className={styles.empty}>No courses available.</div>
        )}
        {!loading && !error && courses.length > 0 && (
          <>
            <h1 className={styles.title}>Courses</h1>
            <div className={styles.grid}>
              {courses.map((course) => {
                let courseId = ''
                if (typeof course.id === 'string') {
                  const parts = course.id.split(':')
                  courseId = parts[parts.length - 1].replace(/⟩$/, '')
                } else {
                  courseId = String(course.id)
                }
                console.log('Rendering course:', course, 'Extracted courseId:', courseId)
                return (
                  <div key={courseId} className={styles.card}>
                    <Link href={`/courses/${courseId}`} className={styles.cardLink}>
                      <img src={course.image} alt={course.title} className={styles.courseImage} />
                      <div className={styles.cardContent}>
                        <h2 className={styles.cardTitle}>{course.title}</h2>
                        <p className={styles.description}>{course.description}</p>
                      </div>
                    </Link>
                    {user && user.publicMetadata?.role === 'admin' && (
                      <div className={styles.buttonContainer}>
                        <Link href={`/courses/${courseId}/edit`} className={styles.button}>
                          Update Course
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(courseId)}
                          className={styles.deleteButton}
                        >
                          Delete Course
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </SignedIn>
      <SignedOut>
        <div className={styles.signInPrompt}>
          <h2>Please sign in to view courses</h2>
          <SignInButton mode="modal">
            <button className={styles.signInButton}>Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  )
}
