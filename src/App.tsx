import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import InstructorCourseDetail from "./pages/InstructorCourseDetail";
import InstructorStudentGrade from "./pages/InstructorStudentGrade";
import InstructorDashboard from "./pages/InstructorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:courseCode" element={<CourseDetail />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses/:courseCode" element={<InstructorCourseDetail />} />
        <Route path="/instructor/students/:rollNumber/:courseCode" element={<InstructorStudentGrade />} />
      </Routes>
    </Router>
  );
}

export default App;