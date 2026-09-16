// Pages/ProtectedScreen.jsx
export default function ProtectedScreen({ user }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Inventory (Protected Route)</h1>
      <p>This is a dummy placeholder for the Inventory screen from my Semester 1 design.</p>
      <p>Welcome, {user?.name || user?.nameSurname || "user"} — you're signed in.</p>
    </div>
  );
}