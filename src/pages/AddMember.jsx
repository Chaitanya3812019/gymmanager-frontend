import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import WebcamCapture from "../components/WebcamCapture";
import "./AddMember.css";

function AddMember() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    branch: "",
    membershipType: "Gold",
    feesTier: "Medium",
    fees: "",
    trainerRating: "",
  });
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter the member's name.");
      return;
    }
    if (!form.branch.trim()) {
      setError("Please enter a branch.");
      return;
    }
    if (!photo) {
      setError("Please capture a photo before saving.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/members", {
        ...form,
        name: form.name.trim(),
        branch: form.branch.trim(),
        fees: Number(form.fees) || 0,
        trainerRating: Number(form.trainerRating) || 0,
        photo,
      });
      navigate("/members"); // change if your members route is different
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Could not save the member. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-member-page">
      <form onSubmit={handleSubmit} className="add-member-form">
        <h1>Add Member</h1>

        {error && <p className="form-error">{error}</p>}

        <div className="form-grid">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
            />
          </label>

          <label>
            Branch
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="e.g. Downtown Fitness Hub"
            />
          </label>

          <label>
            Membership Type
            <select
              name="membershipType"
              value={form.membershipType}
              onChange={handleChange}
            >
              <option>Gold</option>
              <option>Silver</option>
              <option>Platinum</option>
            </select>
          </label>

          <label>
            Fees Tier
            <select
              name="feesTier"
              value={form.feesTier}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label>
            Fees (amount)
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 1500"
            />
          </label>

          <label>
            Trainer Rating (0-5)
            <input
              type="number"
              name="trainerRating"
              value={form.trainerRating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              placeholder="e.g. 4.5"
            />
          </label>
        </div>

        <div className="photo-section">
          <span className="section-label">Member Photo</span>
          <WebcamCapture onCapture={setPhoto} />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}

export default AddMember;