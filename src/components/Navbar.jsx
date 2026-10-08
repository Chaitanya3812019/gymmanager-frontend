import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/members">Members</Link>
          <Link to="/favorites">VIP Members</Link>

          <div className="nav-user">
            <img
              src={user.photo || "/default-avatar.png"}
              alt={user.name}
              className="nav-avatar"
            />
            <span className="nav-name">{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;