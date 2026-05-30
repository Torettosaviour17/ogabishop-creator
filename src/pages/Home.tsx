import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { TikTokEmbed } from "react-social-media-embed";

export default function Home() {
  const handleCelebrate = () => {
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
  };

  const tiktokVideos = [
    {
      url: "https://www.tiktok.com/@ogabishopcomedybackup/video/7644730721109675286",
      title: "Latest Comedy Skit",
      stats: "1.2M Views on TikTok",
    },
    {
      url: "https://www.tiktok.com/@ogabishopcomedybackup/video/7644105087412899094",
      title: "OGABISHOP Comedy Clip",
      stats: "789K Views",
    },
    {
      url: "https://vm.tiktok.com/ZNRWybfHX/",
      title: "Exclusive Comedy Short",
      stats: "Trending Now",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/oga5.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
            OGABISHOP
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-200">
            Joshua Christian Friday · Comedy Creator
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCelebrate}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold text-lg transition transform hover:scale-105"
            >
              🎂 Celebrate Birthday
            </button>
            <Link
              to="/events"
              className="bg-white/10 backdrop-blur-sm border border-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-bold text-lg transition"
            >
              📅 View Events
            </Link>
          </div>
        </div>
      </div>

      {/* Location Card - Sunday Celebration at Vicpillia Hotel */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-950/80 to-black rounded-2xl border border-red-700 overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Image Section - REPLACE URL WITH YOUR HOTEL IMAGE */}
            <div className="md:w-1/3">
              <img
                src="/hotel-placeholder.jpg"
                alt="Vicpillia Hotel"
                className="w-full h-full object-cover min-h-[200px] md:min-h-full"
              />
            </div>

            {/* Content Section */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-map-marker-alt text-red-500 text-xl"></i>
                <h3 className="text-2xl font-bold text-white">
                  Vicpillia Hotel
                </h3>
              </div>

              <div className="flex items-center gap-4 flex-wrap mb-3">
                <span className="flex items-center gap-1 text-gray-300">
                  <i className="fas fa-calendar-alt text-red-400"></i>
                  Sunday, May 31st
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <i className="fas fa-clock text-red-400"></i>
                  By 8:00 PM
                </span>
              </div>

              <p className="text-gray-300 mb-4">
                Join us to celebrate OGABISHOP's birthday! Come through, have
                fun, and make memories. Everyone is welcome! 🎂🎉
              </p>

              <a
                href="https://maps.app.goo.gl/GqUfURmuj3NRDtBc9?g_st=iwb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
              >
                <i className="fas fa-directions"></i>
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Comedy Drops with TikTok Embeds */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          🔥 Latest Comedy Drops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiktokVideos.map((video, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-red-950/40 to-black rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition-all duration-300"
            >
              <div className="p-4">
                <h3 className="text-xl font-bold">{video.title}</h3>
                <p className="text-gray-300 text-sm mt-1 mb-3">{video.stats}</p>
                <div className="rounded-lg overflow-hidden">
                  <TikTokEmbed url={video.url} width="100%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
