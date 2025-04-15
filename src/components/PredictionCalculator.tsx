
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { predictRequiredMarks } from "@/lib/api";

interface PredictionCalculatorProps {
  rollNumber: string;
  courseCode: string;
}

interface PredictionResult {
  current_total: number;
  remaining_percentage: number;
  required_marks: number;
  is_achievable: boolean;
}

const PredictionCalculator = ({ rollNumber, courseCode }: PredictionCalculatorProps) => {
  const [targetGrade, setTargetGrade] = useState<number>(8.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await predictRequiredMarks(rollNumber, courseCode, targetGrade);
      setResult(data);
    } catch (err) {
      setError("Failed to calculate prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Prediction</CardTitle>
        <CardDescription>
          Calculate the marks you need in remaining components to achieve your target grade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="target-grade">Target Grade</Label>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {targetGrade.toFixed(1)}
            </div>
          </div>
          <Slider
            id="target-grade"
            min={4}
            max={10}
            step={0.1}
            value={[targetGrade]}
            onValueChange={(value) => setTargetGrade(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>4.0</span>
            <span>7.0</span>
            <span>10.0</span>
          </div>
        </div>

        {result && (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Current Total</div>
                <div className="text-lg font-semibold">{result.current_total.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Remaining %</div>
                <div className="text-lg font-semibold">{result.remaining_percentage}%</div>
              </div>
            </div>

            <Alert variant={result.is_achievable ? "default" : "destructive"}>
              {result.is_achievable ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              <AlertDescription>
                You need to score <strong>{result.required_marks.toFixed(2)}</strong> in remaining components
                {!result.is_achievable && " (not achievable)"}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePrediction} 
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate Required Marks"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictionCalculator;
