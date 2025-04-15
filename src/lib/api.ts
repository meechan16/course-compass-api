export const fetchStudentCourses = async (rollNumber: string) => {
  const response = await fetch(`/students/${rollNumber}/courses`);
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
};

export const fetchComponentScores = async (rollNumber: string, courseCode: string) => {
  const response = await fetch(`/students/${rollNumber}/courses/${courseCode}/scores`);
  if (!response.ok) throw new Error("Failed to fetch component scores");
  return response.json();
};

export const fetchTotalScore = async (rollNumber: string, courseCode: string) => {
  const response = await fetch(`/students/${rollNumber}/courses/${courseCode}/total_score`);
  if (!response.ok) throw new Error("Failed to fetch total score");
  return response.json();
};

export const fetchPrediction = async (rollNumber: string, courseCode: string, target: number) => {
  const response = await fetch(`/students/${rollNumber}/courses/${courseCode}/predict?target=${target}`);
  if (!response.ok) throw new Error("Failed to fetch prediction");
  return response.json();
};

export const fetchInstructorCourses = async (instructorId: string) => {
  const response = await fetch(`/instructors/${instructorId}/courses`);
  if (!response.ok) throw new Error("Failed to fetch instructor courses");
  return response.json();
};

export const fetchStudentsInCourse = async (instructorId: string, courseCode: string) => {
  const response = await fetch(`/instructors/${instructorId}/courses/${courseCode}/students`);
  if (!response.ok) throw new Error("Failed to fetch students in course");
  return response.json();
};

export const updateComponentScores = async (instructorId: string, data: { roll_number: string; course_code: string; component_scores: any[] }) => {
  const response = await fetch(`/instructors/${instructorId}/courses/${data.course_code}/students/${data.roll_number}/scores`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ component_scores: data.component_scores }),
  });
  if (!response.ok) throw new Error("Failed to update component scores");
  return response.json();
};

export const assignGrade = async (instructorId: string, data: { roll_number: string; course_code: string; grade: number }) => {
  const response = await fetch(`/instructors/${instructorId}/assign_grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to assign grade");
  return response.json();
};