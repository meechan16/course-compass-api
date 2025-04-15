
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  courseCode: string;
  name: string;
  instructor: string;
}

const CourseCard = ({ courseCode, name, instructor }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between">
          <span>{name}</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {courseCode}
          </span>
        </CardTitle>
        <CardDescription>Instructor: {instructor}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-1 w-full bg-gray-200 rounded">
          <div className="h-1 rounded bg-blue-500 w-2/3"></div>
        </div>
        <p className="text-sm text-right mt-1 text-gray-500">Course progress</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/courses/${courseCode}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
