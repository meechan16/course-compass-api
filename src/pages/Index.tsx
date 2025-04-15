
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      setError("Please enter your roll number");
      return;
    }
    
    // Store roll number in localStorage and navigate to dashboard
    localStorage.setItem("rollNumber", rollNumber);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">CourseCompass</h1>
        <p className="text-gray-500 mt-2">Track your academic progress and predict your grades</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Student Login</CardTitle>
          <CardDescription>Enter your roll number to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Continue</Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>For testing, use any roll number such as CS2021001</p>
      </div>
    </div>
  );
};

export default Index;
