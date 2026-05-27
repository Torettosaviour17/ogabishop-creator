import { Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import confetti from "canvas-confetti";

export default function Home() {
  const handleCelebrate = () => {
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative h-[85vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/1a1a2e/red?text=OGABISHOP+BANNER')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center px-4">
          <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
            OGABISHOP
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-200">
            Joshua Christian Friday · Comedy Creator
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleCelebrate}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold text-lg transition transform hover:scale-105"
            >
              🎂 Celebrate Birthday
            </button>
            <Link
              to="/events"
              className="bg-white/10 backdrop-blur-sm border border-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-bold transition"
            >
              📅 View Events
            </Link>
          </div>
        </div>
      </div>

      {/* Countdown Timer Section */}
      <div className="max-w-4xl mx-auto -mt-16 relative z-10">
        <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-6 text-center border border-red-500 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">
            🎈 Next Birthday Countdown
          </h2>
          <CountdownTimer />
        </div>
      </div>

      {/* Latest Works Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          🔥 Latest Comedy Drops
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-red-950/40 to-black rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="https://placehold.co/600x400/2a1a2e/red?text=Skit+Thumbnail"
              alt="Skit"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">🎬 "The Interview"</h3>
              <p className="text-gray-300 mt-1">1.2M views on TikTok</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-950/40 to-black rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="https://placehold.co/600x400/2a1a2e/red?text=Merch+Teaser"
              alt="Merch"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">👕 Limited Merch Drop</h3>
              <p className="text-gray-300 mt-1">Pre‑order now</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-950/40 to-black rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="https://placehold.co/600x400/2a1a2e/red?text=Podcast+Art"
              alt="Podcast"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">🎙️ Podcast Ep. 5</h3>
              <p className="text-gray-300 mt-1">Behind the Laughter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
