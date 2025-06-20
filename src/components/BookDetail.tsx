import { StudentBook } from "@/types/reading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Calendar, Clock, FileText } from "lucide-react";

interface BookDetailProps {
  studentBook: StudentBook;
  studentName: string;
  onBack: () => void;
}

export function BookDetail({
  studentBook,
  studentName,
  onBack,
}: BookDetailProps) {
  const totalTimeSpent = studentBook.sessions.reduce(
    (total, session) => total + session.timeSpent,
    0,
  );
  const totalPagesRead = studentBook.sessions.reduce(
    (total, session) => total + session.pagesRead,
    0,
  );
  const averageSessionTime =
    studentBook.sessions.length > 0
      ? totalTimeSpent / studentBook.sessions.length
      : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "reading":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {studentName}
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex gap-6">
            <img
              src={studentBook.book.cover}
              alt={studentBook.book.title}
              className="w-24 h-32 object-cover rounded-lg bg-gray-200 shadow-md"
            />
            <div className="flex-1 space-y-3">
              <div>
                <CardTitle className="text-xl">
                  {studentBook.book.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  by {studentBook.book.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  Reading progress for {studentName}
                </p>
              </div>

              <Badge className={getStatusColor(studentBook.status)}>
                {studentBook.status.replace("-", " ")}
              </Badge>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-bold text-lg">
                    {studentBook.progress}%
                  </span>
                </div>
                <Progress
                  value={studentBook.progress}
                  className="h-3 [&>div]:bg-[#E85C33]"
                  style={{ backgroundColor: "white" }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">
              {Math.round(totalTimeSpent / 60)}h
            </p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Book className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{totalPagesRead}</p>
            <p className="text-sm text-muted-foreground">Pages Read</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{studentBook.sessions.length}</p>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">
              {Math.round(averageSessionTime)}
            </p>
            <p className="text-sm text-muted-foreground">Avg Minutes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reading Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentBook.sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reading sessions recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {studentBook.sessions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((session) => (
                  <Card key={session.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {session.date.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.timeSpent} minutes
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                        <span>{session.pagesRead} pages read</span>
                      </div>

                      {session.notes && (
                        <div className="bg-white p-2 rounded text-sm border-l-4 border-blue-200">
                          <p className="text-xs text-muted-foreground mb-1">
                            Notes:
                          </p>
                          <p>{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
