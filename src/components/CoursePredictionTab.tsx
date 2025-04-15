
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PredictionCalculator from "@/components/PredictionCalculator";

interface CoursePredictionTabProps {
  loading: boolean;
  rollNumber: string;
  courseCode: string;
}

const CoursePredictionTab = ({ loading, rollNumber, courseCode }: CoursePredictionTabProps) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PredictionCalculator 
        rollNumber={rollNumber} 
        courseCode={courseCode} 
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
  );
};

export default CoursePredictionTab;
