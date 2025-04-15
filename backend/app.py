from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import logging

app = Flask(__name__)
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return connection
    except Error as e:
        logger.error(f"Error connecting to MySQL: {e}")
        return None

# Get student's enrolled courses
@app.route("/students/<roll_number>/courses", methods=["GET"])
def get_student_courses(roll_number):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT c.CourseCode, c.Name, i.Name AS Instructor
        FROM Enrolls e
        JOIN Courses c ON e.CourseCode = c.CourseCode
        JOIN Instructors i ON c.ProfessorID = i.InstructorID
        WHERE e.RollNumber = %s
        """
        cursor.execute(query, (roll_number,))
        courses = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(courses)
    except Error as e:
        logger.error(f"Error fetching student courses: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get student's component scores for a course
@app.route("/students/<roll_number>/courses/<course_code>/scores", methods=["GET"])
def get_component_scores(roll_number, course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT gc.ComponentName, gc.Percentage, sc.Score
        FROM StudentComponentScores sc
        JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
        WHERE sc.RollNumber = %s AND gc.CourseCode = %s
        """
        cursor.execute(query, (roll_number, course_code))
        scores = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(scores)
    except Error as e:
        logger.error(f"Error fetching component scores: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get total weighted score and grade for a student in a course
@app.route("/students/<roll_number>/courses/<course_code>/total_score", methods=["GET"])
def get_total_score(roll_number, course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.callproc("get_total_score", [roll_number, course_code])
        result = []
        for res in cursor.stored_results():
            result = res.fetchall()
        
        if not result:
            cursor.close()
            connection.close()
            return jsonify({"error": "No scores found"}), 404
        
        total_score = result[0]["TotalWeightedScore"]
        
        # Fetch grading scheme
        cursor.execute(
            "SELECT GradingScheme FROM Courses WHERE CourseCode = %s",
            (course_code,)
        )
        grading_scheme = cursor.fetchone()["GradingScheme"]
        
        # Compute grade
        cursor.execute(
            """
            SELECT Grade
            FROM (
                SELECT s.RollNumber, SUM(sc.Score * gc.Percentage / 100) AS TotalScore,
                       CASE
                           WHEN %s = 'linear' THEN (
                               CASE
                                   WHEN NTILE(100) OVER (ORDER BY SUM(sc.Score * gc.Percentage / 100) DESC) <= 10 THEN 10
                                   WHEN NTILE(100) <= 30 THEN 8
                                   WHEN NTILE(100) <= 60 THEN 6
                                   WHEN NTILE(100) <= 80 THEN 4
                                   ELSE 2
                               END
                           )
                           WHEN %s = 'gaussian' THEN (
                               CASE
                                   WHEN (SUM(sc.Score * gc.Percentage / 100) - stats.Mean) / NULLIF(stats.StdDev, 0) >= 1 THEN 10
                                   WHEN (SUM(sc.Score * gc.Percentage / 100) - stats.Mean) / NULLIF(stats.StdDev, 0) >= 0 THEN 8
                                   WHEN (SUM(sc.Score * gc.Percentage / 100) - stats.Mean) / NULLIF(stats.StdDev, 0) >= -1 THEN 6
                                   WHEN (SUM(sc.Score * gc.Percentage / 100) - stats.Mean) / NULLIF(stats.StdDev, 0) >= -2 THEN 4
                                   ELSE 2
                               END
                           )
                           ELSE 0
                       END AS Grade
                FROM StudentComponentScores sc
                JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
                JOIN Students s ON sc.RollNumber = s.RollNumber
                CROSS JOIN (
                    SELECT AVG(TotalScore) AS Mean, STDDEV_POP(TotalScore) AS StdDev
                    FROM (
                        SELECT SUM(sc2.Score * gc2.Percentage / 100) AS TotalScore
                        FROM StudentComponentScores sc2
                        JOIN GradedComponents gc2 ON sc2.ComponentID = gc2.ComponentID
                        WHERE gc2.CourseCode = %s
                        GROUP BY sc2.RollNumber
                    ) t
                ) stats
                WHERE gc.CourseCode = %s
                GROUP BY s.RollNumber
            ) t
            WHERE RollNumber = %s
            """,
            (grading_scheme, grading_scheme, course_code, course_code, roll_number)
        )
        grade = cursor.fetchone()
        grade_value = grade["Grade"] if grade else 0
        
        cursor.close()
        connection.close()
        return jsonify({"total_score": total_score, "grade": grade_value})
    except Error as e:
        logger.error(f"Error fetching total score: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Predict required marks for a target grade
@app.route("/students/<roll_number>/courses/<course_code>/predict", methods=["GET"])
def predict_required_marks(roll_number, course_code):
    target_grade = request.args.get("target", default=8.0, type=float)
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.callproc("get_required_marks_for_grade", [roll_number, course_code, target_grade])
        result = []
        for res in cursor.stored_results():
            result = res.fetchall()
        cursor.close()
        connection.close()
        return jsonify(result[0] if result else {"error": "Prediction failed"})
    except Error as e:
        logger.error(f"Error predicting required marks: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get courses taught by an instructor
@app.route("/instructors/<instructor_id>/courses", methods=["GET"])
def get_instructor_courses(instructor_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT c.CourseCode, c.Name
        FROM Teaches t
        JOIN Courses c ON t.CourseCode = c.CourseCode
        WHERE t.InstructorID = %s
        """
        cursor.execute(query, (instructor_id,))
        courses = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(courses)
    except Error as e:
        logger.error(f"Error fetching instructor courses: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get students enrolled in a course
@app.route("/instructors/<instructor_id>/courses/<course_code>/students", methods=["GET"])
def get_students_in_course(instructor_id, course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT s.RollNumber, s.Name, COALESCE(ag.Grade, 
            (SELECT SUM(sc.Score * gc.Percentage / 100)
             FROM StudentComponentScores sc
             JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
             WHERE sc.RollNumber = s.RollNumber AND gc.CourseCode = %s)) AS CurrentGrade
        FROM Enrolls e
        JOIN Students s ON e.RollNumber = s.RollNumber
        LEFT JOIN Assigns_Grades ag ON s.RollNumber = ag.RollNumber AND ag.CourseCode = %s
        WHERE e.CourseCode = %s
        """
        cursor.execute(query, (course_code, course_code, course_code))
        students = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(students)
    except Error as e:
        logger.error(f"Error fetching students in course: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get grading scheme for a course
@app.route("/instructors/<instructor_id>/courses/<course_code>/grading_scheme", methods=["GET"])
def get_grading_scheme(instructor_id, course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT GradingScheme FROM Courses WHERE CourseCode = %s",
            (course_code,)
        )
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        if not result:
            return jsonify({"error": "Course not found"}), 404
        return jsonify({"grading_scheme": result["GradingScheme"]})
    except Error as e:
        logger.error(f"Error fetching grading scheme: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Update grading scheme for a course
@app.route("/instructors/<instructor_id>/courses/<course_code>/grading_scheme", methods=["PUT"])
def update_grading_scheme(instructor_id, course_code):
    data = request.get_json()
    grading_scheme = data.get("grading_scheme")
    if grading_scheme not in ["linear", "gaussian", "random"]:
        return jsonify({"error": "Invalid grading scheme"}), 400
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE Courses SET GradingScheme = %s WHERE CourseCode = %s",
            (grading_scheme, course_code)
        )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Grading scheme updated successfully"})
    except Error as e:
        logger.error(f"Error updating grading scheme: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Update component scores for a student
@app.route("/instructors/<instructor_id>/courses/<course_code>/students/<roll_number>/scores", methods=["PUT"])
def update_component_scores(instructor_id, course_code, roll_number):
    data = request.get_json()
    component_scores = data.get("component_scores")
    if not component_scores:
        return jsonify({"error": "No component scores provided"}), 400
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor()
        for comp in component_scores:
            cursor.execute(
                """
                UPDATE StudentComponentScores sc
                JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
                SET sc.Score = %s
                WHERE sc.RollNumber = %s AND gc.CourseCode = %s AND gc.ComponentName = %s
                """,
                (comp["Score"], roll_number, course_code, comp["ComponentName"])
            )
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Component scores updated successfully"})
    except Error as e:
        logger.error(f"Error updating component scores: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Assign grades for all students in a course based on grading scheme
@app.route("/instructors/<instructor_id>/courses/<course_code>/assign_grades", methods=["POST"])
def assign_course_grades(instructor_id, course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT GradingScheme FROM Courses WHERE CourseCode = %s",
            (course_code,)
        )
        result = cursor.fetchone()
        if not result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Course not found"}), 404
        
        grading_scheme = result["GradingScheme"]
        if grading_scheme == "linear":
            cursor.callproc("assign_linear_grade", [course_code])
        elif grading_scheme == "gaussian":
            cursor.callproc("assign_gaussian_grade", [course_code])
        else:
            cursor.close()
            connection.close()
            return jsonify({"error": "Unsupported grading scheme"}), 400
        
        grades = []
        for res in cursor.stored_results():
            grades = res.fetchall()
        
        for grade in grades:
            cursor.execute(
                """
                INSERT INTO Assigns_Grades (AssignerID, RollNumber, CourseCode, Grade)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE Grade = %s
                """,
                (instructor_id, grade["RollNumber"], course_code, grade["Grade"], grade["Grade"])
            )
        
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Grades assigned successfully", "grades": grades})
    except Error as e:
        logger.error(f"Error assigning grades: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Assign final grade for a student
@app.route("/instructors/<instructor_id>/assign_grade", methods=["POST"])
def assign_grade(instructor_id):
    data = request.get_json()
    roll_number = data.get("roll_number")
    course_code = data.get("course_code")
    grade = data.get("grade")
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor()
        cursor.callproc("assign_final_grade", [instructor_id, roll_number, course_code, grade])
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Grade assigned successfully"})
    except Error as e:
        logger.error(f"Error assigning grade: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)