import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState([
    { code: "24SP2101", name: "ATHLETICS", day: "Mon", time: "9AM", credits: 2, capacity: 50, enrolled: 0, prerequisites: [] },
    { code: "24CS2202", name: "COMPUTER NETWORKS", day: "Tue", time: "10AM", credits: 3, capacity: 40, enrolled: 0, prerequisites: [] },
    { code: "24CS2203", name: "DESIGN AND ANALYSIS OF ALGORITHMS", day: "Wed", time: "9AM", credits: 3, capacity: 35, enrolled: 0, prerequisites: [] },
    { code: "24CS2258F", name: "NATURAL LANGUAGE PROCESSING", day: "Mon", time: "10AM", credits: 3, capacity: 30, enrolled: 0, prerequisites: ["24CS2202"] },
    { code: "24MT2012", name: "MATHEMATICAL OPTIMIZATION", day: "Fri", time: "3PM", credits: 3, capacity: 25, enrolled: 0, prerequisites: [] }
  ]);

  const [enrollments, setEnrollments] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: "all",
      userType: "all",
      type: "system",
      title: "Welcome to SCM Platform",
      message: "Welcome to Student Course Manager. Browse courses and start building your schedule!",
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  const login = (email, role, password, username) => {
    setUser({ email, role, password, username: username || email.split('@')[0] });
  };

  const logout = () => {
    setUser(null);
  };

  const addCourse = (course) => {
    setCourses(prev => [...prev, { ...course, enrolled: 0, capacity: course.capacity || 30, prerequisites: course.prerequisites || [] }]);
  };

  const deleteCourse = (code) => {
    setCourses(prev => prev.filter(course => course.code !== code));
  };

  const enrollCourse = (course) => {
    const studentCourses = enrollments.filter(
      e => e.studentEmail === user.email
    );

    // Check total credits
    const totalCredits = studentCourses.reduce((sum, e) => sum + e.course.credits, 0);
    if (totalCredits + course.credits > 18) {
      alert("⚠ Maximum credit limit (18) exceeded!");
      return;
    }

    // Check prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
      const hasPrerequisites = course.prerequisites.every(prereq =>
        studentCourses.some(e => e.course.code === prereq)
      );
      if (!hasPrerequisites) {
        alert(`⚠ You must complete prerequisites: ${course.prerequisites.join(", ")}`);
        return;
      }
    }

    // Check schedule conflict
    const conflict = studentCourses.find(
      e => e.course.day === course.day &&
           e.course.time === course.time
    );

    if (conflict) {
      alert("⚠ Schedule Conflict Detected!");
      return;
    }

    // Check capacity
    const currentEnrollment = enrollments.filter(e => e.course.code === course.code).length;
    if (currentEnrollment >= course.capacity) {
      // Add to waitlist
      setWaitlist(prev => [
        ...prev,
        {
          studentEmail: user.email,
          studentUsername: user.username,
          course,
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Add notification
      addNotification({
        userId: user.email,
        type: "waitlist",
        title: "Added to Waitlist",
        message: `You've been added to the waitlist for ${course.name} (${course.code})`
      });
      
      alert("⏳ Course is full. You've been added to the waitlist!");
      return;
    }

    setEnrollments(prev => [
      ...prev,
      { 
        studentEmail: user.email, 
        studentUsername: user.username,
        studentName: user.username,
        course 
      }
    ]);

    // Update course enrolled count
    setCourses(prev => prev.map(c => 
      c.code === course.code ? { ...c, enrolled: c.enrolled + 1 } : c
    ));

    // Add notification
    addNotification({
      userId: user.email,
      type: "enrollment",
      title: "Successfully Enrolled",
      message: `You have been enrolled in ${course.name} (${course.code})`
    });

    alert("✅ Enrolled Successfully");
  };

  const unenrollCourse = (courseCode) => {
    setEnrollments(prev => prev.filter(
      e => !(e.studentEmail === user.email && e.course.code === courseCode)
    ));
    
    // Update course enrolled count
    setCourses(prev => prev.map(c => 
      c.code === courseCode ? { ...c, enrolled: Math.max(0, c.enrolled - 1) } : c
    ));

    // Check waitlist and auto-enroll next student
    const waitlistEntry = waitlist.find(w => w.course.code === courseCode);
    if (waitlistEntry) {
      setWaitlist(prev => prev.filter(w => 
        !(w.course.code === courseCode && w.studentEmail === waitlistEntry.studentEmail)
      ));
      
      setEnrollments(prev => [
        ...prev,
        {
          studentEmail: waitlistEntry.studentEmail,
          studentUsername: waitlistEntry.studentUsername,
          studentName: waitlistEntry.studentUsername,
          course: waitlistEntry.course
        }
      ]);
    }

    alert("✅ Course Removed Successfully");
  };

  // Support ticket functions
  const createTicket = (ticket) => {
    const newTicket = {
      id: Date.now(),
      studentEmail: user.email,
      studentUsername: user.username,
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      status: "Open",
      priority: ticket.priority || "Medium",
      createdAt: new Date().toISOString(),
      responses: []
    };
    setSupportTickets(prev => [...prev, newTicket]);
    return newTicket.id;
  };

  const respondToTicket = (ticketId, response) => {
    setSupportTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          responses: [
            ...ticket.responses,
            {
              by: user.username,
              role: user.role,
              message: response,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    }));
  };

  const updateTicketStatus = (ticketId, status) => {
    setSupportTickets(prev => prev.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status } : ticket
    ));
  };

  // Notification functions
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      userId: notification.userId || user?.email,
      userType: notification.userType || "user",
      type: notification.type || "info",
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  // Get enrolled courses for current user (for Timetable)
  const enrolledCourses = user
    ? enrollments
        .filter(e => e.studentEmail === user.email)
        .map(e => e.course)
    : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        courses,
        addCourse,
        deleteCourse,
        enrollCourse,
        unenrollCourse,
        enrollments,
        enrolledCourses,
        waitlist,
        supportTickets,
        createTicket,
        respondToTicket,
        updateTicketStatus,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};