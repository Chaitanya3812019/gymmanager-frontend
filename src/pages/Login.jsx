import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginStaff } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginStaff(formData.email, formData.password);

      if (user) {
        // never keep the password in the browser
        const { password, ...safeUser } = user;
        localStorage.setItem("user", JSON.stringify(safeUser));
        navigate("/members");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not log in. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div
        className="auth-image"
        style={{
          backgroundImage:
            "url('https://img.magnific.com/free-photo/attractive-fitness-couple-sporty-male-holds-barbell-slim-blond-female-holds-dumbbells-grey-background_613910-16001.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      ></div>

      <div className="auth-form-side">
        <div className="form-container">
          <h2>Welcome Back</h2>
          <p className="auth-sub">Login to manage your gym</p>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;