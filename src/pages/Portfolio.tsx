import type { GalleryImage } from "../types";
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
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function Portfolio() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as GalleryImage,
    );
    setImages(items);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image");
    setUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "gallery"), {
        imageUrl,
        caption,
        uploadedAt: new Date(),
      });
      setFile(null);
      setCaption("");
      fetchImages();
      alert("Image uploaded!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "gallery", id));
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">📸 Portfolio Gallery</h1>
      <div className="bg-red-950/30 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-3">Upload New Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-3 text-white"
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 rounded bg-black/50 border border-red-800 mb-3"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-red-600 px-6 py-2 rounded-full"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-black/40 rounded-xl overflow-hidden border border-red-800"
          >
            <img
              src={img.imageUrl}
              alt={img.caption || "Gallery"}
              className="w-full h-48 object-cover"
            />
            {img.caption && (
              <p className="p-2 text-sm text-gray-300">{img.caption}</p>
            )}
            <button
              onClick={() => handleDelete(img.id, img.imageUrl)}
              className="w-full bg-red-900/50 p-2 text-sm hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
