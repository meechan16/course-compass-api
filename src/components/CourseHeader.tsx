
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseHeaderProps {
  courseCode: string;
  courseName?: string;
  instructor?: string;
}

const CourseHeader = ({ courseCode, courseName, instructor }: CourseHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
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
            {courseName || courseCode}
          </h1>
          {instructor && (
            <p className="text-gray-500">Instructor: {instructor}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseHeader;
