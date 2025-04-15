
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { fetchComponentScores, fetchTotalScore, assignGrade } from "@/lib/api";
import Header from "@/components/Header";
import { ArrowLeft, Save, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ComponentScore {
  ComponentName: string;
  Percentage: number;
  Score: number;
}

const formSchema = z.object({
  grade: z.number().min(0, "Grade must be at least 0").max(10, "Grade must be at most 10")
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
      grade: 0
    }
  });

  useEffect(() => {
    // Redirect to login if instructor ID is not present
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
        form.setValue("grade", totalScoreData.grade);
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
      await assignGrade(instructorId, {
        roll_number: rollNumber,
        course_code: courseCode,
        grade: values.grade
      });
      
      toast({
        title: "Grade Updated",
        description: `Successfully updated grade for student ${rollNumber}`,
        variant: "default"
      });
      
      // Update local state to reflect the change
      setTotalScore(prev => ({ ...prev, grade: values.grade }));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update student grade",
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                      <h3 className="text-lg font-medium mb-2">Component Scores</h3>
                      <div className="space-y-4">
                        {components.map((component, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{component.ComponentName}</p>
                              <p className="text-sm text-gray-500">Weight: {component.Percentage}%</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{component.Score}/100</p>
                              <p className="text-sm text-gray-500">
                                Weighted: {((component.Score * component.Percentage) / 100).toFixed(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Total Score:</p>
                        <p className="font-medium">{totalScore.total_score.toFixed(1)}/100</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-500" />
                  Assign Grade
                </CardTitle>
                <CardDescription>
                  Update the final grade for this student
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-32 rounded-lg bg-gray-200 animate-pulse"></div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Final Grade (0-10)</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <Slider
                                  min={0}
                                  max={10}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                />
                                <div className="flex justify-between items-center">
                                  <FormDescription>
                                    Current Value: {field.value.toFixed(1)}
                                  </FormDescription>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    className="w-20"
                                    value={field.value}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Grade"}
                        <Save className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorStudentGrade;
