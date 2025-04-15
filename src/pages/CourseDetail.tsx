
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchComponentScores, fetchTotalScore } from "@/lib/api";
import ScoreTable from "@/components/ScoreTable";
import PredictionCalculator from "@/components/PredictionCalculator";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

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
    
    // Get course data from localStorage if available
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const course = courses.find((c: any) => c.CourseCode === courseCode);
    if (course) {
      setCourseData({
        name: course.Name,
        instructor: course.Instructor
      });
    }
    
    const loadCourseData = async () => {
      try {
        setLoading(true);
        
        const [scoresData, totalScoreData] = await Promise.all([
          fetchComponentScores(storedRollNumber, courseCode),
          fetchTotalScore(storedRollNumber, courseCode)
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
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 flex items-center" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              {courseData?.name || courseCode}
            </h1>
            {courseData?.instructor && (
              <p className="text-gray-500">Instructor: {courseData.instructor}</p>
            )}
          </div>
          
          {totalScore && (
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Total Score</div>
                <div className="text-xl font-bold">{totalScore.total_score.toFixed(2)}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Grade</div>
                <div className="text-xl font-bold">{totalScore.grade.toFixed(1)}</div>
              </div>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scores">Component Scores</TabsTrigger>
            <TabsTrigger value="predict">Grade Prediction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scores">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-2"></div>
                <div className="h-64 bg-gray-100 rounded"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : scores.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Component Scores</CardTitle>
                  <CardDescription>
                    View your scores for each assessment component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreTable scores={scores} />
                </CardContent>
              </Card>
            ) : (
              <EmptyState 
                title="No scores available"
                description="Your component scores will appear here once they are assigned."
              />
            )}
          </TabsContent>
          
          <TabsContent value="predict">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-100 rounded"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <PredictionCalculator 
                  rollNumber={rollNumber} 
                  courseCode={courseCode || ""} 
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>
                      Understanding the grade prediction tool
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      The grade prediction tool calculates the scores you need in the remaining 
                      assessment components to achieve your target grade.
                    </p>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Key terms:</h4>
                      <ul className="space-y-1 text-sm">
                        <li><strong>Current Total:</strong> Your total score so far from completed components</li>
                        <li><strong>Remaining %:</strong> Percentage weight of components not yet completed</li>
                        <li><strong>Required Marks:</strong> Score needed in remaining components to achieve target</li>
                        <li><strong>Achievable:</strong> Whether your target is mathematically possible</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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

export default CourseDetail;
