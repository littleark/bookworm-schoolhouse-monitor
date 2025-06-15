
import { Student } from '@/types/reading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, User } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'reading': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const activeBooks = student.books.filter(book => book.status === 'reading').length;
  const currentlyReading = student.books
    .filter(book => book.status === 'reading')
    .sort((a, b) => (b.lastReadDate?.getTime() || 0) - (a.lastReadDate?.getTime() || 0))[0];

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-white to-blue-50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {student.books.length} books assigned
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {currentlyReading ? (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Currently Reading</span>
              <span className="font-medium">{currentlyReading.progress}%</span>
            </div>
            <Progress value={currentlyReading.progress} className="h-2" />
            {currentlyReading.lastReadDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Calendar className="w-3 h-3" />
                <span>Last read: {currentlyReading.lastReadDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No books currently being read
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4 text-green-600" />
            <span>{student.totalBooksCompleted} completed</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {activeBooks} reading
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
