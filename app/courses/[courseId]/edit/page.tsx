'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from '../CourseDetail.module.css'
import { Course } from '@/types'

export default function CourseEdit() {
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [newTitle, setNewTitle] = useState<string>('')
  const [newDescription, setNewDescription] = useState<string>('')
  const [newImage, setNewImage] = useState<string>('')
  const [newIcon, setNewIcon] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.courseId) return

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${params.courseId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch course')
        }
        const data = await res.json()
        setCourse(data)
        setNewTitle(data.title)
        setNewDescription(data.description)
        setNewImage(data.image)
        setNewIcon(data.icon)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchCourse()
  }, [params?.courseId])

  const updateCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          image: newImage,
          icon: newIcon,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update course')
      }

      setSuccess('Course updated successfully!')
      setTimeout(() => {
        setSuccess(null)
        router.push('/courses')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      setTimeout(() => setError(null), 3000)
    }
  }

  const goBack = () => {
    router.push('/courses')
  }

  if (!course) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Course</h1>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Course Title</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="icon">Icon URL</label>
            <input
              type="url"
              id="icon"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={updateCourse}
              disabled={
                !(typeof newTitle === 'string' && newTitle.trim()) ||
                !(typeof newDescription === 'string' && newDescription.trim()) ||
                !(typeof newImage === 'string' && newImage.trim()) ||
                !(typeof newIcon === 'string' && newIcon.trim())
              }
              className={styles.button}
            >
              Update Course
            </button>
            <button onClick={goBack} className={styles.deleteButton}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
