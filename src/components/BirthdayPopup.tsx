import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function BirthdayPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Allow forcing the popup during development using:
    // - URL query: ?showBirthday=1
    // - Local storage: localStorage.setItem('forceBirthdayPopup','true')
    const params = new URLSearchParams(window.location.search);
    const force =
      params.get("showBirthday") === "1" ||
      localStorage.getItem("forceBirthdayPopup") === "true";
    const today = new Date();
    const isBirthday = today.getMonth() === 4 && today.getDate() === 28; // May 28
    if (isBirthday || force) {
      setShow(true);
      // Fire confetti when popup appears
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-9999">
      <div className="bg-linear-to-br from-red-900 to-black rounded-2xl p-6 md:p-8 max-w-md mx-4 text-center border-2 border-red-500 shadow-2xl animate-bounce">
        <i className="fas fa-birthday-cake text-6xl text-yellow-400 mb-3"></i>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          🎂 HAPPY BIRTHDAY OGABISHOP! 🎂
        </h2>
        <p className="text-base md:text-lg mb-4">
          Joshua Christian Friday, you make the world laugh. Keep shining, king!
          👑
        </p>
        <button
          onClick={() => setShow(false)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-bold transition"
        >
          Let's Party 🎉
        </button>
      </div>
    </div>
  );
}
