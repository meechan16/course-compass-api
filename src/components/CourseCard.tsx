
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";

interface CourseCardProps {
  courseCode: string;
  name: string;
  instructor: string;
  gradingScheme?: 'linear' | 'gaussian';
}

const CourseCard = ({ courseCode, name, instructor, gradingScheme }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-edu-gray-50 border-edu-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-edu-blue-50 rounded-full">
              <BookOpen className="h-5 w-5 text-edu-blue-500" />
            </div>
            <span className="text-sm font-medium text-edu-blue-500 bg-edu-blue-50 px-2 py-1 rounded">
              {courseCode}
            </span>
          </div>
          {gradingScheme && (
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 text-edu-purple-500 mr-1" />
              <span className="text-xs text-edu-purple-500 font-medium capitalize">
                {gradingScheme} Grading
              </span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center">
          <span className="text-sm text-gray-600">Instructor: {instructor}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-1 w-full bg-edu-gray-100 rounded">
          <div className="h-1 rounded bg-gradient-edu w-2/3"></div>
        </div>
        <p className="text-sm text-right mt-1 text-gray-500">Course progress</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full hover:bg-edu-blue-50 hover:text-edu-blue-600 transition-colors"
          onClick={() => navigate(`/courses/${courseCode}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
