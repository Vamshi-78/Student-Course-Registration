function CourseCard({ course, onSelect }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>📅 {course.day} | ⏰ {course.time}</p>
      <p>🎓 Credits: {course.credits}</p>
      <button onClick={() => onSelect(course)}>
        Enroll Now
      </button>
    </div>
  );
}

export default CourseCard;