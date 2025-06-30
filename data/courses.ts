export interface Lesson {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  videoEmbed: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "mathematics",
    title: "Mathematics",
    description: "Master the fundamentals of mathematics, from algebra to calculus.",
    image: "https://images.unsplash.com/photo-1509228627857-449b6e4d0b1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "https://img.icons8.com/ios-filled/50/4C6EF5/calculator.png",
    lessons: [
      {
        id: "algebra",
        title: "Algebra",
        content: "Learn about equations, polynomials, and functions in this comprehensive Algebra course.",
        thumbnail: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
      {
        id: "geometry",
        title: "Geometry",
        content: "Explore shapes, angles, and spatial reasoning in this engaging Geometry course.",
        thumbnail: "https://images.unsplash.com/photo-1635070664753-803b3b247e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
      {
        id: "calculus",
        title: "Calculus",
        content: "Understand limits, derivatives, and integrals in this foundational Calculus course.",
        thumbnail: "https://images.unsplash.com/photo-1611078489932-9b6177f3b3c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
    ],
  },
  {
    id: "physics",
    title: "Physics",
    description: "Dive into the laws of the universe, from mechanics to electromagnetism.",
    image: "https://images.unsplash.com/photo-1636466497217-26a7d7cd6c55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "https://img.icons8.com/ios-filled/50/4C6EF5/planet.png",
    lessons: [
      {
        id: "mechanics",
        title: "Mechanics",
        content: "Study motion, forces, and energy in this Mechanics course.",
        thumbnail: "https://images.unsplash.com/photo-1628595351029-c2bf175a5903?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
      {
        id: "therkingdomics",
        title: "Thermodynamics",
        content: "Learn about heat, energy, and entropy in this Thermodynamics course.",
        thumbnail: "https://images.unsplash.com/photo-1596113183800-288bb8f45e27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Learn data analysis, visualization, and machine learning techniques.",
  image: "https://images.unsplash.com/photo-1551288049-b1f3a2b2e6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: "https://img.icons8.com/ios-filled/50/4C6EF5/bar-chart.png",
    lessons: [
      {
        id: "python",
        title: "Python for Data Science",
        content: "Use Python for data analysis and machine learning in this practical course.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e756b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
      {
        id: "visualization",
        title: "Data Visualization",
        content: "Create stunning charts and graphs to visualize data effectively.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-b1f3a2b2e6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        videoEmbed: "https://www.aparat.com/video/video/embed/videohash/q65e4zl/vt/frame",
      },
    ],
  },
];