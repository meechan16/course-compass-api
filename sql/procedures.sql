DELIMITER //

-- Get Total Weighted Score
CREATE PROCEDURE get_total_score (
  IN roll VARCHAR(20),
  IN course VARCHAR(10)
)
BEGIN
  SELECT 
    s.RollNumber,
    SUM(sc.Score * gc.Percentage / 100) AS TotalWeightedScore
  FROM StudentComponentScores sc
  JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
  JOIN Students s ON sc.RollNumber = s.RollNumber
  WHERE s.RollNumber = roll AND gc.CourseCode = course
  GROUP BY s.RollNumber;
END //

-- Assign Linear Grade using Percentiles
CREATE PROCEDURE assign_linear_grade (
  IN course VARCHAR(10)
)
BEGIN
  CREATE TEMPORARY TABLE temp_scores AS
  SELECT
    s.RollNumber,
    SUM(sc.Score * gc.Percentage / 100) AS TotalScore
  FROM StudentComponentScores sc
  JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
  JOIN Students s ON sc.RollNumber = s.RollNumber
  WHERE gc.CourseCode = course
  GROUP BY s.RollNumber;

  SELECT 
    RollNumber,
    TotalScore,
    NTILE(100) OVER (ORDER BY TotalScore DESC) AS Percentile,
    CASE
      WHEN NTILE(100) OVER (ORDER BY TotalScore DESC) <= 10 THEN 10
      WHEN NTILE(100) <= 30 THEN 8
      WHEN NTILE(100) <= 60 THEN 6
      WHEN NTILE(100) <= 80 THEN 4
      ELSE 2
    END AS Grade
  FROM temp_scores;

  DROP TEMPORARY TABLE temp_scores;
END //

-- Assign Gaussian Grade using Z-Score
CREATE PROCEDURE assign_gaussian_grade (
  IN course VARCHAR(10)
)
BEGIN
  CREATE TEMPORARY TABLE temp_scores AS
  SELECT
    s.RollNumber,
    SUM(sc.Score * gc.Percentage / 100) AS TotalScore
  FROM StudentComponentScores sc
  JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
  JOIN Students s ON sc.RollNumber = s.RollNumber
  WHERE gc.CourseCode = course
  GROUP BY s.RollNumber;

  SELECT 
    ts.RollNumber,
    ts.TotalScore,
    (ts.TotalScore - stats.Mean) / NULLIF(stats.StdDev, 0) AS ZScore,
    CASE
      WHEN (ts.TotalScore - stats.Mean) / NULLIF(stats.StdDev, 0) >= 1 THEN 10
      WHEN (ts.TotalScore - stats.Mean) / NULLIF(stats.StdDev, 0) >= 0 THEN 8
      WHEN (ts.TotalScore - stats.Mean) / NULLIF(stats.StdDev, 0) >= -1 THEN 6
      WHEN (ts.TotalScore - stats.Mean) / NULLIF(stats.StdDev, 0) >= -2 THEN 4
      ELSE 2
    END AS Grade
  FROM temp_scores ts,
    (SELECT AVG(TotalScore) AS Mean, STDDEV_POP(TotalScore) AS StdDev FROM temp_scores) stats;

  DROP TEMPORARY TABLE temp_scores;
END //

-- Predict Required Marks for a Target Grade
CREATE PROCEDURE get_required_marks_for_grade (
  IN roll VARCHAR(20),
  IN course VARCHAR(10),
  IN target FLOAT
)
BEGIN
  DECLARE current FLOAT;
  DECLARE remaining_weightage FLOAT;

  SELECT 
    SUM(sc.Score * gc.Percentage / 100)
  INTO current
  FROM StudentComponentScores sc
  JOIN GradedComponents gc ON sc.ComponentID = gc.ComponentID
  WHERE sc.RollNumber = roll AND gc.CourseCode = course;

  SELECT 
    SUM(gc.Percentage)
  INTO remaining_weightage
  FROM GradedComponents gc
  WHERE gc.CourseCode = course
    AND gc.ComponentID NOT IN (
      SELECT ComponentID FROM StudentComponentScores WHERE RollNumber = roll
    );

  SELECT 
    current AS CurrentScore,
    target AS TargetScore,
    remaining_weightage AS RemainingWeightage,
    GREATEST(0, ROUND(((target - current) / NULLIF(remaining_weightage, 0)) * 100, 2)) AS PercentageRequired;
END //

-- Assign Final Grade
CREATE PROCEDURE assign_final_grade (
  IN assigner VARCHAR(20),
  IN roll VARCHAR(20),
  IN course VARCHAR(10),
  IN grade DECIMAL(4,2)
)
BEGIN
  INSERT INTO Assigns_Grades (AssignerID, RollNumber, CourseCode, Grade)
  VALUES (assigner, roll, course, grade)
  ON DUPLICATE KEY UPDATE Grade = grade;
END //

DELIMITER ;