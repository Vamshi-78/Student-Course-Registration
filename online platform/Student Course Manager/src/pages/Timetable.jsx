import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Timetable() {
  const { enrolledCourses, user } = useContext(AuthContext);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = ["9AM", "10AM", "11AM", "12PM", "2PM", "3PM", "4PM"];

  const exportToText = () => {
    let text = `====================================\n`;
    text += `   WEEKLY TIMETABLE - ${user?.username || 'Student'}\n`;
    text += `   Student Course Manager\n`;
    text += `====================================\n\n`;

    days.forEach(day => {
      text += `${day}:\n`;
      const dayCourses = enrolledCourses.filter(c => c.day === day);
      if (dayCourses.length === 0) {
        text += `  No classes scheduled\n`;
      } else {
        dayCourses.forEach(course => {
          text += `  ${course.time} - ${course.code}: ${course.name} (${course.credits} credits)\n`;
        });
      }
      text += `\n`;
    });

    text += `\nTotal Enrolled: ${enrolledCourses.length} courses\n`;
    text += `Total Credits: ${enrolledCourses.reduce((sum, c) => sum + c.credits, 0)}\n`;
    text += `====================================\n`;

    // Create a blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${user?.username || 'student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    let text = `WEEKLY TIMETABLE - ${user?.username || 'Student'}\n\n`;
    days.forEach(day => {
      text += `${day}: `;
      const dayCourses = enrolledCourses.filter(c => c.day === day);
      if (dayCourses.length === 0) {
        text += `No classes`;
      } else {
        text += dayCourses.map(c => `${c.time} ${c.code}`).join(', ');
      }
      text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Timetable copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy to clipboard');
    });
  };

  const printTimetable = () => {
    window.print();
  };

  return (
    <div className="page-container">
      <div className="timetable-header">
        <div>
          <h2 style={{ marginBottom: "10px" }}>🗓 Weekly Timetable</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>
            Your personalized class schedule for the week
          </p>
        </div>
        <div className="export-buttons">
          <button className="export-btn" onClick={exportToText} title="Export as Text File">
            📄 Export
          </button>
          <button className="export-btn" onClick={copyToClipboard} title="Copy to Clipboard">
            📋 Copy
          </button>
          <button className="export-btn" onClick={printTimetable} title="Print Timetable">
            🖨 Print
          </button>
        </div>
      </div>

      <div className="card timetable-card">
        <table className="timetable">
          <thead>
            <tr>
              <th className="time-header">Day / Time</th>
              {times.map(time => <th key={time}>{time}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="day-cell"><strong>{day}</strong></td>
                {times.map(time => {
                  const course = enrolledCourses.find(
                    c => c.day === day && c.time === time
                  );
                  return (
                    <td key={time} className={course ? "has-course" : "empty-cell"}>
                      {course ? (
                        <div className="tt-course" title={course.name}>
                          <div className="course-code">{course.code}</div>
                          <div className="course-name-mini">{course.name}</div>
                        </div>
                      ) : (
                        <span className="free-slot">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enrolledCourses.length === 0 && (
        <div className="empty-timetable-message">
          <p>📚 Your timetable is empty. Start enrolling in courses to see them here!</p>
        </div>
      )}

      {/* Legend */}
      <div className="timetable-legend card" style={{ marginTop: "20px", padding: "15px" }}>
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: "#6c63ff" }}></div>
            <span>Enrolled Course</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: "#f1f5f9" }}></div>
            <span>Free Slot</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;