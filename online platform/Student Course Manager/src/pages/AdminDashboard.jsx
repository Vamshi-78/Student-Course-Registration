import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

function AdminDashboard() {
  const { courses, enrollments, waitlist, supportTickets } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique students
  const uniqueStudents = [...new Set(enrollments.map(e => e.studentUsername))];

  // Calculate course popularity
  const courseEnrollmentCount = courses.map(course => ({
    ...course,
    enrolledCount: enrollments.filter(e => e.course.code === course.code).length
  })).sort((a, b) => b.enrolledCount - a.enrolledCount);

  // Department analysis
  const departmentStats = courses.reduce((acc, course) => {
    const dept = course.code.substring(0, 4);
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        courseCount: 0,
        enrollmentCount: 0,
        capacity: 0
      };
    }
    acc[dept].courseCount++;
    acc[dept].enrollmentCount += enrollments.filter(e => e.course.code === course.code).length;
    acc[dept].capacity += course.capacity;
    return acc;
  }, {});

  // Time slot analysis
  const timeSlotStats = courses.reduce((acc, course) => {
    const time = course.time;
    if (!acc[time]) {
      acc[time] = {
        time,
        courseCount: 0,
        enrollmentCount: 0
      };
    }
    acc[time].courseCount++;
    acc[time].enrollmentCount += enrollments.filter(e => e.course.code === course.code).length;
    return acc;
  }, {});

  // Day distribution
  const dayStats = courses.reduce((acc, course) => {
    const day = course.day;
    if (!acc[day]) {
      acc[day] = { day, courseCount: 0, enrollmentCount: 0 };
    }
    acc[day].courseCount++;
    acc[day].enrollmentCount += enrollments.filter(e => e.course.code === course.code).length;
    return acc;
  }, {});

  // Capacity utilization
  const totalCapacity = courses.reduce((sum, c) => sum + c.capacity, 0);
  const capacityUtilization = totalCapacity > 0 ? ((enrollments.length / totalCapacity) * 100).toFixed(1) : 0;

  // Filter enrollments based on search
  const filteredEnrollments = enrollments.filter(e =>
    e.studentUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>📊 Admin Dashboard</h2>
      <p style={{ marginBottom: "30px", color: "#555" }}>
        Overview of courses, students, and registrations
      </p>

      <div className="dashboard-cards">
        <div className="card stat-card stat-card-primary">
          <div className="stat-icon">📚</div>
          <h4>Total Courses</h4>
          <h1>{courses.length}</h1>
        </div>

        <div className="card stat-card stat-card-success">
          <div className="stat-icon">👥</div>
          <h4>Total Students</h4>
          <h1>{uniqueStudents.length}</h1>
        </div>

        <div className="card stat-card stat-card-info">
          <div className="stat-icon">✅</div>
          <h4>Total Enrollments</h4>
          <h1>{enrollments.length}</h1>
        </div>

        <div className="card stat-card stat-card-warning">
          <div className="stat-icon">⭐</div>
          <h4>Avg. Enrollments/Course</h4>
          <h1>{courses.length > 0 ? (enrollments.length / courses.length).toFixed(1) : 0}</h1>
        </div>

        <div className="card stat-card stat-card-danger">
          <div className="stat-icon">⏳</div>
          <h4>Waitlist Count</h4>
          <h1>{waitlist.length}</h1>
        </div>

        <div className="card stat-card stat-card-secondary">
          <div className="stat-icon">💬</div>
          <h4>Support Tickets</h4>
          <h1>{supportTickets.length}</h1>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="analytics-grid">
        <div className="card analytics-card">
          <h3>📊 Department Breakdown</h3>
          <div className="dept-stats-list">
            {Object.values(departmentStats).map(dept => (
              <div key={dept.name} className="dept-stat-item">
                <div className="dept-name">
                  <span className="dept-badge">{dept.name}</span>
                  <span className="dept-info">{dept.courseCount} courses</span>
                </div>
                <div className="dept-enrollment">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(dept.enrollmentCount / dept.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="enrollment-text">
                    {dept.enrollmentCount}/{dept.capacity} enrolled ({((dept.enrollmentCount / dept.capacity) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <h3>⏰ Time Slot Distribution</h3>
          <div className="time-slot-chart">
            {Object.values(timeSlotStats)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(slot => (
                <div key={slot.time} className="time-slot-bar">
                  <span className="time-label">{slot.time}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ width: `${(slot.enrollmentCount / enrollments.length) * 100}%` }}
                      title={`${slot.enrollmentCount} enrollments`}
                    ></div>
                  </div>
                  <span className="count-label">{slot.enrollmentCount}</span>
                </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <h3>📅 Daily Distribution</h3>
          <div className="day-dist-grid">
            {Object.values(dayStats).map(day => (
              <div key={day.day} className="day-card">
                <div className="day-header">{day.day}</div>
                <div className="day-courses">{day.courseCount} courses</div>
                <div className="day-enrollments">{day.enrollmentCount} enrollments</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card capacity-card">
          <h3>📈 Capacity Utilization</h3>
          <div className="capacity-visual">
            <div className="capacity-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="10"
                  strokeDasharray={`${capacityUtilization * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="capacity-percent">{capacityUtilization}%</div>
            </div>
            <div className="capacity-info">
              <p><strong>{enrollments.length}</strong> / {totalCapacity} seats filled</p>
              <p className="capacity-note">
                {capacityUtilization >= 80 ? "🔴 High utilization" : 
                 capacityUtilization >= 50 ? "🟡 Moderate utilization" : 
                 "🟢 Low utilization"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="card dashboard-section">
          <h3>🏆 Most Popular Courses</h3>
          <div className="course-popularity-list">
            {courseEnrollmentCount.slice(0, 5).map(course => (
              <div key={course.code} className="popularity-item">
                <div className="course-info">
                  <strong>{course.code}</strong>
                  <span className="course-name">{course.name}</span>
                </div>
                <div className="enrollment-badge">
                  {course.enrolledCount} students
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-section">
          <div className="section-header">
            <h3>👨‍🎓 Student Enrollments</h3>
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="enrollment-list">
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((e, index) => (
                <div key={index} className="enrollment-item">
                  <div className="student-info">
                    <span className="student-badge">👤 {e.studentUsername}</span>
                    <span className="email-text">{e.studentEmail}</span>
                  </div>
                  <div className="arrow-icon">→</div>
                  <div className="course-info-enrollment">
                    <strong>{e.course.code}</strong>
                    <span className="course-detail">{e.course.name}</span>
                    <span className="schedule-detail">
                      📅 {e.course.day} | ⏰ {e.course.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No enrollments found</p>
            )}
          </div>
        </div>
      </div>

      {/* Students by Course Section */}
      <div className="card dashboard-section" style={{ marginTop: "20px" }}>
        <h3>📋 Registered Students by Course</h3>
        <div className="students-by-course">
          {courses.map(course => {
            const enrolledStudents = enrollments.filter(e => e.course.code === course.code);
            return (
              <div key={course.code} className="course-students-item">
                <div className="course-header-admin">
                  <strong>{course.code}</strong> - {course.name}
                  <span className="student-count-badge">{enrolledStudents.length} students</span>
                </div>
                {enrolledStudents.length > 0 ? (
                  <div className="student-chips">
                    {enrolledStudents.map((e, idx) => (
                      <span key={idx} className="student-chip">
                        {e.studentUsername}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="no-students">No students enrolled yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;