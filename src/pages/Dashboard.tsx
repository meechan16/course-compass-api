
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStudentCourses } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { BookOpen, RefreshCw } from "lucide-react";

interface Course {
  CourseCode: string;
  Name: string;
  Instructor: string;
}

const Dashboard = () => {
  const [rollNumber, setRollNumber] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedRollNumber = localStorage.getItem("rollNumber");
    if (!storedRollNumber) {
      // For demo purposes, set a default roll number
      const defaultRollNumber = "CS2021001";
      localStorage.setItem("rollNumber", defaultRollNumber);
      setRollNumber(defaultRollNumber);
    } else {
      setRollNumber(storedRollNumber);
    }
    
    const loadCourses = async () => {
      try {
        setLoading(true);
        // Use the roll number from state or the default/stored one
        const student_roll = storedRollNumber || "CS2021001";
        const data = await fetchStudentCourses(student_roll);
        setCourses(data);
        // Store courses in localStorage for use in CourseDetail
        localStorage.setItem("courses", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, [navigate]);

  const handleRefresh = async () => {
    if (!rollNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStudentCourses(rollNumber);
      setCourses(data);
      // Update localStorage on refresh as well
      localStorage.setItem("courses", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to refresh courses:", err);
      setError("Failed to refresh courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header rollNumber={rollNumber} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BookOpen className="h-6 w-6 mr-2" /> 
            My Courses
          </h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 h-48 rounded-lg"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.CourseCode}
                    courseCode={course.CourseCode}
                    name={course.Name}
                    instructor={course.Instructor}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No courses found"
                description="You are not enrolled in any courses at the moment."
              />
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            <EmptyState 
              title="No completed courses"
              description="Your completed courses will appear here."
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CourseCompass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
