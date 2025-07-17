import { z } from 'zod';

/**
 * Schema for validating Course input data.
 */
export const CourseSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Course title must be at least 3 characters' })
    .max(100, { message: 'Course title must not exceed 100 characters' }),
  description: z
    .string()
    .min(3, { message: 'Course description is required' })
    .max(500, { message: 'Course description must not exceed 500 characters' }),
  image: z.string().url({ message: 'Image URL must be valid' }),
  icon: z.string().url({ message: 'Icon URL must be valid' }),
});

/**
 * Schema for validating Lesson input data.
 */
export const LessonSchema = z.object({
  courseId: z
    .string()
    .min(3, { message: 'Course selection is required' }),
  title: z
    .string()
    .min(3, { message: 'Lesson title must be at least 3 characters' })
    .max(100, { message: 'Lesson title must not exceed 100 characters' }),
  content: z
    .string()
    .min(3, { message: 'Lesson title must be at least 3 characters' })
    .max(2000, { message: 'Lesson content must not exceed 2000 characters' }),
  thumbnail: z.string().url({ message: 'Thumbnail URL must be valid' }),
  videoEmbed: z.string().url({ message: 'Video embed URL must be valid' }),
});

/**
 * TypeScript types inferred from the schemas.
 */
export type CourseInput = z.infer<typeof CourseSchema>;
export type LessonInput = z.infer<typeof LessonSchema>;