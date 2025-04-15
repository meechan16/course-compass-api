
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, GraduationCap, User } from "lucide-react";
import Header from "@/components/Header";

const Index = () => {
  const [rollNumber, setRollNumber] = useState("");
  const navigate = useNavigate();
  
  // Check if a roll number is stored in localStorage
  useEffect(() => {
    const storedRollNumber = localStorage.getItem("rollNumber");
    if (storedRollNumber) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (rollNumber.trim()) {
      localStorage.setItem("rollNumber", rollNumber);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12 md:py-24 flex-1 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl font-bold mb-4">Welcome to CourseCompass</h1>
            <p className="text-xl text-gray-600 mb-8">
              Track your academic performance, view course details, and plan your studies with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card className="md:col-span-2">
              <CardHeader className="text-center">
                <CardTitle>Student Login</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roll-number">Roll Number</Label>
                    <Input 
                      id="roll-number" 
                      placeholder="Enter your roll number" 
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleLogin}>
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" /> 
                  Course Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  View all your enrolled courses, check your progress, and track component scores for each course.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" /> 
                  Grade Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Use our grade prediction tool to calculate the scores you need to achieve your target grade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CourseCompass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
