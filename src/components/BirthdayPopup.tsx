import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function BirthdayPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const today = new Date();
    const isBirthday = today.getMonth() === 4 && today.getDate() === 28; // May 28
    const hasSeen = sessionStorage.getItem("birthdaySeen");

    if (isBirthday && !hasSeen) {
      setShow(true);
      sessionStorage.setItem("birthdaySeen", "true");
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-linear-to-br from-red-900 to-black rounded-2xl p-8 max-w-md text-center border-2 border-red-500 shadow-2xl">
        <h2 className="text-4xl font-bold mb-3">
          🎂 HAPPY BIRTHDAY OGABISHOP! 🎂
        </h2>
        <p className="text-lg mb-4">
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
