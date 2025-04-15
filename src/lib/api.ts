
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Student API endpoints
export const fetchStudentCourses = async (rollNumber: string) => {
  const response = await axios.get(`${API_BASE_URL}/students/${rollNumber}/courses`);
  return response.data;
};

export const fetchComponentScores = async (rollNumber: string, courseCode: string) => {
  const response = await axios.get(`${API_BASE_URL}/students/${rollNumber}/courses/${courseCode}/scores`);
  return response.data;
};

export const fetchTotalScore = async (rollNumber: string, courseCode: string) => {
  const response = await axios.get(`${API_BASE_URL}/students/${rollNumber}/courses/${courseCode}/total_score`);
  return response.data;
};

export const predictRequiredMarks = async (rollNumber: string, courseCode: string, targetGrade: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/students/${rollNumber}/courses/${courseCode}/predict?target=${targetGrade}`
  );
  return response.data;
};

// Instructor API endpoints
export const fetchInstructorCourses = async (instructorId: string) => {
  const response = await axios.get(`${API_BASE_URL}/instructors/${instructorId}/courses`);
  return response.data;
};

export const assignGrade = async (instructorId: string, data: { roll_number: string; course_code: string; grade: number }) => {
  const response = await axios.post(`${API_BASE_URL}/instructors/${instructorId}/assign_grade`, data);
  return response.data;
};
