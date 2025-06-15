
import { Student } from '@/types/reading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, User } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const [chartDays, setChartDays] = useState<7 | 30>(7);
  
  const activeBooks = student.books.filter(book => book.status === 'reading').length;
  const currentlyReading = student.books
    .filter(book => book.status === 'reading')
    .sort((a, b) => (b.lastReadDate?.getTime() || 0) - (a.lastReadDate?.getTime() || 0))[0];

  // Generate daily reading progress data for the specified number of days
  const generateDailyData = (days: number) => {
    const dataPoints = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days === 7 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.getDate().toString();
      
      // Simulate reading progress for each day (in a real app, this would come from sessions)
      const progress = Math.random() * 20; // 0-20 pages read per day
      
      // Determine if this is for current book (last 30% of days) or old books
      const isCurrentBook = i < Math.ceil(days * 0.3);
      
      dataPoints.push({
        day: dayName,
        pages: Math.round(progress),
        date: date.toISOString().split('T')[0],
        isCurrentBook
      });
    }
    
    return dataPoints;
  };

  const dailyData = generateDailyData(chartDays);

  const chartConfig = {
    pages: {
      label: "Pages Read",
      color: "#9ca3af", // Gray for old books
    },
    currentPages: {
      label: "Current Book Pages",
      color: "#374151", // Dark gray for current book
    },
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white shadow-sm h-fit"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900">{student.name}</CardTitle>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-3 h-3" />
              {student.books.length} books assigned
            </p>
          </div>
          {currentlyReading && (
            <div className="w-16 h-20 rounded-md overflow-hidden">
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
        <div className="min-h-[80px]">
          {currentlyReading ? (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium truncate text-gray-900">{currentlyReading.book.title}</span>
                <span className="font-medium text-gray-900">{currentlyReading.progress}%</span>
              </div>
              <Progress value={currentlyReading.progress} className="h-2 bg-gray-200" />
              {currentlyReading.lastReadDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>Last read: {currentlyReading.lastReadDate.toLocaleDateString()} at {currentlyReading.lastReadDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No books currently being read
            </div>
          )}
        </div>

        {/* Daily Reading Progress Chart */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-900">Reading Activity</p>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChartDays(7);
                }}
                className={`text-xs px-2 py-1 rounded ${
                  chartDays === 7 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                7d
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChartDays(30);
                }}
                className={`text-xs px-2 py-1 rounded ${
                  chartDays === 30 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                30d
              </button>
            </div>
          </div>
          <div className="h-[100px] w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar 
                    dataKey="pages" 
                    radius={[1, 1, 0, 0]}
                  >
                    {dailyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCurrentBook ? "#374151" : "#9ca3af"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Book className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">{student.totalBooksCompleted} completed</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            {activeBooks} reading
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
