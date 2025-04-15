
// Dummy student data
export const dummyStudentCourses = [
  {
    CourseCode: "CS101",
    Name: "Introduction to Computer Science",
    Instructor: "Dr. Jane Smith"
  },
  {
    CourseCode: "MATH201",
    Name: "Calculus II",
    Instructor: "Prof. Robert Johnson"
  },
  {
    CourseCode: "PHY150",
    Name: "Physics for Engineers",
    Instructor: "Dr. Alan Parker"
  },
  {
    CourseCode: "ENG102",
    Name: "Technical Writing",
    Instructor: "Prof. Maria Garcia"
  }
];

export const dummyComponentScores = {
  "CS101": [
    { ComponentName: "Midterm Exam", Percentage: 30, Score: 85 },
    { ComponentName: "Final Exam", Percentage: 40, Score: 88 },
    { ComponentName: "Assignments", Percentage: 20, Score: 92 },
    { ComponentName: "Quizzes", Percentage: 10, Score: 78 }
  ],
  "MATH201": [
    { ComponentName: "Midterm 1", Percentage: 20, Score: 76 },
    { ComponentName: "Midterm 2", Percentage: 20, Score: 82 },
    { ComponentName: "Final Exam", Percentage: 40, Score: 79 },
    { ComponentName: "Homework", Percentage: 20, Score: 90 }
  ],
  "PHY150": [
    { ComponentName: "Lab Work", Percentage: 25, Score: 88 },
    { ComponentName: "Midterm Exam", Percentage: 25, Score: 72 },
    { ComponentName: "Final Exam", Percentage: 35, Score: 80 },
    { ComponentName: "Participation", Percentage: 15, Score: 95 }
  ],
  "ENG102": [
    { ComponentName: "Essay 1", Percentage: 20, Score: 85 },
    { ComponentName: "Essay 2", Percentage: 20, Score: 78 },
    { ComponentName: "Research Paper", Percentage: 40, Score: 88 },
    { ComponentName: "Presentations", Percentage: 20, Score: 92 }
  ]
};

export const dummyTotalScores = {
  "CS101": { total_score: 86.5, grade: 8.7 },
  "MATH201": { total_score: 80.6, grade: 8.1 },
  "PHY150": { total_score: 81.4, grade: 8.1 },
  "ENG102": { total_score: 85.8, grade: 8.6 }
};

export const dummyPrediction = {
  current_total: 65.3,
  remaining_percentage: 35,
  required_marks: 90.7,
  is_achievable: true
};

// Dummy instructor data
export const dummyInstructorCourses = [
  { CourseCode: "CS101", Name: "Introduction to Computer Science" },
  { CourseCode: "CS201", Name: "Data Structures and Algorithms" },
  { CourseCode: "CS301", Name: "Database Systems" }
];

// Dummy students in a course (for instructor view)
export const dummyStudentsInCourse = {
  "CS101": [
    { RollNumber: "CS2021001", Name: "Alex Johnson", CurrentGrade: 8.7 },
    { RollNumber: "CS2021002", Name: "Emma Williams", CurrentGrade: 9.3 },
    { RollNumber: "CS2021003", Name: "Michael Brown", CurrentGrade: 7.8 },
    { RollNumber: "CS2021004", Name: "Sophia Davis", CurrentGrade: 8.2 },
    { RollNumber: "CS2021005", Name: "Daniel Wilson", CurrentGrade: 6.5 }
  ],
  "CS201": [
    { RollNumber: "CS2020001", Name: "Olivia Martinez", CurrentGrade: 8.9 },
    { RollNumber: "CS2020002", Name: "James Taylor", CurrentGrade: 7.6 },
    { RollNumber: "CS2020003", Name: "Ava Anderson", CurrentGrade: 9.1 },
    { RollNumber: "CS2020004", Name: "Ethan Thomas", CurrentGrade: 8.4 }
  ],
  "CS301": [
    { RollNumber: "CS2019001", Name: "Isabella Jackson", CurrentGrade: 9.4 },
    { RollNumber: "CS2019002", Name: "Noah White", CurrentGrade: 8.8 },
    { RollNumber: "CS2019003", Name: "Mia Harris", CurrentGrade: 7.9 },
    { RollNumber: "CS2019004", Name: "Liam Martin", CurrentGrade: 8.5 },
    { RollNumber: "CS2019005", Name: "Charlotte Thompson", CurrentGrade: 9.2 },
    { RollNumber: "CS2019006", Name: "Lucas Garcia", CurrentGrade: 6.8 }
  ]
};

// Dummy student detail data for instructor view
export const dummyStudentDetails = {
  "CS2021001": {
    Name: "Alex Johnson",
    Email: "alex.johnson@university.edu",
    Program: "Computer Science",
    Year: 3,
    EnrollmentDate: "2021-08-15"
  },
  "CS2021002": {
    Name: "Emma Williams",
    Email: "emma.williams@university.edu",
    Program: "Computer Science",
    Year: 3,
    EnrollmentDate: "2021-08-10"
  }
  // Additional student details would be here in a real implementation
};
