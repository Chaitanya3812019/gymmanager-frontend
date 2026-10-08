import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function MemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getMember() {
      try {
        const response = await api.get(`/members/${id}`);
        setMember(response.data);
      } catch (err) {
        console.log(err);
        setError("Could not load this member.");
      }
    }
    getMember();
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!member) return <h2>Loading...</h2>;

  const show = (value) =>
    value === undefined || value === null || value === "" ? "—" : value;

  const fees = member.monthlyFees ?? member.fees;
  const facilities = Array.isArray(member.facilities) ? member.facilities : [];

  return (
    <div className="details">
      <img
        src={member.photo || member.image || "/default-avatar.png"}
        alt={member.name}
      />

      <h1>{member.name}</h1>
      {member.goal && <p>{member.goal}</p>}

      <h3>Branch</h3>
      <p>{show(member.branch)}</p>

      <h3>Membership Type</h3>
      <p>{show(member.membershipType)}</p>

      <h3>Preferred Time</h3>
      <p>{show(member.preferredTime)}</p>

      <h3>Duration</h3>
      <p>{show(member.duration)}</p>

      <h3>Schedule</h3>
      <p>{show(member.schedule)}</p>

      <h3>Specialization</h3>
      <p>{show(member.specialization)}</p>

      <h3>Monthly Fees</h3>
      <p>{fees !== undefined && fees !== "" ? `₹ ${fees}` : "—"}</p>

      <h3>Trainer Rating</h3>
      <p>{show(member.trainerRating)}</p>

      <h3>Facilities Included</h3>
      {facilities.length === 0 ? (
        <p>—</p>
      ) : (
        <ul>
          {facilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MemberDetails;