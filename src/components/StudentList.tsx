
import { Student } from '@/types/reading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Book, Calendar, User } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export function StudentList({ students, onStudentClick }: StudentListProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Currently Reading</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Read</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const currentlyReading = student.books
              .filter(book => book.status === 'reading')
              .sort((a, b) => (b.lastReadDate?.getTime() || 0) - (a.lastReadDate?.getTime() || 0))[0];
            const activeBooks = student.books.filter(book => book.status === 'reading').length;

            return (
              <TableRow 
                key={student.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onStudentClick(student)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {student.books.length} books
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {currentlyReading ? (
                    <div className="font-medium text-sm">{currentlyReading.book.title}</div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No active book</span>
                  )}
                </TableCell>
                <TableCell>
                  {currentlyReading ? (
                    <div className="flex items-center gap-2">
                      <Progress value={currentlyReading.progress} className="h-2 w-16" />
                      <span className="text-sm font-medium">{currentlyReading.progress}%</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {currentlyReading?.lastReadDate ? (
                    <div className="text-sm">
                      <div>{currentlyReading.lastReadDate.toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {currentlyReading.lastReadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Book className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{student.totalBooksCompleted}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {activeBooks}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
