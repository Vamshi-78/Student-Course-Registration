import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    toast.success("Account Created Successfully!");
    navigate("/");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <FaUserPlus className="auth-icon" />

        <h2>Create Account</h2>
        <p className="auth-sub">Register to get started</p>

        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />

        <button onClick={handleSignup}>Sign Up</button>

        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;