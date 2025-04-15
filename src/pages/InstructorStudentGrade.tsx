
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchComponentScores, fetchTotalScore, assignGrade, updateComponentScores } from "@/lib/api";
import Header from "@/components/Header";
import CourseScoreDisplay from "@/components/CourseScoreDisplay";
import { ArrowLeft, Save, PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ComponentScore {
  ComponentName: string;
  Percentage: number;
  Score: number;
}

const formSchema = z.object({
  componentScores: z.array(
    z.object({
      ComponentName: z.string(),
      Percentage: z.number(),
      Score: z.number().min(0, "Score must be at least 0").max(100, "Score must be at most 100")
    })
  )
});

const InstructorStudentGrade = () => {
  const { rollNumber, courseCode } = useParams<{ rollNumber: string; courseCode: string }>();
  const [components, setComponents] = useState<ComponentScore[]>([]);
  const [totalScore, setTotalScore] = useState({ total_score: 0, grade: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const instructorId = localStorage.getItem("instructorId");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentScores: []
    }
  });

  useEffect(() => {
    if (!instructorId || !rollNumber || !courseCode) {
      navigate("/");
      return;
    }

    const loadStudentData = async () => {
      try {
        const [componentsData, totalScoreData] = await Promise.all([
          fetchComponentScores(rollNumber, courseCode),
          fetchTotalScore(rollNumber, courseCode)
        ]);
        
        setComponents(componentsData);
        setTotalScore(totalScoreData);
        
        form.setValue("componentScores", componentsData);
      } catch (err) {
        setError("Failed to load student grade data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [instructorId, rollNumber, courseCode, navigate, form]);

  const handleGoBack = () => {
    navigate(`/instructor/courses/${courseCode}`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!instructorId || !rollNumber || !courseCode) return;
    
    setSubmitting(true);
    try {
      // Fix: Ensure we cast the data to match the required ComponentScore type
      const updatedComponentScores: ComponentScore[] = values.componentScores.map(comp => ({
        ComponentName: comp.ComponentName,
        Percentage: comp.Percentage,
        Score: comp.Score
      }));
      
      let newTotalScore = 0;
      
      updatedComponentScores.forEach(comp => {
        newTotalScore += (comp.Score * comp.Percentage) / 100;
      });
      
      // Update the API (in a real application)
      if (instructorId && rollNumber && courseCode) {
        await updateComponentScores(instructorId, {
          roll_number: rollNumber,
          course_code: courseCode,
          component_scores: updatedComponentScores
        });
      }
      
      setComponents(updatedComponentScores);
      
      setTotalScore(prev => ({ ...prev, total_score: newTotalScore }));
      
      toast({
        title: "Scores Updated",
        description: `Successfully updated component scores for student ${rollNumber}`,
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update component scores",
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ... keep existing code (render method with UI components)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header rollNumber={instructorId} />
      
      <main className="container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          className="mb-4 hover:bg-gray-200"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>
                {rollNumber} in {courseCode}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48 rounded-lg bg-gray-200 animate-pulse"></div>
              ) : error ? (
                <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
                  {error}
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Current Totals</h3>
                    <CourseScoreDisplay totalScore={totalScore} />
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <PenLine className="mr-2 h-5 w-5 text-blue-500" />
                          Assign Component Scores
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Update the scores for each assessment component. The final grade will be calculated automatically.
                        </p>
                        
                        <div className="space-y-4">
                          {components.map((component, index) => (
                            <FormField
                              key={component.ComponentName}
                              control={form.control}
                              name={`componentScores.${index}.Score`}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 border rounded-md bg-gray-50">
                                    <div className="md:flex-1">
                                      <FormLabel className="text-base">
                                        {component.ComponentName}
                                      </FormLabel>
                                      <FormDescription>
                                        Weight: {component.Percentage}%
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min={0}
                                          max={100}
                                          step={0.1}
                                          className="w-24"
                                          value={field.value}
                                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                        <span className="text-sm text-gray-500">/100</span>
                                      </div>
                                    </FormControl>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Component Scores"}
                        <Save className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InstructorStudentGrade;
