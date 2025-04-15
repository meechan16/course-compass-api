
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [activeTab, setActiveTab] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      setError("Please enter your roll number");
      return;
    }
    
    // Store roll number in localStorage and navigate to dashboard
    localStorage.setItem("rollNumber", rollNumber);
    navigate("/dashboard");
  };

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instructorId.trim()) {
      setError("Please enter your instructor ID");
      return;
    }
    
    // Store instructor ID in localStorage and navigate to instructor dashboard
    localStorage.setItem("instructorId", instructorId);
    navigate("/instructor/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">CourseCompass</h1>
        <p className="text-gray-500 mt-2">Track academic progress and manage grades</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="student" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <form onSubmit={handleStudentSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      placeholder="e.g., CS2021001"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                    />
                    {activeTab === "student" && error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Continue as Student</Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="instructor">
            <form onSubmit={handleInstructorSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructorId">Instructor ID</Label>
                    <Input
                      id="instructorId"
                      placeholder="e.g., PROF001"
                      value={instructorId}
                      onChange={(e) => setInstructorId(e.target.value)}
                    />
                    {activeTab === "instructor" && error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Continue as Instructor</Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>For testing, use any roll number (e.g., CS2021001) or instructor ID (e.g., PROF001)</p>
      </div>
    </div>
  );
};

export default Index;
