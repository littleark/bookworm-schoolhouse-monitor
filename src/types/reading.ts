
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  totalPages?: number;
}

export interface ReadingSession {
  id: string;
  date: Date;
  pagesRead: number;
  timeSpent: number; // in minutes
  notes?: string;
}

export interface StudentBook {
  id: string;
  bookId: string;
  book: Book;
  status: 'yet-to-start' | 'reading' | 'completed' | 'paused';
  progress: number; // 0-100%
  lastReadDate?: Date;
  sessions: ReadingSession[];
  assignedDate: Date;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  books: StudentBook[];
  totalBooksCompleted: number;
  averageProgress: number;
}
