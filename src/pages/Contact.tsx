import { useState } from "react";
import emailjs from "emailjs-com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_name: "Joshua",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSuccess("Message sent! Joshua will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setSuccess("Failed to send. Try again later.");
    }
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">📬 Contact OGABISHOP</h1>
      <form onSubmit={handleSubmit} className="bg-red-950/30 p-6 rounded-xl">
        <input
          type="text"
          placeholder="Your Name"
          required
          className="w-full p-3 rounded bg-black/50 border border-red-800 mb-4"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          className="w-full p-3 rounded bg-black/50 border border-red-800 mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Your Message"
          required
          rows={5}
          className="w-full p-3 rounded bg-black/50 border border-red-800 mb-4"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-red-600 px-6 py-2 rounded-full w-full"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
        {success && <p className="mt-4 text-green-400">{success}</p>}
      </form>
    </div>
  );
}
