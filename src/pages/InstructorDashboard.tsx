import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInstructorCourses } from "@/lib/api";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { GraduationCap } from "lucide-react";

interface Course {
  CourseCode: string;
  Name: string;
}

const InstructorDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const instructorId = localStorage.getItem("instructorId");

  useEffect(() => {
    if (!instructorId) {
      navigate("/");
      return;
    }

    const loadCourses = async () => {
      try {
        const data = await fetchInstructorCourses(instructorId);
        setCourses(data);
      } catch (err) {
        setError("Failed to load instructor courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [instructorId, navigate]);

  const handleCourseClick = (courseCode: string) => {
    navigate(`/instructor/courses/${courseCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header rollNumber={instructorId} />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <p className="text-gray-500">Manage your courses and student grades</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
            {error}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card
                key={course.CourseCode}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCourseClick(course.CourseCode)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="text-blue-500" />
                    {course.Name}
                  </CardTitle>
                  <CardDescription>{course.CourseCode}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Click to manage students and grades</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses found"
            description="You are not assigned to any courses yet."
            icon="school"
          />
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;