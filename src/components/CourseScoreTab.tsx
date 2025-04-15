
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreTable from "@/components/ScoreTable";
import EmptyState from "@/components/EmptyState";

interface ComponentScore {
  ComponentName: string;
  Percentage: number;
  Score: number;
}

interface CourseScoreTabProps {
  loading: boolean;
  error: string | null;
  scores: ComponentScore[];
}

const CourseScoreTab = ({ loading, error, scores }: CourseScoreTabProps) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }
  
  if (scores.length > 0) {
    return (
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
    );
  }
  
  return (
    <EmptyState 
      title="No scores available"
      description="Your component scores will appear here once they are assigned."
    />
  );
};

export default CourseScoreTab;
