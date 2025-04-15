
interface TotalScore {
  total_score: number;
  grade: number;
}

interface CourseScoreDisplayProps {
  totalScore: TotalScore | null;
}

const CourseScoreDisplay = ({ totalScore }: CourseScoreDisplayProps) => {
  if (!totalScore) return null;
  
  return (
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
  );
};

export default CourseScoreDisplay;
