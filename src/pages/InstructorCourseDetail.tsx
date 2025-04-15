
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { fetchStudentsInCourse } from "@/lib/api";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { ArrowLeft, Search, Edit } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const instructorId = localStorage.getItem("instructorId");

  useEffect(() => {
    // Redirect to login if instructor ID is not present
    if (!instructorId || !courseCode) {
      navigate("/");
      return;
    }

    const loadStudents = async () => {
      try {
        const data = await fetchStudentsInCourse(instructorId, courseCode);
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        setError("Failed to load students in course");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [instructorId, courseCode, navigate]);

  // Filter students based on search query
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

  const handleGoBack = () => {
    navigate("/instructor/dashboard");
  };

  const handleEditStudent = (rollNumber: string) => {
    navigate(`/instructor/students/${rollNumber}/${courseCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header rollNumber={instructorId} />
      
      <main className="container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          className="mb-4 hover:bg-gray-200"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Course: {courseCode}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Search className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students by name or roll number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {loading ? (
              <div className="h-48 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : error ? (
              <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
                {error}
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.RollNumber}>
                      <TableCell>{student.RollNumber}</TableCell>
                      <TableCell>{student.Name}</TableCell>
                      <TableCell>{student.CurrentGrade.toFixed(1)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditStudent(student.RollNumber)}
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
