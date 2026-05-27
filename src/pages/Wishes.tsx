import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import type { Wish } from "../types";

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Wish,
    );
    setWishes(items);
  };

  const addWish = async () => {
    if (!name || !message) return alert("Please enter your name and message");
    await addDoc(collection(db, "wishes"), {
      name,
      message,
      createdAt: new Date(),
    });
    setName("");
    setMessage("");
    setShowForm(false);
    fetchWishes();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-2">
        💬 Birthday Wishes
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Leave a sweet message for OGABISHOP
      </p>

      {/* Toggle Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full flex items-center gap-2"
        >
          {showForm ? "− Cancel" : "✍️ Write a Wish"}
        </button>
      </div>

      {/* Wish Form (conditionally visible) */}
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
            placeholder="Your birthday wish for OGABISHOP..."
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={addWish}
            className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-full"
          >
            Send Wish 🎂
          </button>
        </div>
      )}

      {/* Wishes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-red-800 hover:shadow-xl transition"
          >
            <p className="font-bold text-red-400 text-lg">{wish.name}</p>
            <p className="mt-2 text-gray-200 italic">"{wish.message}"</p>
            <p className="text-xs text-gray-500 mt-3">
              {new Date(wish.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {wishes.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No wishes yet. Be the first to wish OGABISHOP!
        </div>
      )}
    </div>
  );
}
