import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

function StudentDashboard() {
  const { enrollments, user, unenrollCourse, waitlist, supportTickets } = useContext(AuthContext);

  const myCourses = enrollments.filter(
    e => e.studentEmail === user?.email
  );

  const totalCredits = myCourses.reduce(
    (sum, e) => sum + e.course.credits,
    0
  );

  const myWaitlist = waitlist.filter(w => w.studentEmail === user?.email);
  const myTickets = supportTickets.filter(t => t.studentEmail === user?.email);
  const openTickets = myTickets.filter(t => t.status === "Open" || t.status === "In Progress");

  // Group courses by day for a quick schedule view
  const scheduleByDay = {
    Mon: myCourses.filter(e => e.course.day === "Mon"),
    Tue: myCourses.filter(e => e.course.day === "Tue"),
    Wed: myCourses.filter(e => e.course.day === "Wed"),
    Thu: myCourses.filter(e => e.course.day === "Thu"),
    Fri: myCourses.filter(e => e.course.day === "Fri")
  };

  const handleUnenroll = (courseCode) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      unenrollCourse(courseCode);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h2>🎓 Student Dashboard</h2>
          <p className="welcome-text-large">Welcome back, <strong>{user?.username}</strong>!</p>
        </div>
      </div>

      <div className="stats-box-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📚</div>
          <h4>Enrolled Courses</h4>
          <p>{myCourses.length}</p>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">🎯</div>
          <h4>Total Credits</h4>
          <p>{totalCredits}</p>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">⏰</div>
          <h4>Classes This Week</h4>
          <p>{myCourses.length}</p>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏳</div>
          <h4>Waitlisted</h4>
          <p>{myWaitlist.length}</p>
        </div>

        <div className="stat-card stat-card-danger">
          <div className="stat-icon">🎫</div>
          <h4>Open Tickets</h4>
          <p>{openTickets.length}</p>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📊</div>
          <h4>Credit Remaining</h4>
          <p>{18 - totalCredits}</p>
        </div>
      </div>

      {/* Quick Schedule Overview */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3>📅 Quick Schedule Overview</h3>
        <div className="quick-schedule">
          {Object.entries(scheduleByDay).map(([day, courses]) => (
            <div key={day} className="day-schedule">
              <div className="day-label">{day}</div>
              <div className="day-courses">
                {courses.length > 0 ? (
                  courses.map(e => (
                    <div key={e.course.code} className="mini-course-chip">
                      {e.course.code} ({e.course.time})
                    </div>
                  ))
                ) : (
                  <span className="no-class">No classes</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist Section */}
      {myWaitlist.length > 0 && (
        <div className="card waitlist-section" style={{ marginBottom: "20px" }}>
          <h3>⏳ Waitlisted Courses ({myWaitlist.length})</h3>
          <div className="waitlist-items">
            {myWaitlist.map((w, idx) => (
              <div key={idx} className="waitlist-item">
                <div>
                  <strong>{w.course.code}</strong> - {w.course.name}
                </div>
                <span className="waitlist-badge">Position: {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3>My Enrolled Courses</h3>

      <div className="course-grid">
        {myCourses.length > 0 ? (
          myCourses.map(e => (
            <div key={e.course.code} className="course-card enhanced-course-card">
              <div className="course-header">
                <span className="course-code-badge">{e.course.code}</span>
                <span className="credit-badge">{e.course.credits} Credits</span>
              </div>
              <h3>{e.course.name}</h3>
              <div className="course-details">
                <p>📅 {e.course.day}</p>
                <p>⏰ {e.course.time}</p>
              </div>
              <button 
                className="danger-btn"
                onClick={() => handleUnenroll(e.course.code)}
              >
                Unenroll
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📚 You haven't enrolled in any courses yet.</p>
            <p>Visit the Courses page to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;