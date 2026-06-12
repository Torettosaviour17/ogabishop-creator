import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

interface Suggestion {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from("suggestions") // 👈 now using the renamed table
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setSuggestions(data || []);
  };

  const addSuggestion = async () => {
    if (!name || !message)
      return alert("Please enter your name and suggestion");
    const { error } = await supabase.from("suggestions").insert({
      name,
      message,
      created_at: new Date(),
    });
    if (error) {
      console.error(error);
      alert("Failed to submit. Please try again.");
      return;
    }
    setName("");
    setMessage("");
    setShowForm(false);
    fetchSuggestions();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-2">💡 Suggestions</h1>
      <p className="text-center text-gray-400 mb-10">
        Help OGABISHOP improve – share your ideas, feedback, or what you'd like
        to see next.
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full flex items-center gap-2"
        >
          {showForm ? "− Cancel" : "✍️ Share a Suggestion"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-red-950/50 to-black rounded-2xl p-6 mb-12 border border-red-500">
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Your suggestion..."
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={addSuggestion}
            className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-full"
          >
            Submit Suggestion
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {suggestions.map((sug) => (
          <div
            key={sug.id}
            className="bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-red-800 hover:shadow-xl transition"
          >
            <p className="font-bold text-red-400 text-lg">{sug.name}</p>
            <p className="mt-2 text-gray-200 italic">"{sug.message}"</p>
            <p className="text-xs text-gray-500 mt-3">
              {new Date(sug.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No suggestions yet. Be the first to share your idea!
        </div>
      )}
    </div>
  );
}
