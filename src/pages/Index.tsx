
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

  // Generate class summary sentence
  const generateClassSummary = () => {
    const activeReaders = mockStudents.filter(student => 
      student.books.some(book => book.status === 'reading')
    ).length;
    const completionRate = Math.round((completedBooks / totalBooks) * 100);
    
    if (averageProgress >= 80) {
      return `Your class is excelling with ${averageProgress}% average progress! ${activeReaders} students are actively reading and maintaining excellent momentum.`;
    } else if (averageProgress >= 60) {
      return `Your class is making solid progress with ${averageProgress}% completion rate. ${activeReaders} students are currently engaged in reading activities.`;
    } else if (averageProgress >= 40) {
      return `Your class is building reading habits with ${averageProgress}% average progress. ${activeReaders} students are actively working through their books.`;
    } else {
      return `Your class is in the early stages of their reading journey with ${activeReaders} students currently reading. Great potential for growth ahead!`;
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">
                  Reading Progress Dashboard
                </h1>
                <p className="text-gray-600">Track your students' reading journey</p>
              </div>
            </div>

            {/* Class Summary */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-lg font-bold text-gray-900 leading-relaxed">
                  {generateClassSummary()}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">{completedBooks}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <Book className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
                  <p className="text-sm text-gray-600">Total Books</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-4 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5" />
                  Students ({filteredStudents.length})
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 bg-white"
                    />
                  </div>
                  
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  bookworm
                </h1>
                <p className="text-xs text-gray-600">Reading Progress Tracker</p>
              </div>
            </div>
            
            {/* Navigation options placeholder */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Teacher Dashboard</span>
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
