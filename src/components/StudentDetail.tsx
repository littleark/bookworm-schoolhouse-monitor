import { Student, StudentBook } from "@/types/reading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Calendar, Clock, BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
  onBookClick: (book: StudentBook) => void;
}

export function StudentDetail({
  student,
  onBack,
  onBookClick,
}: StudentDetailProps) {
  const [chartDays, setChartDays] = useState<7 | 30>(30);

  // Generate a consistent color for each student based on their name
  const getStudentColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-purple-500",
      "bg-gradient-to-br from-green-400 to-blue-500",
      "bg-gradient-to-br from-purple-400 to-pink-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-pink-400 to-red-500",
      "bg-gradient-to-br from-indigo-400 to-purple-500",
      "bg-gradient-to-br from-green-400 to-teal-500",
      "bg-gradient-to-br from-orange-400 to-red-500",
    ];

    const hash = name.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  // Generate student progress summary
  const generateProgressSummary = () => {
    const currentlyReading = student.books.filter(
      (book) => book.status === "reading",
    ).length;
    const recentlyActive = student.books.filter(
      (book) =>
        book.lastReadDate &&
        (new Date().getTime() - book.lastReadDate.getTime()) /
          (1000 * 60 * 60 * 24) <=
          3,
    ).length;

    if (student.averageProgress >= 85) {
      return `${student.name} is an exceptional reader with ${student.averageProgress}% correct spelling and ${student.totalBooksCompleted} book${student.totalBooksCompleted > 1 ? "s" : ""} completed!`;
    } else if (student.averageProgress >= 70) {
      return `${student.name} is making excellent progress with ${student.averageProgress}% correct spelling rate and ${currentlyReading} book${currentlyReading > 1 ? "s" : ""} currently in progress.`;
    } else if (student.averageProgress >= 50) {
      return `${student.name} is steadily progressing through their reading journey with ${student.totalBooksCompleted} book${student.totalBooksCompleted > 1 ? "s" : ""} completed so far.`;
    } else if (recentlyActive > 0) {
      return `${student.name} is actively building their reading habits with recent activity on ${recentlyActive} book${recentlyActive > 1 ? "s" : ""}.`;
    } else {
      return `${student.name} has great potential and is ready to dive deeper into their reading adventure!`;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-gray-100 text-gray-800",
      reading: "bg-gray-800 text-white",
      paused: "bg-gray-200 text-gray-700",
      "yet-to-start": "bg-gray-50 text-gray-600",
    };

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants["yet-to-start"]
        }
      >
        {status.replace("-", " ")}
      </Badge>
    );
  };

  // Generate daily reading progress data
  const generateDailyData = (days: number) => {
    const dataPoints = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName =
        days === 7
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.getDate().toString();

      // Simulate reading progress for each day
      const progress = Math.random() * 10; // 0-25 pages read per day

      // Determine if this is for current book (last 30% of days) or old books
      const isCurrentBook = i < Math.ceil(days * 0.3);

      dataPoints.push({
        day: dayName,
        pages: Math.round(progress),
        date: date.toISOString().split("T")[0],
        isCurrentBook,
      });
    }

    return dataPoints;
  };

  // Generate daily spelling activity data
  const generateSpellingData = (days: number) => {
    const dataPoints = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName =
        days === 7
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.getDate().toString();

      // Simulate spelling activity for each day
      const totalAttempts = Math.floor(Math.random() * 5) + 5; // 5-25 spelling attempts per day
      const successRate = 0.6 + Math.random() * 0.3; // 60-90% success rate
      const successfulSpelling = Math.round(totalAttempts * successRate);
      const wrongSpelling = totalAttempts - successfulSpelling;

      dataPoints.push({
        day: dayName,
        successfulSpelling,
        wrongSpelling,
        date: date.toISOString().split("T")[0],
      });
    }

    return dataPoints;
  };

  const dailyData = generateDailyData(chartDays);
  const spellingData = generateSpellingData(chartDays);

  const chartConfig = {
    pages: {
      label: "Minutes",
      color: "#9ca3af", // Gray for old books
    },
    currentPages: {
      label: "Current Book Minutes",
      color: "#8b5cf6", // Purple for current book
    },
  };

  const spellingChartConfig = {
    successfulSpelling: {
      label: "Correct",
      color: "#10b981", // Green for successful
    },
    wrongSpelling: {
      label: "Wrong",
      color: "#ef4444", // Red for wrong
    },
  };

  const answersChartConfig = {
    successfulSpelling: {
      label: "In-context",
      color: "#10b981", // Green for successful
    },
    wrongSpelling: {
      label: "Out-of-context",
      color: "#ef4444", // Red for wrong
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 ${getStudentColor(student.name)} rounded-full flex items-center justify-center text-white font-bold text-xl`}
            >
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900">
                {student.name}
              </CardTitle>
              <p className="text-gray-600">
                {student.totalBooksCompleted} books completed •{" "}
                {student.books.length} total assigned
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Student Progress Summary - integrated with background */}
          <div className="mb-6">
            <p className="text-lg font-bold text-gray-900 leading-relaxed">
              {generateProgressSummary()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {student.totalBooksCompleted}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {student.averageProgress}%
              </p>
              <p className="text-sm text-gray-600">Correct spelling</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {student.books.filter((b) => b.status === "reading").length}
              </p>
              <p className="text-sm text-gray-600">Currently Reading</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Activity Chart */}
      {/* <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Talking time
            </CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setChartDays(7)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 7
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 30
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                30 days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{
                      top: 10,
                    }}
                    label={{
                      value: "Minutes",
                      angle: 0,
                      position: "top",
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="pages" radius={[2, 2, 0, 0]}>
                    {dailyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isCurrentBook ? "#E85C33" : "#9ca3af"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-gray-600">Previous books</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E85C33] rounded"></div>
              <span className="text-gray-600">Current book</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card id="anwersActivity" className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Question answered
            </CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setChartDays(7)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 7
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 30
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                30 days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={spellingChartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={spellingData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{
                      top: 10,
                    }}
                    label={{
                      value: "Attempts",
                      angle: 0,
                      position: "top",
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar
                    dataKey="successfulSpelling"
                    stackId="spelling"
                    fill="#E85C33"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="wrongSpelling"
                    stackId="spelling"
                    fill="#9ca3af"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9ca3af] rounded"></div>
              <span className="text-gray-600">Out-of-context answers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E85C33] rounded"></div>
              <span className="text-gray-600">In-context answers</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card id="spellingActivity" className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Spelling Activity
            </CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setChartDays(7)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 7
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`text-xs px-3 py-1 rounded ${
                  chartDays === 30
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                30 days
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={answersChartConfig}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={spellingData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{
                      top: 10,
                    }}
                    label={{
                      value: "Attempts",
                      angle: 0,
                      position: "top",
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar
                    dataKey="successfulSpelling"
                    stackId="spelling"
                    fill="#E85C33"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="wrongSpelling"
                    stackId="spelling"
                    fill="#9ca3af"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9ca3af] rounded"></div>
              <span className="text-gray-600">Wrong spelling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E85C33] rounded"></div>
              <span className="text-gray-600">Correct spelling</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Book className="w-5 h-5" />
          Assigned Books
        </h3>

        {student.books.map((studentBook) => (
          <Card
            key={studentBook.id}
            className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-white shadow-sm transform"
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
                      <h4 className="font-medium text-gray-900">
                        {studentBook.book.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {studentBook.book.author}
                      </p>
                    </div>
                    {getStatusBadge(studentBook.status)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {studentBook.progress}%
                      </span>
                    </div>
                    <Progress
                      value={studentBook.progress}
                      className={`h-2 ${studentBook.status === "reading" ? "[&>div]:bg-[#E85C33]" : ""} bg-gray-200`}
                    />
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Assigned: {studentBook.assignedDate.toLocaleDateString()}
                    </div>
                    {studentBook.lastReadDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last read:{" "}
                        {studentBook.lastReadDate.toLocaleDateString()}
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
