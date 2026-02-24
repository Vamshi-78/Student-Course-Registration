import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/layout.css";
import "../styles/dashboard.css";

function ManageCourses() {
  const { courses, addCourse, deleteCourse, enrollments } = useContext(AuthContext);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [credits, setCredits] = useState("");
  const [capacity, setCapacity] = useState("");
  const [prerequisites, setPrerequisites] = useState("");

  const handleAddCourse = () => {
    if (!code || !name || !day || !time || !credits) {
      alert("⚠ Please fill all required fields");
      return;
    }

    // Check if course code already exists
    if (courses.some(c => c.code === code)) {
      alert("⚠ Course code already exists!");
      return;
    }

    const prereqArray = prerequisites 
      ? prerequisites.split(",").map(p => p.trim()).filter(p => p)
      : [];

    const newCourse = {
      code: code.toUpperCase(),
      name: name.toUpperCase(),
      day,
      time,
      credits: Number(credits),
      capacity: Number(capacity) || 30,
      enrolled: 0,
      prerequisites: prereqArray
    };

    addCourse(newCourse);
    alert("✅ Course added successfully!");

    // Clear inputs
    setCode("");
    setName("");
    setDay("");
    setTime("");
    setCredits("");
    setCapacity("");
    setPrerequisites("");
  };

  const handleDeleteCourse = (courseCode) => {
    const enrolled = enrollments.filter(e => e.course.code === courseCode).length;
    if (enrolled > 0) {
      if (!window.confirm(`${enrolled} students are enrolled in this course. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this course?")) {
        return;
      }
    }
    deleteCourse(courseCode);
  };

  const getEnrollmentCount = (courseCode) => {
    return enrollments.filter(e => e.course.code === courseCode).length;
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "10px" }}>⚙ Manage Courses</h2>
      <p className="subtitle">Add, edit, and remove courses from the system</p>

      {/* ===== Add Course Form ===== */}
      <div className="card manage-form-card" style={{ marginBottom: "30px" }}>
        <h3>➕ Add New Course</h3>
        <div className="admin-form">
          <input
            placeholder="Course Code (e.g., 24CS2101)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              flex: 1,
              minWidth: "150px"
            }}
          >
            <option value="">Select Day</option>
            <option value="Mon">Monday</option>
            <option value="Tue">Tuesday</option>
            <option value="Wed">Wednesday</option>
            <option value="Thu">Thursday</option>
            <option value="Fri">Friday</option>
          </select>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "2px solid #e2e8f0",
              flex: 1,
              minWidth: "150px"
            }}
          >
            <option value="">Select Time</option>
            <option value="9AM">9:00 AM</option>
            <option value="10AM">10:00 AM</option>
            <option value="11AM">11:00 AM</option>
            <option value="12PM">12:00 PM</option>
            <option value="2PM">2:00 PM</option>
            <option value="3PM">3:00 PM</option>
            <option value="4PM">4:00 PM</option>
          </select>
          <input
            placeholder="Credits"
            type="number"
            min="1"
            max="5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
          <input
            placeholder="Capacity (default: 30)"
            type="number"
            min="10"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <input
            placeholder="Prerequisites (comma-separated codes)"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
          />
          <button className="primary-btn" onClick={handleAddCourse}>
            ➕ Add Course
          </button>
        </div>
      </div>

      {/* ===== Course Table ===== */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>📚 All Courses ({courses.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Credits</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Prerequisites</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.code}>
                  <td><strong>{course.code}</strong></td>
                  <td>{course.name}</td>
                  <td><span className="day-badge">{course.day}</span></td>
                  <td><span className="time-badge">{course.time}</span></td>
                  <td>{course.credits}</td>
                  <td>{course.capacity || 30}</td>
                  <td>
                    <span className="enrollment-count-badge">
                      {getEnrollmentCount(course.code)}
                    </span>
                  </td>
                  <td>
                    {course.prerequisites && course.prerequisites.length > 0 
                      ? course.prerequisites.join(", ") 
                      : "None"}
                  </td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteCourse(course.code)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                    📚 No courses available. Add your first course above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;