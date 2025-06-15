
import { Student, StudentBook } from '@/types/reading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Calendar, Clock } from 'lucide-react';

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
  onBookClick: (book: StudentBook) => void;
}

export function StudentDetail({ student, onBack, onBookClick }: StudentDetailProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'reading': 'bg-blue-100 text-blue-700 border-blue-200',
      'paused': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'yet-to-start': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants['yet-to-start']}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <p className="text-muted-foreground">
                {student.totalBooksCompleted} books completed • {student.books.length} total assigned
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{student.totalBooksCompleted}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{student.averageProgress}%</p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {student.books.filter(b => b.status === 'reading').length}
              </p>
              <p className="text-sm text-muted-foreground">Currently Reading</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Book className="w-5 h-5" />
          Assigned Books
        </h3>
        
        {student.books.map((studentBook) => (
          <Card 
            key={studentBook.id}
            className="cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => onBookClick(studentBook)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={studentBook.book.cover} 
                  alt={studentBook.book.title}
                  className="w-12 h-16 object-cover rounded bg-gray-200"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{studentBook.book.title}</h4>
                      <p className="text-sm text-muted-foreground">{studentBook.book.author}</p>
                    </div>
                    {getStatusBadge(studentBook.status)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{studentBook.progress}%</span>
                    </div>
                    <Progress value={studentBook.progress} className="h-2" />
                  </div>
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Assigned: {studentBook.assignedDate.toLocaleDateString()}
                    </div>
                    {studentBook.lastReadDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last read: {studentBook.lastReadDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
