import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>AI Chatbot</h1>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
