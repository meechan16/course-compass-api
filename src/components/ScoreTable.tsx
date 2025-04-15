
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ComponentScore {
  ComponentName: string;
  Percentage: number;
  Score: number;
}

interface ScoreTableProps {
  scores: ComponentScore[];
}

const ScoreTable = ({ scores }: ScoreTableProps) => {
  if (!scores.length) {
    return <div className="text-center py-4">No scores available for this course.</div>;
  }

  return (
    <Table>
      <TableCaption>Your component scores for this course</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Weight (%)</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Weighted Score</TableHead>
          <TableHead className="w-[200px]">Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score) => {
          const weightedScore = (score.Score * score.Percentage) / 100;
          return (
            <TableRow key={score.ComponentName}>
              <TableCell className="font-medium">{score.ComponentName}</TableCell>
              <TableCell>{score.Percentage}%</TableCell>
              <TableCell>{score.Score.toFixed(1)}</TableCell>
              <TableCell>{weightedScore.toFixed(2)}</TableCell>
              <TableCell>
                <Progress value={score.Score * 10} className="h-2" />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ScoreTable;
