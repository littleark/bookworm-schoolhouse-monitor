import { useState } from "react";
import { StudentCard } from "@/components/StudentCard";
import { StudentList } from "@/components/StudentList";
import { StudentDetail } from "@/components/StudentDetail";
import { BookDetail } from "@/components/BookDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Book,
  Users,
  BarChart3,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  BookOpen,
} from "lucide-react";
import { mockStudents } from "@/data/mockData";
import { Student, StudentBook } from "@/types/reading";

export default function Index() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<StudentBook | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalStudents = mockStudents.length;
  const totalCompleted = mockStudents.reduce(
    (sum, student) => sum + student.totalBooksCompleted,
    0,
  );
  const activelyReading = mockStudents.filter((student) =>
    student.books.some((book) => book.status === "reading"),
  ).length;
  const averageProgress =
    totalStudents > 0
      ? Math.round(
          mockStudents.reduce(
            (sum, student) => sum + student.averageProgress,
            0,
          ) / totalStudents,
        )
      : 0;

  const generateDynamicSummary = () => {
    if (totalStudents === 0) return "No students enrolled yet.";

    const completionRate = Math.round(
      (totalCompleted / (totalStudents * 5)) * 100,
    ); // Assuming 5 books per student target
    const activeReadingRate = Math.round(
      (activelyReading / totalStudents) * 100,
    );

    if (completionRate >= 80 && activeReadingRate >= 70) {
      return `Outstanding! ${totalStudents} students are excelling with ${totalCompleted} books completed and ${activelyReading} actively reading. Keep up the amazing work! 📚`;
    } else if (completionRate >= 60 && activeReadingRate >= 50) {
      return `Great progress! Your ${totalStudents} students have completed ${totalCompleted} books with ${activelyReading} currently reading. The momentum is building! 🌟`;
    } else if (activeReadingRate >= 60) {
      return `Strong engagement! ${activelyReading} of ${totalStudents} students are actively reading. Let's help them reach the finish line! 💪`;
    } else if (totalCompleted >= 20) {
      return `Solid foundation! ${totalCompleted} books completed across ${totalStudents} students. Time to re-energize the reading habit! 🚀`;
    } else {
      return `Starting the journey! ${totalStudents} students are beginning their reading adventure. Every great reader started with a single page! ✨`;
    }
  };

  if (selectedBook) {
    return (
      <BookDetail
        studentBook={selectedBook}
        studentName={selectedStudent ? selectedStudent.name : ""}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  if (selectedStudent) {
    return (
      <StudentDetail
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
        onBookClick={setSelectedBook}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookworm</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">
                Teacher's Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dynamic Summary */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {generateDynamicSummary()}
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalStudents}
                </div>
                <p className="text-xs text-gray-500">enrolled students</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Books Completed
                </CardTitle>
                <Book className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalCompleted}
                </div>
                <p className="text-xs text-gray-500">across all students</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Currently Reading
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {activelyReading}
                </div>
                <p className="text-xs text-gray-500">students reading now</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  Average Progress
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {averageProgress}%
                </div>
                <p className="text-xs text-gray-500">completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Students</h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="text-xs"
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="text-xs"
              >
                <LayoutList className="w-4 h-4 mr-1" />
                List
              </Button>
            </div>
          </div>

          {/* Students Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onClick={() => setSelectedStudent(student)}
                />
              ))}
            </div>
          ) : (
            <StudentList
              students={mockStudents}
              onStudentClick={setSelectedStudent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
