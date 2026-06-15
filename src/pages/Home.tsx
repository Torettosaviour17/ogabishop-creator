import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TikTokEmbed } from "react-social-media-embed";

export default function Home() {
  // Hero background carousel images (replace with your own)
  const heroImages = [
    "/oga5.jpeg", // your first image
    "/oga1.jpeg", // second image
    "/oga2.jpeg", // third image
  ];

  const [currentBg, setCurrentBg] = useState(0);

  // Auto-rotate background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Hero Section with Carousel Background */}
      <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image with fade transition */}
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentBg ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
            OGABISHOP
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-200">
            Joshua Christian Friday · Comedy Creator
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/events"
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold text-lg transition transform hover:scale-105"
            >
              📅 View Events
            </Link>
            <Link
              to="/gallery"
              className="bg-white/10 backdrop-blur-sm border border-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-bold text-lg transition"
            >
              📸 Explore Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* NEW: Three images section – you can replace these with your own images */}
      {/* <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ✨ Highlights ✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/40 rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="/placeholder-1.jpg"
              alt="Highlight 1"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="bg-black/40 rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="/placeholder-2.jpg"
              alt="Highlight 2"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="bg-black/40 rounded-2xl overflow-hidden border border-red-800 hover:scale-105 transition">
            <img
              src="/placeholder-3.jpg"
              alt="Highlight 3"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
        <p className="text-center text-gray-400 mt-4 text-sm">
          📸 Memorable moments – more coming soon
        </p>
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
