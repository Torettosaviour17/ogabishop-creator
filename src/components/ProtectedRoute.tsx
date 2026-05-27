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
    const userPass = prompt(
      "🔒 This page is locked. Enter the secret password:",
    );
    if (userPass === password) {
      setAuthorized(true);
    } else {
      alert("Wrong password. Redirecting to home.");
      navigate("/");
    }
  }, [navigate, password]);

  return authorized ? <>{children}</> : null;
}
