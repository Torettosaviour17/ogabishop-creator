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
import type { GalleryImage } from "../types";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Load images from Firestore on mount
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
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, "gallery"), {
        imageUrl,
        caption,
        uploadedAt: new Date(),
      });

      // Reset form and refresh gallery
      setFile(null);
      setCaption("");
      setShowUploadForm(false);
      await fetchImages();
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check Firebase rules.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      // Delete from Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      // Delete from Firestore
      await deleteDoc(doc(db, "gallery", id));
      // Refresh gallery
      await fetchImages();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
          📸 Gallery
        </h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full flex items-center gap-2 transition"
        >
          <i className="fas fa-plus"></i>
          {showUploadForm ? "Cancel" : "Add Images"}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-red-800">
          <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>
          <p className="text-sm text-gray-400 mb-3">
            Image will be stored in Firebase (permanent storage)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3 text-white w-full bg-black/50 p-2 rounded"
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
            {uploading ? "Uploading..." : "Add to Gallery"}
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <i className="fas fa-image text-5xl mb-4"></i>
          <p>No images yet. Click "Add Images" to start your gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-black/40 rounded-xl overflow-hidden border border-red-800 hover:scale-105 transition group"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery image"}
                className="w-full h-56 object-cover"
              />
              {img.caption && (
                <p className="p-2 text-sm text-gray-300 truncate">
                  {img.caption}
                </p>
              )}
              <button
                onClick={() => handleDelete(img.id, img.imageUrl)}
                className="w-full bg-red-900/50 p-2 text-sm hover:bg-red-800 transition"
              >
                <i className="fas fa-trash-alt mr-1"></i> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
