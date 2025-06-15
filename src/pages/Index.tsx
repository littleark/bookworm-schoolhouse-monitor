import React, { useState } from 'react';
import { mockStudents } from '@/data/mockData';
import { Student, StudentBook } from '@/types/reading';
import { StudentCard } from '@/components/StudentCard';
import { StudentList } from '@/components/StudentList';
import { StudentDetail } from '@/components/StudentDetail';
import { BookDetail } from '@/components/BookDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Book, User, Search, BookOpen, GraduationCap, Grid, List } from 'lucide-react';

type View = 'students' | 'student-detail' | 'book-detail';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<StudentBook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = mockStudents.length;
  const totalBooks = mockStudents.reduce((sum, student) => sum + student.books.length, 0);
  const completedBooks = mockStudents.reduce((sum, student) => sum + student.totalBooksCompleted, 0);
  const averageProgress = Math.round(
    mockStudents.reduce((sum, student) => sum + student.averageProgress, 0) / totalStudents
  );

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('student-detail');
  };

  const handleBookClick = (book: StudentBook) => {
    setSelectedBook(book);
    setCurrentView('book-detail');
  };

  const handleBackToStudents = () => {
    setCurrentView('students');
    setSelectedStudent(null);
    setSelectedBook(null);
  };

  const handleBackToStudent = () => {
    setCurrentView('student-detail');
    setSelectedBook(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'student-detail':
        return selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={handleBackToStudents}
            onBookClick={handleBookClick}
          />
        ) : null;
        
      case 'book-detail':
        return selectedBook && selectedStudent ? (
          <BookDetail
            studentBook={selectedBook}
            studentName={selectedStudent.name}
            onBack={handleBackToStudent}
          />
        ) : null;
        
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reading Progress Dashboard
                </h1>
                <p className="text-muted-foreground">Track your students' reading journey</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid" className="flex items-center gap-2">
                      <Grid className="w-4 h-4" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
                  <p className="text-sm text-blue-600">Students</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-700">{completedBooks}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 text-center">
                  <Book className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-700">{totalBooks}</p>
                  <p className="text-sm text-purple-600">Total Books</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-4 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold text-orange-700">{averageProgress}%</p>
                  <p className="text-sm text-orange-600">Avg Progress</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Students ({filteredStudents.length})
              </h2>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={() => handleStudentClick(student)}
                    />
                  ))}
                </div>
              ) : (
                <StudentList
                  students={filteredStudents}
                  onStudentClick={handleStudentClick}
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  bookworm
                </h1>
                <p className="text-xs text-muted-foreground">Reading Progress Tracker</p>
              </div>
            </div>
            
            {/* Navigation options placeholder */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Teacher Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
