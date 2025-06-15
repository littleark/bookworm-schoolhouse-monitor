
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Student, StudentBook, ReadingSession } from "@/types/reading";

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async (): Promise<Student[]> => {
      // For now, we'll fetch all students. In a real app with auth, 
      // you'd filter by the current user's ID
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');
      
      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      // Fetch student books and sessions for each student
      const studentsWithBooks = await Promise.all(
        studentsData.map(async (student) => {
          const { data: studentBooksData, error: booksError } = await supabase
            .from('student_books')
            .select(`
              *,
              book:books(*)
            `)
            .eq('student_id', student.id);

          if (booksError) {
            console.error('Error fetching student books:', booksError);
            throw booksError;
          }

          // Fetch sessions for each student book
          const booksWithSessions = await Promise.all(
            studentBooksData.map(async (studentBook) => {
              const { data: sessionsData, error: sessionsError } = await supabase
                .from('sessions')
                .select('*')
                .eq('student_book_id', studentBook.id)
                .order('date', { ascending: false });

              if (sessionsError) {
                console.error('Error fetching sessions:', sessionsError);
                throw sessionsError;
              }

              const sessions: ReadingSession[] = sessionsData.map(session => ({
                id: session.id,
                date: new Date(session.date),
                pagesRead: session.pages_read,
                timeSpent: session.time_spent,
                notes: session.notes || undefined
              }));

              const studentBookResult: StudentBook = {
                id: studentBook.id,
                bookId: studentBook.book_id,
                book: {
                  id: studentBook.book.id,
                  title: studentBook.book.title,
                  author: studentBook.book.author,
                  cover: studentBook.book.cover || '',
                  totalPages: studentBook.book.total_pages
                },
                status: studentBook.status as 'yet-to-start' | 'reading' | 'completed' | 'paused',
                progress: studentBook.progress,
                lastReadDate: studentBook.last_read_date ? new Date(studentBook.last_read_date) : undefined,
                sessions,
                assignedDate: new Date(studentBook.assigned_date || studentBook.created_at)
              };

              return studentBookResult;
            })
          );

          // Calculate stats
          const totalBooksCompleted = booksWithSessions.filter(book => book.status === 'completed').length;
          const averageProgress = booksWithSessions.length > 0 
            ? Math.round(booksWithSessions.reduce((sum, book) => sum + book.progress, 0) / booksWithSessions.length)
            : 0;

          const studentResult: Student = {
            id: student.id,
            name: student.name,
            avatar: student.avatar || undefined,
            books: booksWithSessions,
            totalBooksCompleted,
            averageProgress
          };

          return studentResult;
        })
      );

      return studentsWithBooks;
    },
  });
};
