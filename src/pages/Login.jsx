import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // For students, require username, email, and password
    if (role === "student") {
      if (!username || !email || !password) {
        alert("Please enter username, email, and password");
        return;
      }
      login(email, role, password, username);
      navigate("/student");
    } 
    // For admin, only require email and password
    else if (role === "admin") {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }
      if (password !== "admin123") {
        alert("Invalid Admin Password");
        return;
      }
      login(email, role, password, "Admin");
      navigate("/admin");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>
          {role === "admin" ? "👨‍💼 Admin Login" : "🎓 Student Login"}
        </h1>

        {role === "student" && (
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="modern-input"
          />
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="modern-input"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="modern-input"
        />

        <button onClick={handleLogin} className="modern-btn">Login</button>

        <a href="/" className="auth-link">
          ← Back to Role Selection
        </a>
      </div>
    </div>
  );
}

export default Login;