import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import { supabase } from "../supabase/client";

interface GalleryImage {
  id: number;
  image_url: string;
  storage_path: string;
  caption: string;
  uploaded_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (error) console.error(error);
    else setImages(data || []);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      alert("Drop an image file");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image");
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from("gallery").insert({
        image_url: imageUrl,
        storage_path: filePath,
        caption,
      });
      if (dbError) throw dbError;

      setFile(null);
      setCaption("");
      setPreviewUrl(null);
      setShowUploadForm(false);
      await fetchImages();
      alert("Uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check Supabase storage rules (set to public).");
    }
    setUploading(false);
  };

  const handleDelete = async (id: number, storagePath: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await supabase.storage.from("gallery").remove([storagePath]);
      await supabase.from("gallery").delete().eq("id", id);
      await fetchImages();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            📸 Gallery
          </h1>
          <p className="text-gray-400 mt-1">Drag & drop any image</p>
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

      {showUploadForm && (
        <div className="bg-gradient-to-br from-black/60 to-red-950/20 backdrop-blur-md rounded-2xl p-6 mb-12 border border-red-700 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Drop zone */}
            <div>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                  isDragOver
                    ? "border-red-500 bg-red-950/40"
                    : previewUrl
                      ? "border-red-500 bg-red-950/20"
                      : "border-red-700 hover:border-red-500"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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

            {/* Caption + Upload */}
            <div>
              <input
                type="text"
                placeholder="Caption (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/60 border border-red-800 focus:outline-none focus:border-red-500"
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

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-black/30 rounded-2xl border border-dashed border-red-800">
          <i className="fas fa-camera text-6xl mb-4 opacity-50"></i>
          <p className="text-lg">Gallery is empty</p>
          <p className="text-sm">
            Click "Add New Image" to upload your first photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-black/50 rounded-xl overflow-hidden border border-red-800 hover:scale-[1.02] transition group shadow-lg"
            >
              <div className="relative">
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery"}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => handleDelete(img.id, img.storage_path)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-700 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
              {img.caption && (
                <div className="p-3">
                  <p className="text-sm text-gray-200">{img.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(img.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
