import { useState } from "react";
import { StudentCard } from "@/components/StudentCard";
import { StudentList } from "@/components/StudentList";
import { StudentDetail } from "@/components/StudentDetail";
import { BookDetail } from "@/components/BookDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Users,
  BarChart3,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  Loader2,
} from "lucide-react";
import { Student, StudentBook } from "@/types/reading";
import { useStudents } from "@/hooks/useStudents";

export default function Index() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<StudentBook | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: students = [], isLoading, error } = useStudents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 text-lg">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading students</p>
          <p className="text-gray-600">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  const totalStudents = students.length;
  const totalCompleted = students.reduce(
    (sum, student) => sum + student.totalBooksCompleted,
    0,
  );
  const activelyReading = students.filter((student) =>
    student.books.some((book) => book.status === "reading"),
  ).length;
  const averageProgress =
    totalStudents > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.averageProgress, 0) /
            totalStudents,
        )
      : 0;

  const generateDynamicSummary = () => {
    if (totalStudents === 0)
      return "No students enrolled yet. Add some students to get started!";

    const completionRate = Math.round(
      (totalCompleted / (totalStudents * 5)) * 100,
    ); // Assuming 5 books per student target
    const activeReadingRate = Math.round(
      (activelyReading / totalStudents) * 100,
    );

    if (completionRate >= 80 && activeReadingRate >= 70) {
      return `Class performance analysis: ${totalStudents} students have achieved an excellent completion rate with ${totalCompleted} books finished. ${activelyReading} students are currently engaged in active reading.`;
    } else if (completionRate >= 60 && activeReadingRate >= 50) {
      return `Class progress summary: ${totalStudents} students have completed ${totalCompleted} books total. Current engagement shows ${activelyReading} students actively reading, indicating positive momentum.`;
    } else if (activeReadingRate >= 60) {
      return `Reading engagement report: ${activelyReading} of ${totalStudents} students are currently reading. Focus on supporting completion rates to maximize learning outcomes.`;
    } else if (totalCompleted >= 20) {
      return `Completion overview: ${totalCompleted} books have been finished across ${totalStudents} students. Consider strategies to increase active reading participation.`;
    } else {
      return `Initial assessment: ${totalStudents} students are beginning their reading program. Establishing consistent reading habits will be the primary focus.`;
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
    <div className="space-y-6">
      {/* Dynamic Summary */}
      <div className="text-left mb-8 mt-8">
        <h2 className="text-2xl font-serif font-medium text-gray-800 leading-relaxed">
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
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      ) : (
        <StudentList students={students} onStudentClick={setSelectedStudent} />
      )}

      {students.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No students yet
          </h3>
          <p className="text-gray-500">
            Add some students to get started with your reading program.
          </p>
        </div>
      )}
    </div>
  );
}
