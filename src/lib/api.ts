
import { 
  dummyStudentCourses, 
  dummyComponentScores, 
  dummyTotalScores, 
  dummyPrediction, 
  dummyInstructorCourses,
  dummyStudentsInCourse,
  dummyStudentDetails
} from './dummy-data';

const API_BASE_URL = 'http://localhost:5000';

// Student API endpoints
export const fetchStudentCourses = async (rollNumber: string) => {
  console.log(`Fetching courses for student ${rollNumber}`);
  // Return dummy data instead of making an API call
  return dummyStudentCourses;
};

export const fetchComponentScores = async (rollNumber: string, courseCode: string) => {
  console.log(`Fetching scores for student ${rollNumber} in course ${courseCode}`);
  // Return dummy data instead of making an API call
  return dummyComponentScores[courseCode as keyof typeof dummyComponentScores] || [];
};

export const fetchTotalScore = async (rollNumber: string, courseCode: string) => {
  console.log(`Fetching total score for student ${rollNumber} in course ${courseCode}`);
  // Return dummy data instead of making an API call
  return dummyTotalScores[courseCode as keyof typeof dummyTotalScores] || { total_score: 0, grade: 0 };
};

export const predictRequiredMarks = async (rollNumber: string, courseCode: string, targetGrade: number) => {
  console.log(`Predicting required marks for student ${rollNumber} in course ${courseCode} for target grade ${targetGrade}`);
  // Return dummy data instead of making an API call
  return dummyPrediction;
};

// Instructor API endpoints
export const fetchInstructorCourses = async (instructorId: string) => {
  console.log(`Fetching courses for instructor ${instructorId}`);
  // Return dummy data instead of making an API call
  return dummyInstructorCourses;
};

export const fetchStudentsInCourse = async (instructorId: string, courseCode: string) => {
  console.log(`Fetching students in course ${courseCode} for instructor ${instructorId}`);
  // Return dummy data instead of making an API call
  return dummyStudentsInCourse[courseCode as keyof typeof dummyStudentsInCourse] || [];
};

export const fetchStudentDetails = async (rollNumber: string) => {
  console.log(`Fetching details for student ${rollNumber}`);
  // Return dummy data instead of making an API call
  return dummyStudentDetails[rollNumber as keyof typeof dummyStudentDetails] || {};
};

export const assignGrade = async (instructorId: string, data: { roll_number: string; course_code: string; grade: number }) => {
  console.log(`Assigning grade for student ${data.roll_number} in course ${data.course_code} by instructor ${instructorId}`);
  // Return success response instead of making an API call
  return { message: "Grade assigned successfully" };
};

// New function to update component scores
export const updateComponentScores = async (
  instructorId: string, 
  data: { 
    roll_number: string; 
    course_code: string; 
    component_scores: Array<{ComponentName: string; Score: number}>
  }
) => {
  console.log(`Updating component scores for student ${data.roll_number} in course ${data.course_code} by instructor ${instructorId}`);
  // In a real app, this would send the scores to the backend
  // The backend would calculate the new grade using gaussian or linear logic
  // Return success response instead of making an API call
  return { message: "Component scores updated successfully" };
};
