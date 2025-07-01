import { RecordId } from 'surrealdb';

export interface Course {
  id: RecordId | string;
  title: string;
  description: string;
  icon: string;
  image: string;
  created_at?: string;
}

export interface Lesson {
  id: RecordId | string;
  course: RecordId | string;
  title: string;
  content: string;
  thumbnail: string;
  videoEmbed: string;
  created_at?: string;
}