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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
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
      setPreviewUrl(null);
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
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "gallery", id));
      await fetchImages();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            📸 Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            Your visual journey – upload any image type
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className={`px-6 py-3 rounded-full flex items-center gap-2 transition font-semibold ${
            showUploadForm
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          }`}
        >
          <i className={`fas ${showUploadForm ? "fa-times" : "fa-plus"}`}></i>
          {showUploadForm ? "Cancel" : "Add New Image"}
        </button>
      </div>

      {/* Upload Form - Redesigned */}
      {showUploadForm && (
        <div className="bg-gradient-to-br from-black/60 to-red-950/20 backdrop-blur-md rounded-2xl p-6 mb-12 border border-red-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">✨ Upload to Gallery</h2>
          <p className="text-gray-300 mb-5 text-sm">
            Supported: JPG, PNG, GIF, WebP, SVG, and more (max 10MB each)
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: File drop zone + preview */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose Image
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                  previewUrl
                    ? "border-red-500 bg-red-950/20"
                    : "border-red-700 hover:border-red-500"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                ) : (
                  <div>
                    <i className="fas fa-cloud-upload-alt text-5xl text-red-400 mb-2"></i>
                    <p className="text-sm">Click or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Any image format
                    </p>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right: Caption + Upload button */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Behind the scenes, Comedy show, Studio fun..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/60 border border-red-800 focus:outline-none focus:border-red-500 transition"
              />
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`mt-5 w-full py-3 rounded-xl font-bold transition ${
                  uploading || !file
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                }`}
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload mr-2"></i> Publish to Gallery
                  </>
                )}
              </button>
              {file && !uploading && (
                <p className="text-xs text-green-400 mt-2">
                  <i className="fas fa-check-circle"></i> Ready: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-black/30 rounded-2xl border border-dashed border-red-800">
          <i className="fas fa-camera text-6xl mb-4 opacity-50"></i>
          <p className="text-lg">Gallery is empty</p>
          <p className="text-sm">
            Click "Add New Image" to upload your first photo.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">
              {images.length} images in gallery
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-black/50 rounded-xl overflow-hidden border border-red-800 hover:scale-[1.02] transition group shadow-lg"
              >
                <div className="relative">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery"}
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={() => handleDelete(img.id, img.imageUrl)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </div>
                {img.caption && (
                  <div className="p-3">
                    <p className="text-sm text-gray-200">{img.caption}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(img.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
