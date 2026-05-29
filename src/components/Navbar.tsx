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

  // Close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-red-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent flex items-center"
            onClick={closeMenu}
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
                className={`hover:text-red-400 transition ${
                  location.pathname === link.path
                    ? "text-red-500 font-bold border-b-2 border-red-500"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {showFriendship && (
              <Link
                to="/friendship"
                className="text-pink-400 hover:text-pink-300 transition"
              >
                Friendship
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white text-3xl focus:outline-none"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu (90% width + backdrop) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop area (10% of screen on the right) - closes menu when clicked */}
          <div
            className="w-[10%] bg-black/30 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Drawer itself (90% width) */}
          <div className="w-[90%] bg-black/95 backdrop-blur-md h-full overflow-y-auto shadow-2xl border-l border-red-800 animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b border-red-800">
              <Link to="/" onClick={closeMenu} className="flex items-center">
                <img className="w-[50px]" src="/logo.png" alt="logo" />
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent ml-2">
                  OGABISHOP
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="text-white text-2xl focus:outline-none"
                aria-label="Close menu"
              >
                ✖
              </button>
            </div>
            <div className="flex flex-col p-5 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-xl py-2 px-4 rounded-lg transition ${
                    location.pathname === link.path
                      ? "bg-red-700 text-white font-bold"
                      : "text-gray-300 hover:bg-red-900/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {showFriendship && (
                <Link
                  to="/friendship"
                  onClick={closeMenu}
                  className="text-xl py-2 px-4 rounded-lg text-pink-400 hover:bg-red-900/50 transition"
                >
                  Friendship
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
