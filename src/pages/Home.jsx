import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1775993167571-cd1ff4cadada?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="hero-overlay">
          <h1>FitZone Gym Management</h1>
          <p>Manage members, trainers and plans all in one place.</p>
          <Link to="/members" className="hero-btn">
            View Members
          </Link>
        </div>
      </div>

      <h2 className="plans-heading">Membership Plans</h2>

      <div className="plans">
        <div className="plan-card">
          <h3>Silver</h3>
          <p className="plan-price">₹1800<span>/month</span></p>
          <ul>
            <li>✅ Cardio Zone Access</li>
            <li>✅ Group Classes</li>
            <li>✅ Locker Room</li>
            <li>❌ Personal Trainer</li>
            <li>❌ Diet Consultation</li>
          </ul>
          <Link to="/register" className="plan-btn">Join Now</Link>
        </div>

        <div className="plan-card featured">
          <h3>Gold</h3>
          <p className="plan-price">₹2500<span>/month</span></p>
          <ul>
            <li>✅ Full Gym Access</li>
            <li>✅ Personal Trainer</li>
            <li>✅ Steam Room</li>
            <li>✅ Diet Consultation</li>
            <li>❌ 24/7 Access</li>
          </ul>
          <Link to="/register" className="plan-btn">Join Now</Link>
        </div>

        <div className="plan-card">
          <h3>Platinum</h3>
          <p className="plan-price">₹3500<span>/month</span></p>
          <ul>
            <li>✅ Full Gym Access</li>
            <li>✅ Personal Trainer</li>
            <li>✅ Steam Room</li>
            <li>✅ Diet Consultation</li>
            <li>✅ 24/7 Access</li>
          </ul>
          <Link to="/register" className="plan-btn">Join Now</Link>
        </div>
      </div>
    </>
  );
}

export default Home;