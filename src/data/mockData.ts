import { Student, Book } from '@/types/reading';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Iron Man',
    author: 'Ted Hughes',
    cover: '/lovable-uploads/6c457240-a5df-4c45-8471-55374b118a17.png',
    totalPages: 376
  },
  {
    id: '2',
    title: "Kensuke's Kingdom",
    author: 'Michael Morpurgo',
    cover: '/lovable-uploads/dcce4bda-0507-4e8b-b17b-accff80e7d95.png',
    totalPages: 180
  },
  {
    id: '3',
    title: 'The Jungle Book',
    author: 'Rudyard Kipling',
    cover: '/lovable-uploads/e1bbf80a-7477-4896-8c42-b06f7e2f5501.png',
    totalPages: 328
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma Watson',
    avatar: '/placeholder.svg',
    totalBooksCompleted: 2,
    averageProgress: 75,
    books: [
      {
        id: '1',
        bookId: '1',
        book: mockBooks[0],
        status: 'reading',
        progress: 65,
        lastReadDate: new Date('2024-06-14'),
        assignedDate: new Date('2024-06-01'),
        sessions: [
          {
            id: '1',
            date: new Date('2024-06-14'),
            pagesRead: 25,
            timeSpent: 45,
            notes: 'Great progress today!'
          },
          {
            id: '2',
            date: new Date('2024-06-12'),
            pagesRead: 30,
            timeSpent: 60,
          }
        ]
      },
      {
        id: '2',
        bookId: '2',
        book: mockBooks[1],
        status: 'completed',
        progress: 100,
        lastReadDate: new Date('2024-06-10'),
        assignedDate: new Date('2024-05-15'),
        sessions: []
      }
    ]
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: '/placeholder.svg',
    totalBooksCompleted: 1,
    averageProgress: 45,
    books: [
      {
        id: '3',
        bookId: '3',
        book: mockBooks[2],
        status: 'reading',
        progress: 30,
        lastReadDate: new Date('2024-06-13'),
        assignedDate: new Date('2024-06-05'),
        sessions: [
          {
            id: '3',
            date: new Date('2024-06-13'),
            pagesRead: 20,
            timeSpent: 35,
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Sophie Chen',
    avatar: '/placeholder.svg',
    totalBooksCompleted: 3,
    averageProgress: 90,
    books: [
      {
        id: '4',
        bookId: '1',
        book: mockBooks[0],
        status: 'completed',
        progress: 100,
        lastReadDate: new Date('2024-06-08'),
        assignedDate: new Date('2024-05-20'),
        sessions: []
      }
    ]
  }
];
