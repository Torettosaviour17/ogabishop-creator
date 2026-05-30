import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function BirthdayPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Jan, 4 = May
    const currentDay = today.getDate();

    // Get stored dismissal date from localStorage
    const dismissedUntil = localStorage.getItem("birthdayPopupDismissed");

    // Check if popup was already dismissed for these dates
    const todayStr = `${currentMonth}-${currentDay}`;
    const shouldBeDismissed = dismissedUntil === todayStr;

    // Active on May 30 AND May 31 (today and tomorrow)
    const isActive =
      (currentMonth === 4 && currentDay === 30) ||
      (currentMonth === 4 && currentDay === 31);

    if (isActive && !shouldBeDismissed) {
      setShow(true);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }
  }, []);

  const handleClose = () => {
    const today = new Date();
    const todayStr = `${today.getMonth()}-${today.getDate()}`;
    localStorage.setItem("birthdayPopupDismissed", todayStr);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] cursor-pointer"
      onClick={handleClose}
    >
      <div className="relative max-w-2xl w-full mx-4">
        <img
          src="/birthday-popup.jpg"
          alt="Happy Birthday OGABISHOP"
          className="w-full h-auto rounded-2xl shadow-2xl border-2 border-red-600"
          onClick={handleClose}
        />
        {/* Optional close button (X) in top-right corner */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
