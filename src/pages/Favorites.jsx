import { useSelector } from "react-redux";
import MemberCard from "../components/MemberCard";

function Favorites() {
  const favorites = useSelector(
    (state) => state.favorites.items
  );

  if (favorites.length === 0) {
    return <h2>No VIP members yet.</h2>;
  }

  return (
    <>
      <h1>VIP Members</h1>

      <div className="members">
        {favorites.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
          />
        ))}
      </div>
    </>
  );
}

export default Favorites;