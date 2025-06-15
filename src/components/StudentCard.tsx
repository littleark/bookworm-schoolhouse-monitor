
import { Student } from '@/types/reading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, User } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const activeBooks = student.books.filter(book => book.status === 'reading').length;
  const currentlyReading = student.books
    .filter(book => book.status === 'reading')
    .sort((a, b) => (b.lastReadDate?.getTime() || 0) - (a.lastReadDate?.getTime() || 0))[0];

  // Generate daily reading progress data for the last 7 days
  const generateDailyData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Simulate reading progress for each day (in a real app, this would come from sessions)
      const progress = Math.random() * 20; // 0-20 pages read per day
      
      days.push({
        day: dayName,
        pages: Math.round(progress),
        date: date.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const dailyData = generateDailyData();

  const chartConfig = {
    pages: {
      label: "Pages Read",
      color: "#3b82f6",
    },
  };

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
          <div className="flex-1">
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {student.books.length} books assigned
            </p>
          </div>
          {currentlyReading && (
            <div className="w-16 h-20 rounded-md overflow-hidden shadow-sm">
              <img 
                src={currentlyReading.book.cover} 
                alt={currentlyReading.book.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
                <span>Last read: {currentlyReading.lastReadDate.toLocaleDateString()} at {currentlyReading.lastReadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No books currently being read
          </div>
        )}

        {/* Daily Reading Progress Chart */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Reading Activity (Last 7 Days)</p>
          <div className="h-16">
            <ChartContainer config={chartConfig}>
              <BarChart data={dailyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="pages" 
                  fill="var(--color-pages)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
        
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
