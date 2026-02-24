import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🎓 Student Course Manager</h1>
        <p>Select your role to continue</p>

        <button onClick={() => navigate("/login/admin")}>
          👨‍💼 Admin Login
        </button>

        <div style={{ height: "10px" }} />

        <button onClick={() => navigate("/login/student")}>
          🎓 Student Login
        </button>
      </div>
    </div>
  );
}

export default RoleSelect;