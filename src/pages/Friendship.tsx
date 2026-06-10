export default function Friendship() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-linear-to-br from-red-900 to-black rounded-2xl p-10 border-2 border-red-500">
        <i className="fas fa-heart text-6xl text-red-400 mb-4"></i>
        <h1 className="text-5xl font-bold mb-4">🤝 Our Brotherhood</h1>
        <p className="text-xl mb-6">
          Joshua, from late-night edits to celebrating your wins – this
          friendship is legendary. You're not just a creator; you're family.
          This page is dedicated to all the memories we've built.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-black/50 p-4 rounded-xl">
            🎬 First collab shoot – 2022
          </div>
          <div className="bg-black/50 p-4 rounded-xl">
            🎂 Your 25th birthday surprise
          </div>
          <div className="bg-black/50 p-4 rounded-xl">
            🚀 Hitting 100k followers together
          </div>
        </div>
        <p className="mt-8 italic">
          Only visible today (and with the secret password). Love you, bro. 💙
        </p>
      </div>
    </div>
  );
}
