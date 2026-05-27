import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let nextBirthday = new Date(now.getFullYear(), 4, 28);
      if (now > nextBirthday) {
        nextBirthday = new Date(now.getFullYear() + 1, 4, 28);
      }
      const diff = nextBirthday.getTime() - now.getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-6 justify-center text-center">
      <div className="bg-black/50 px-4 py-2 rounded-xl">
        <span className="text-3xl font-bold text-red-500">{timeLeft.days}</span>
        <br />
        Days
      </div>
      <div className="bg-black/50 px-4 py-2 rounded-xl">
        <span className="text-3xl font-bold text-red-500">
          {timeLeft.hours}
        </span>
        <br />
        Hours
      </div>
      <div className="bg-black/50 px-4 py-2 rounded-xl">
        <span className="text-3xl font-bold text-red-500">
          {timeLeft.minutes}
        </span>
        <br />
        Mins
      </div>
      <div className="bg-black/50 px-4 py-2 rounded-xl">
        <span className="text-3xl font-bold text-red-500">
          {timeLeft.seconds}
        </span>
        <br />
        Secs
      </div>
    </div>
  );
}
