import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import WebcamCapture from "../components/WebcamCapture";
import "./AddMember.css";

const emptyForm = {
  name: "",
  goal: "",
  branch: "",
  membershipType: "Gold",
  feesTier: "Medium",
  fees: "",
  trainerRating: "",
  preferredTime: "",
  duration: "",
  schedule: "",
  specialization: "",
  facilities: "", // comma separated in the form, array when saved
};

function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null); // original data
  const [form, setForm] = useState(emptyForm);
  const [newPhoto, setNewPhoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getMember() {
      try {
        const res = await api.get(`/members/${id}`);
        const m = res.data;
        setMember(m);
        setForm({
          name: m.name ?? "",
          goal: m.goal ?? "",
          branch: m.branch ?? "",
          membershipType: m.membershipType ?? "Gold",
          feesTier: m.feesTier ?? "Medium",
          fees: m.monthlyFees ?? m.fees ?? "",
          trainerRating: m.trainerRating ?? "",
          preferredTime: m.preferredTime ?? "",
          duration: m.duration ?? "",
          schedule: m.schedule ?? "",
          specialization: m.specialization ?? "",
          facilities: Array.isArray(m.facilities) ? m.facilities.join(", ") : "",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load this member.");
      }
    }
    getMember();
  }, [id]);

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

    const feesNumber = Number(form.fees) || 0;
    const updated = {
      ...member, // keeps any fields this form doesn't touch
      ...form,
      name: form.name.trim(),
      branch: form.branch.trim(),
      fees: feesNumber,
      monthlyFees: feesNumber, // keeps the details page and sorting in sync
      trainerRating: Number(form.trainerRating) || 0,
      facilities: form.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    // only replace the photo if a new one was captured
    if (newPhoto) updated.photo = newPhoto;

    setLoading(true);
    try {
      await api.put(`/members/${id}`, updated);
      navigate("/members");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Could not update the member. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!member && !error) return <h2>Loading...</h2>;
  if (!member) return <h2>{error}</h2>;

  const currentPhoto = member.photo || member.image;

  return (
    <div className="add-member-page">
      <form onSubmit={handleSubmit} className="add-member-form">
        <h1>Edit Member</h1>

        {error && <p className="form-error">{error}</p>}

        <div className="form-grid">
          <label>
            Full Name
            <input type="text" name="name" value={form.name} onChange={handleChange} />
          </label>

          <label>
            Branch
            <input type="text" name="branch" value={form.branch} onChange={handleChange} />
          </label>

          <label className="full">
            Goal
            <input
              type="text"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="e.g. Weight loss"
            />
          </label>

          <label>
            Membership Type
            <select name="membershipType" value={form.membershipType} onChange={handleChange}>
              <option>Gold</option>
              <option>Silver</option>
              <option>Platinum</option>
            </select>
          </label>

          <label>
            Fees Tier
            <select name="feesTier" value={form.feesTier} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label>
            Monthly Fees (₹)
            <input type="number" name="fees" value={form.fees} onChange={handleChange} min="0" />
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
            />
          </label>

          <label>
            Preferred Time
            <input
              type="text"
              name="preferredTime"
              value={form.preferredTime}
              onChange={handleChange}
              placeholder="e.g. Morning"
            />
          </label>

          <label>
            Duration
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 6 months"
            />
          </label>

          <label>
            Schedule
            <input
              type="text"
              name="schedule"
              value={form.schedule}
              onChange={handleChange}
              placeholder="e.g. Mon, Wed, Fri"
            />
          </label>

          <label>
            Specialization
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="e.g. Strength training"
            />
          </label>

          <label className="full">
            Facilities (separate with commas)
            <input
              type="text"
              name="facilities"
              value={form.facilities}
              onChange={handleChange}
              placeholder="e.g. Cardio, Locker, Sauna"
            />
          </label>
        </div>

        <div className="photo-section">
          <span className="section-label">Member Photo</span>
          {currentPhoto && !newPhoto && (
            <img src={currentPhoto} alt={member.name} className="current-photo" />
          )}
          <span className="section-label">
            {currentPhoto ? "Change photo (optional)" : "Add photo (optional)"}
          </span>
          <WebcamCapture onCapture={setNewPhoto} />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Update Member"}
        </button>
      </form>
    </div>
  );
}

export default EditMember;