import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Event } from "../types";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [tempImageFiles, setTempImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Event,
    );
    setEvents(items);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date)
      return alert("Title and date required");
    await addDoc(collection(db, "events"), {
      title: newEvent.title,
      date: new Date(newEvent.date),
      description: newEvent.description,
      imageUrls: [],
      createdAt: new Date(),
    });
    setNewEvent({ title: "", date: "", description: "" });
    setShowForm(false);
    fetchEvents();
  };

  const handleUploadImagesToEvent = async (eventId: string) => {
    if (tempImageFiles.length === 0) return;
    setUploadingImg(true);
    const urls = [];
    for (const file of tempImageFiles) {
      const storageRef = ref(
        storage,
        `events/${eventId}/${Date.now()}_${file.name}`,
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    const eventRef = doc(db, "events", eventId);
    const event = events.find((e) => e.id === eventId);
    const updatedUrls = [...(event?.imageUrls || []), ...urls];
    await updateDoc(eventRef, { imageUrls: updatedUrls });
    setTempImageFiles([]);
    setSelectedEventId(null);
    fetchEvents();
    setUploadingImg(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event and all its images?")) return;
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  // Check if event is today (May 28)
  const isBirthdayEvent = (eventDate: Date) => {
    const today = new Date();
    return eventDate.getMonth() === 4 && eventDate.getDate() === 28;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-2 text-center">
        📅 Events Timeline
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Celebrate special moments & upload memories
      </p>

      {/* Toggle Button for Create Form */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full flex items-center gap-2"
        >
          {showForm ? "− Hide Form" : "+ Create New Event"}
        </button>
      </div>

      {/* Create Event Form (conditionally visible) */}
      {showForm && (
        <div className="bg-gradient-to-br from-red-950/50 to-black rounded-2xl p-6 mb-12 border border-red-500 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">✨ Add a New Event</h2>
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-lg bg-black/60 border border-red-800 mb-3"
            rows={3}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <button
            onClick={handleCreateEvent}
            className="bg-red-700 hover:bg-red-800 px-6 py-2 rounded-full"
          >
            Create Event
          </button>
        </div>
      )}

      {/* Events Timeline */}
      <div className="space-y-10">
        {events.map((event) => {
          const isBirthday = isBirthdayEvent(new Date(event.date));
          return (
            <div
              key={event.id}
              className={`relative rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
                isBirthday
                  ? "border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30"
                  : "border border-red-800"
              }`}
            >
              {/* Birthday Glow Effect */}
              {isBirthday && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold px-4 py-1 rounded-bl-2xl z-10">
                  🎂 TODAY'S BIRTHDAY EVENT 🎂
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-sm p-6">
                <h3 className="text-3xl font-bold">{event.title}</h3>
                <p className="text-red-400 text-sm mt-1">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="mt-3 text-gray-200">{event.description}</p>

                {/* Image Gallery */}
                {event.imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    {event.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                )}

                {/* Add Images Button */}
                <button
                  onClick={() =>
                    setSelectedEventId(
                      event.id === selectedEventId ? null : event.id,
                    )
                  }
                  className="mt-4 text-sm bg-red-900/60 hover:bg-red-800 px-4 py-2 rounded-full flex items-center gap-1"
                >
                  📸 {selectedEventId === event.id ? "Cancel" : "Add Images"}
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="ml-3 text-sm bg-red-900/60 hover:bg-red-800 px-4 py-2 rounded-full"
                >
                  🗑️ Delete Event
                </button>

                {/* Upload Form (shown only for this event) */}
                {selectedEventId === event.id && (
                  <div className="mt-4 p-4 bg-black/50 rounded-xl">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setTempImageFiles(Array.from(e.target.files || []))
                      }
                      className="mb-2"
                    />
                    <button
                      onClick={() => handleUploadImagesToEvent(event.id)}
                      disabled={uploadingImg}
                      className="bg-red-700 px-4 py-1 rounded-full text-sm"
                    >
                      {uploadingImg ? "Uploading..." : "Upload Images"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No events yet. Click "Create New Event" to add your first memory.
          </div>
        )}
      </div>
    </div>
  );
}
