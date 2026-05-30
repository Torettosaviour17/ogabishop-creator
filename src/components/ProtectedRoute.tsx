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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuth = sessionStorage.getItem("auth_builder");
    if (isAuth === "true") {
      setAuthorized(true);
      return;
    }

    const userPass = prompt(
      "🔒 This page is locked. Enter the secret password:",
    );
    if (userPass === password) {
      sessionStorage.setItem("auth_builder", "true");
      setAuthorized(true);
    } else {
      alert("Wrong password. Redirecting to home.");
      navigate("/");
    }
  }, [navigate, password]);

  return authorized ? <>{children}</> : null;
}
