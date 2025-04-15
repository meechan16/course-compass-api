CREATE DATABASE IF NOT EXISTS course_compass;
USE course_compass;

CREATE TABLE Departments (
  DeptID INT PRIMARY KEY,
  Name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Instructors (
  InstructorID INT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  DeptID INT,
  FOREIGN KEY (DeptID) REFERENCES Departments(DeptID) ON DELETE SET NULL
);

CREATE TABLE Students (
  RollNumber VARCHAR(20) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Branch VARCHAR(50) NOT NULL,
  Batch YEAR CHECK (Batch BETWEEN 2008 AND 2100),
  PredictedGrades VARCHAR(255) DEFAULT NULL,
  PredictedSGPA DECIMAL(4,2) CHECK (PredictedSGPA BETWEEN 0.00 AND 10.00),
  CurrentCGPA DECIMAL(4,2) CHECK (CurrentCGPA BETWEEN 0.00 AND 10.00)
);

CREATE TABLE Courses (
  CourseCode VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  ProfessorID INT NOT NULL,
  GradingScheme ENUM('linear', 'gaussian', 'random') NOT NULL DEFAULT 'linear',
  FOREIGN KEY (ProfessorID) REFERENCES Instructors(InstructorID) ON DELETE CASCADE
);

CREATE TABLE Enrolls (
  RollNumber VARCHAR(20),
  CourseCode VARCHAR(10),
  Eligibility BOOLEAN DEFAULT TRUE,
  Capacity INT CHECK (Capacity > 0),
  PRIMARY KEY (RollNumber, CourseCode),
  FOREIGN KEY (RollNumber) REFERENCES Students(RollNumber),
  FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode)
);

CREATE TABLE Is_TA_Of (
  RollNumber VARCHAR(20),
  CourseCode VARCHAR(10),
  PRIMARY KEY (RollNumber, CourseCode),
  FOREIGN KEY (RollNumber) REFERENCES Students(RollNumber),
  FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode)
);

CREATE TABLE Teaches (
  InstructorID INT,
  CourseCode VARCHAR(10),
  PRIMARY KEY (InstructorID, CourseCode),
  FOREIGN KEY (InstructorID) REFERENCES Instructors(InstructorID),
  FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode)
);

CREATE TABLE Assigns_Grades (
  AssignerID VARCHAR(20),
  RollNumber VARCHAR(20),
  CourseCode VARCHAR(10),
  Grade DECIMAL(4,2) CHECK (Grade BETWEEN 0.00 AND 10.00),
  PRIMARY KEY (AssignerID, RollNumber, CourseCode),
  FOREIGN KEY (RollNumber) REFERENCES Students(RollNumber),
  FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode)
);

CREATE TABLE GradedComponents (
  ComponentID INT AUTO_INCREMENT PRIMARY KEY,
  CourseCode VARCHAR(10) NOT NULL,
  ComponentName VARCHAR(100) NOT NULL,
  StartDate DATE DEFAULT NULL,
  EndDate DATE DEFAULT NULL,
  Percentage DECIMAL(5,2) CHECK (Percentage > 0 AND Percentage <= 100),
  FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode) ON DELETE CASCADE
);

CREATE TABLE StudentComponentScores (
  RollNumber VARCHAR(20),
  ComponentID INT,
  Score DECIMAL(5,2) CHECK (Score >= 0 AND Score <= 100),
  PRIMARY KEY (RollNumber, ComponentID),
  FOREIGN KEY (RollNumber) REFERENCES Students(RollNumber),
  FOREIGN KEY (ComponentID) REFERENCES GradedComponents(ComponentID)
);