import { useAuth } from "../modules/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ backgroundColor: "#f5f5f5", padding: "1.5rem", borderRadius: "8px" }}>
        <h2>Welcome, {user?.email}!</h2>
        <p>This is your dashboard. You are logged in.</p>
        <div style={{ marginTop: "1rem" }}>
          <h3>User Information</h3>
          <ul>
            <li>User ID: {user?.id}</li>
            <li>Email: {user?.email}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
