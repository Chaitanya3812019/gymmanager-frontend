import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import MemberCard from "../components/MemberCard";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    try {
      const response = await api.get("/members");
      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleDelete(id) {
    setMembers(members.filter((member) => member.id !== id));
  }

  const visibleMembers = members
    .filter((member) =>
      (member.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (member) =>
        membershipFilter === "All" ||
        member.membershipType === membershipFilter
    )
    .sort((a, b) => {
      const feesA = Number(a.fees) || 0;
      const feesB = Number(b.fees) || 0;
      const ratingA = Number(a.trainerRating) || 0;
      const ratingB = Number(b.trainerRating) || 0;

      switch (sortBy) {
        case "fees-asc":
          return feesA - feesB;
        case "fees-desc":
          return feesB - feesA;
        case "rating-asc":
          return ratingA - ratingB;
        case "rating-desc":
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

  return (
    <>
      <h1>Our Members</h1>

      <Link to="/add-member">Add Member</Link>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={membershipFilter}
          onChange={(e) => setMembershipFilter(e.target.value)}
        >
          <option>All</option>
          <option>Gold</option>
          <option>Silver</option>
          <option>Platinum</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">Sort By</option>
          <option value="fees-asc">Fees (Low to High)</option>
          <option value="fees-desc">Fees (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
          <option value="rating-desc">Rating (High to Low)</option>
        </select>
      </div>

      <div className="members">
        {visibleMembers.length === 0 ? (
          <p>No members found.</p>
        ) : (
          visibleMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Members;