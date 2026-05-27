import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showFriendship, setShowFriendship] = useState(false);

  useEffect(() => {
    const today = new Date();
    const isBirthday = today.getMonth() === 4 && today.getDate() === 28;
    setShowFriendship(isBirthday);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/gallery", label: "Gallery" },
    { path: "/events", label: "Events" },
    { path: "/wishes", label: "Wishes" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-red-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent flex items-center justify-center"
        >
          <img className="w-[60px] inline" src="/logo.png" alt="logo image" />
          <span className="ml-1 hidden md:flex">OGABISHOP</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
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
              <span></span> {link.label}
            </Link>
          ))}
          {showFriendship && (
            <Link
              to="/friendship"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
            >
              Friendship
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-red-800 py-4 px-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 hover:text-red-400 transition ${
                location.pathname === link.path
                  ? "text-red-500 font-bold"
                  : "text-gray-300"
              }`}
            >
              <span></span> {link.label}
            </Link>
          ))}
          {showFriendship && (
            <Link
              to="/friendship"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-pink-400"
            >
              Friendship
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
