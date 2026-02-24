import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Courses() {
  const { courses, enrollCourse, enrollments, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterCredits, setFilterCredits] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Check if user is already enrolled in a course
  const isEnrolled = (courseCode) => {
    return enrollments.some(
      e => e.studentEmail === user?.email && e.course.code === courseCode
    );
  };

  // Get enrollment count for a course
  const getEnrollmentCount = (courseCode) => {
    return enrollments.filter(e => e.course.code === courseCode).length;
  };

  // Check if course is full
  const isFull = (course) => {
    return getEnrollmentCount(course.code) >= course.capacity;
  };

  // Get available seats
  const getAvailableSeats = (course) => {
    return course.capacity - getEnrollmentCount(course.code);
  };

  // Get unique departments
  const departments = [...new Set(courses.map(c => c.code.substring(0, 2)))];

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        filterDepartment === "All" || course.code.startsWith(filterDepartment);
      
      const matchesCredits = 
        filterCredits === "All" || course.credits === parseInt(filterCredits);
      
      return matchesSearch && matchesDepartment && matchesCredits;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "credits":
          return b.credits - a.credits;
        case "availability":
          return getAvailableSeats(b) - getAvailableSeats(a);
        default:
          return 0;
      }
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>📚 Available Courses</h2>
          <p className="subtitle">Browse and enroll in courses for this semester</p>
        </div>
        <button 
          className="compare-courses-btn"
          onClick={() => navigate('/compare-courses')}
        >
          🔍 Compare Courses
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterCredits}
            onChange={(e) => setFilterCredits(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Credits</option>
            <option value="2">2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="code">Sort by Code</option>
            <option value="credits">Sort by Credits</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>
      </div>

      <div className="course-count">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      <div className="course-grid">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <p>No courses found matching your criteria.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
          const enrolled = isEnrolled(course.code);
          const enrollCount = getEnrollmentCount(course.code);
          const availableSeats = getAvailableSeats(course);
          const courseFull = isFull(course);
          
          return (
            <div key={course.code} className="course-card enhanced-course-card">
              <div className="course-header">
                <span className="course-code-badge">{course.code}</span>
                <span className="credit-badge">{course.credits} Credits</span>
              </div>
              
              <h3>{course.name}</h3>
              
              <div className="course-meta">
                <p>📅 <strong>Day:</strong> {course.day}</p>
                <p>⏰ <strong>Time:</strong> {course.time}</p>
                <p>👥 <strong>Enrolled:</strong> {enrollCount}/{course.capacity}</p>
                <p>
                  <strong>Available:</strong> 
                  <span className={availableSeats === 0 ? "seats-full" : availableSeats < 5 ? "seats-low" : "seats-available"}>
                    {" "}{availableSeats} seats
                  </span>
                </p>
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <p>
                    <strong>Prerequisites:</strong> 
                    <span className="prerequisites-text">
                      {" "}{course.prerequisites.join(", ")}
                    </span>
                  </p>
                )}
              </div>

              {enrolled ? (
                <button className="enrolled-btn" disabled>
                  ✅ Already Enrolled
                </button>
              ) : courseFull ? (
                <button
                  className="waitlist-btn"
                  onClick={() => enrollCourse(course)}
                >
                  ⏳ Join Waitlist
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => enrollCourse(course)}
                >
                  Enroll Now
                </button>
              )}
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}

export default Courses;