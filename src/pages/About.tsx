import { useState, useEffect } from "react";

export default function About() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  const phrases = [
    "Comedy Creator",
    "Frontend Developer",
    "Crypto Enthusiast",
    "Storyteller",
    "OGABISHOP",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[loopNum % phrases.length];
      const updatedText = isDeleting
        ? currentPhrase.substring(0, displayText.length - 1)
        : currentPhrase.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, phrases]);

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/ogabishopcomedy_?igsh=MWh1NWplZHhyamsyMA%3D%3D&utm_source=qr",
      iconClass: "fab fa-instagram",
      handle: "@ogabishop",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@ogabishopcomedybackup?_r=1&_d=f11k01gghb9k9e&sec_uid=MS4wLjABAAAA5RagO71juGZoaw7PhQtgL4HIb2hqeVHmV0oehU9wydP--c9hjLZAeuVcWX2Fa1HO&share_author_id=7527803460528718870&sharer_language=en&source=h5_m&u_code=elbeef35ehbh33&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=FFA9314A-DB79-48FE-8B3B-A9D85E930424&user_id=7527803460528718870&sec_user_id=MS4wLjABAAAA5RagO71juGZoaw7PhQtgL4HIb2hqeVHmV0oehU9wydP--c9hjLZAeuVcWX2Fa1HO&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233",
      iconClass: "fab fa-tiktok",
      handle: "@ogabishop",
    },
    {
      name: "YouTube",
      url: "#",
      iconClass: "fab fa-youtube",
      handle: "OGABISHOP",
    },
    // {
    //   name: "Twitter",
    //   url: "#",
    //   iconClass: "fab fa-twitter",
    //   handle: "@ogabishop",
    // },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1DBBMCSFSK/?mibextid=wwXIfr",
      iconClass: "fab fa-facebook-f",
      handle: "@ogabishop",
    },
  ];

  const skills = {
    crypto: ["Bitcoin", "Ethereum", "Smart Contracts", "DeFi", "NFTs"],
    frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Firebase"],
    general: [
      "Comedy Writing",
      "Video Editing",
      "Content Strategy",
      "Public Speaking",
      "Brand Collaborations",
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-red-500 shadow-xl shadow-red-500/30">
          <img
            src="/oga1.jpeg"
            alt="Joshua Christian Friday - OGABISHOP"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Joshua Christian Friday
          </h1>
          <p className="text-xl text-gray-300 mt-2">
            aka <span className="text-red-400 font-bold">OGABISHOP</span>
          </p>
          <div className="mt-4 h-16">
            <p className="text-lg md:text-xl text-red-300 font-mono">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bio + Social Links */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-red-800 mb-10">
        <p className="text-gray-200 leading-relaxed text-lg mb-6">
          OGABISHOP is a multi-talented creator: a comedian who makes you laugh,
          a frontend developer who builds sleek web experiences, and a crypto
          enthusiast navigating the blockchain space. With a passion for
          storytelling and tech, he bridges the gap between entertainment and
          innovation. When he's not coding or cracking jokes, you'll find him
          engaging with his community and dropping viral content.
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-950/50 hover:bg-red-700 px-4 py-2 rounded-full transition border border-red-700"
            >
              <i className={`${link.iconClass} text-lg`}></i>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-950/40 to-black rounded-xl p-5 border border-amber-700 hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <i className="fab fa-bitcoin text-amber-400"></i>
            Crypto & Web3
          </h3>
          <ul className="space-y-2">
            {skills.crypto.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <i className="fas fa-arrow-right text-amber-400 text-sm"></i>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-950/40 to-black rounded-xl p-5 border border-blue-700 hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <i className="fas fa-code text-blue-400"></i>
            Frontend Dev
          </h3>
          <ul className="space-y-2">
            {skills.frontend.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <i className="fas fa-arrow-right text-blue-400 text-sm"></i>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-red-950/40 to-black rounded-xl p-5 border border-red-700 hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <i className="fas fa-theater-masks text-red-400"></i>
            General & Creative
          </h3>
          <ul className="space-y-2">
            {skills.general.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <i className="fas fa-arrow-right text-red-400 text-sm"></i>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fun Fact */}
      <div className="mt-10 text-center italic text-gray-400 border-t border-red-800 pt-6">
        <i className="fas fa-quote-left mr-1 text-sm"></i>
        “Making people laugh is my superpower. Code is my second language.”
      </div>
    </div>
  );
}
