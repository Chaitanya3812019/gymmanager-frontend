import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { toggleFavorite } from "../store/favoritesSlice";

function MemberCard({ member, onDelete }) {
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state) => state.favorites.items
  );

  const isFavorite = favorites.some(
    (m) => m.id === member.id
  );

  async function handleDelete() {
    await api.delete(
      `/members/${member.id}`
    );

    onDelete(member.id);
  }

  return (
    <div className="card">
      <button
        className={
          isFavorite
            ? "fav-btn active"
            : "fav-btn"
        }
        onClick={() =>
          dispatch(toggleFavorite(member))
        }
      >
        {isFavorite ? "★ VIP" : "☆ Mark VIP"}
      </button>

      <img
  src={member.photo || "/default-avatar.png"}
  alt={member.name}
  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
/>

      <h3>{member.name}</h3>

      <p>{member.branch}</p>

      <p>{member.membershipType}</p>

      <p> ⭐ {member.trainerRating}</p>

      <Link to={`/members/${member.id}`}>
        View Profile
      </Link>

      <Link to={`/edit-member/${member.id}`}>
        Edit
      </Link>

      <button
        className="delete-btn"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default MemberCard;
