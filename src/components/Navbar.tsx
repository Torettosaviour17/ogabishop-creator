import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [showFriendship, setShowFriendship] = useState(false);

  useEffect(() => {
    const today = new Date();
    const isBirthday = today.getMonth() === 4 && today.getDate() === 28;
    setShowFriendship(isBirthday);
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/about", label: "About", icon: "📖" },
    { path: "/portfolio", label: "Portfolio", icon: "📸" },
    { path: "/events", label: "Events", icon: "📅" },
    { path: "/wishes", label: "Wishes", icon: "💬" },
    { path: "/contact", label: "Contact", icon: "📬" },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-red-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"
        >
          OGABISHOP
        </Link>
        <div className="flex gap-4 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1 hover:text-red-400 transition ${
                location.pathname === link.path
                  ? "text-red-500 font-bold border-b-2 border-red-500"
                  : "text-gray-300"
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          {showFriendship && (
            <Link
              to="/friendship"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
            >
              💝 Friendship
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
