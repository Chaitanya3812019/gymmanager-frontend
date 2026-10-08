import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStaff } from "../services/auth";
import WebcamCapture from "../components/WebcamCapture";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
  });
  const [photo, setPhoto] = useState("");
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

    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerStaff({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        photo, // empty string if skipped
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Could not register. Is the backend running?");
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
            "url('https://images.unsplash.com/photo-1641337221253-fdc7237f6b61?auto=format&fit=crop&w=1000&q=80')",
        }}
      ></div>

      <div className="auth-form-side">
        <div className="form-container">
          <h2>Create Account</h2>
          <p className="auth-sub">Join the FitZone staff team</p>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="register-photo">
              <span className="section-label">Profile Photo (optional)</span>
              <WebcamCapture onCapture={setPhoto} />
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

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
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;