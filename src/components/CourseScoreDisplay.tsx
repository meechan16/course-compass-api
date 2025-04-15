
interface TotalScore {
  total_score: number;
  grade: number;
}

interface CourseScoreDisplayProps {
  totalScore: TotalScore | null;
}

const CourseScoreDisplay = ({ totalScore }: CourseScoreDisplayProps) => {
  if (!totalScore) return null;
  
  // Function to get grade color based on score
  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600";
    if (grade >= 7) return "text-blue-600";
    if (grade >= 5) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="text-sm text-gray-500">Total Score</div>
        <div className="text-xl font-bold">{totalScore.total_score.toFixed(2)}</div>
      </div>
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="text-sm text-gray-500">Grade</div>
        <div className={`text-xl font-bold ${getGradeColor(totalScore.grade)}`}>
          {totalScore.grade.toFixed(1)}
        </div>
        <div className="text-xs text-gray-400">(Auto-calculated)</div>
      </div>
    </div>
  );
};

export default CourseScoreDisplay;
