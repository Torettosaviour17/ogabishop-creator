import { Link } from "react-router-dom";
// import CountdownTimer from "../components/CountdownTimer";
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
      url: "https://vm.tiktok.com/ZNRWyh1c5/",
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

      {/* Countdown Timer Section - responsive width */}
      {/* <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-4 md:p-6 text-center border border-red-500 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            🎈 Next Birthday Countdown
          </h2>
          <CountdownTimer />
        </div>
      </div> */}

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
