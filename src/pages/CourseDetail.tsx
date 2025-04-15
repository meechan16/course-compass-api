import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchComponentScores, fetchTotalScore } from "@/lib/api";
import Header from "@/components/Header";
import CourseHeader from "@/components/CourseHeader";
import CourseScoreDisplay from "@/components/CourseScoreDisplay";
import CourseScoreTab from "@/components/CourseScoreTab";
import CoursePredictionTab from "@/components/CoursePredictionTab";

interface ComponentScore {
  ComponentName: string;
  Percentage: number;
  Score: number;
}

interface TotalScore {
  total_score: number;
  grade: number;
}

const CourseDetail = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState<string>("");
  const [courseData, setCourseData] = useState<{ name: string; instructor: string } | null>(null);
  const [scores, setScores] = useState<ComponentScore[]>([]);
  const [totalScore, setTotalScore] = useState<TotalScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedRollNumber = localStorage.getItem("rollNumber");
    if (!storedRollNumber || !courseCode) {
      navigate("/");
      return;
    }
    setRollNumber(storedRollNumber);

    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const course = courses.find((c: any) => c.CourseCode === courseCode);
    if (course) {
      setCourseData({
        name: course.Name,
        instructor: course.Instructor,
      });
    }

    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [scoresData, totalScoreData] = await Promise.all([
          fetchComponentScores(storedRollNumber, courseCode),
          fetchTotalScore(storedRollNumber, courseCode),
        ]);
        setScores(scoresData);
        setTotalScore(totalScoreData);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header rollNumber={rollNumber} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <CourseHeader
          courseCode={courseCode || ""}
          courseName={courseData?.name}
          instructor={courseData?.instructor}
        />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div></div>
          <CourseScoreDisplay totalScore={totalScore} />
        </div>
        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scores">Component Scores</TabsTrigger>
            <TabsTrigger value="predict">Grade Prediction</TabsTrigger>
          </TabsList>
          <TabsContent value="scores">
            <CourseScoreTab
              loading={loading}
              error={error}
              scores={scores}
            />
          </TabsContent>
          <TabsContent value="predict">
            <CoursePredictionTab
              loading={loading}
              rollNumber={rollNumber}
              courseCode={courseCode || ""}
            />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} CourseCompass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetail;