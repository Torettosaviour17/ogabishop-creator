import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  password,
}: {
  children: ReactNode;
  password: string;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("auth_builder");
    if (isAuth === "true") {
      setAuthorized(true);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = () => {
    if (inputPassword === password) {
      sessionStorage.setItem("auth_builder", "true");
      setAuthorized(true);
      setShowModal(false);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setInputPassword("");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!showModal && !authorized) return null;
  if (authorized) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]">
      <div className="bg-gradient-to-br from-red-950 to-black rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-red-500 shadow-2xl">
        <div className="text-center mb-6">
          <i className="fas fa-lock text-5xl text-red-500 mb-3"></i>
          <h2 className="text-2xl font-bold text-white">Under Construction</h2>
          <p className="text-gray-300 mt-2">
            This page is still being built. Please enter the developer password
            to continue.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full p-3 rounded-xl bg-black/60 border border-red-800 focus:outline-none focus:border-red-500 text-white placeholder-gray-500"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-full font-semibold transition"
            >
              Unlock
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-full font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
