import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchStudentsInCourse } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { ArrowLeft, Search, Edit, GraduationCap } from "lucide-react";

interface Student {
  RollNumber: string;
  Name: string;
  CurrentGrade: number;
}

const InstructorCourseDetail = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradingScheme, setGradingScheme] = useState<'linear' | 'gaussian'>('linear');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const instructorId = localStorage.getItem("instructorId");

  useEffect(() => {
    if (!instructorId || !courseCode) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const [studentsData, schemeData] = await Promise.all([
          fetchStudentsInCourse(instructorId, courseCode),
          fetch(`/instructors/${instructorId}/courses/${courseCode}/grading_scheme`).then(res => res.json())
        ]);
        setStudents(studentsData);
        setFilteredStudents(studentsData);
        setGradingScheme(schemeData.grading_scheme);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [instructorId, courseCode, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        student =>
          student.Name.toLowerCase().includes(query) ||
          student.RollNumber.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleGradingSchemeChange = async (value: 'linear' | 'gaussian') => {
    try {
      const response = await fetch(`/instructors/${instructorId}/courses/${courseCode}/grading_scheme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grading_scheme: value }),
      });
      if (!response.ok) throw new Error("Failed to update grading scheme");
      setGradingScheme(value);
      toast({
        title: "Grading Scheme Updated",
        description: `Course ${courseCode} will now use ${value} grading.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update grading scheme",
        variant: "destructive",
      });
    }
  };

  const handleAssignGrades = async () => {
    try {
      const response = await fetch(`/instructors/${instructorId}/courses/${courseCode}/assign_grades`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to assign grades");
      const updatedStudents = await fetchStudentsInCourse(instructorId, courseCode!);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      toast({
        title: "Grades Assigned",
        description: `Grades have been assigned using ${gradingScheme} grading.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign grades",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header rollNumber={instructorId} />
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <Button
            variant="ghost"
            className="hover:bg-gray-200"
            onClick={() => navigate("/instructor/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="default"
            onClick={handleAssignGrades}
            disabled={loading}
          >
            Assign Grades
          </Button>
        </div>
        <Card className="mb-6">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-6 w-6 text-blue-500" />
                Course: {courseCode}
              </CardTitle>
              <Select value={gradingScheme} onValueChange={handleGradingSchemeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select grading scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Grading</SelectItem>
                  <SelectItem value="gaussian">Gaussian Grading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students by name or roll number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 rounded-lg bg-gray-100 animate-pulse"></div>
            ) : error ? (
              <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
                {error}
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.RollNumber} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">{student.RollNumber}</TableCell>
                      <TableCell>{student.Name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-50 text-purple-500">
                          {student.CurrentGrade ? student.CurrentGrade.toFixed(1) : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/instructor/students/${student.RollNumber}/${courseCode}`)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="No students found"
                description="No students are enrolled in this course yet, or your search returned no results."
                icon="users"
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstructorCourseDetail;