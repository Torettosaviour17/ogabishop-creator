import { useState, useEffect, type ChangeEvent, type DragEvent } from "react";
import { supabase } from "../supabase/client";
import Dialog from "../components/Dialog";

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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Dialog state
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: "info" | "warning" | "error" | "success";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "info",
  });

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

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
      setDialog({
        isOpen: true,
        title: "Invalid File",
        message: "Please drop an image file (JPEG, PNG, GIF, etc.)",
        onConfirm: closeDialog,
        confirmText: "Got it",
        type: "error",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setDialog({
        isOpen: true,
        title: "No Image Selected",
        message: "Please select or drop an image first.",
        onConfirm: closeDialog,
        confirmText: "OK",
        type: "warning",
      });
      return;
    }
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
      setDialog({
        isOpen: true,
        title: "Success!",
        message: "Image uploaded successfully.",
        onConfirm: closeDialog,
        confirmText: "Great",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setDialog({
        isOpen: true,
        title: "Upload Failed",
        message: "Could not upload image. Check your connection or try again.",
        onConfirm: closeDialog,
        confirmText: "OK",
        type: "error",
      });
    }
    setUploading(false);
  };

  const handleDelete = async (id: number, storagePath: string) => {
    setDialog({
      isOpen: true,
      title: "Delete Image?",
      message: "This action cannot be undone. Are you sure?",
      onConfirm: async () => {
        closeDialog();
        try {
          await supabase.storage.from("gallery").remove([storagePath]);
          await supabase.from("gallery").delete().eq("id", id);
          await fetchImages();
          setDialog({
            isOpen: true,
            title: "Deleted",
            message: "Image removed from gallery.",
            onConfirm: closeDialog,
            confirmText: "OK",
            type: "success",
          });
        } catch (err) {
          console.error(err);
          setDialog({
            isOpen: true,
            title: "Delete Failed",
            message: "Could not delete image. Try again later.",
            onConfirm: closeDialog,
            confirmText: "OK",
            type: "error",
          });
        }
      },
      onCancel: closeDialog,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "warning",
    });
  };

  const handleDownload = async (imageUrl: string, caption: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = caption ? `${caption}.jpg` : "ogabishop-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      setDialog({
        isOpen: true,
        title: "Download Failed",
        message: "Could not download image. Please try again.",
        onConfirm: closeDialog,
        confirmText: "OK",
        type: "error",
      });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            📸 Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            Click any image to view full size
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

      {showUploadForm && (
        <div className="bg-gradient-to-br from-black/60 to-red-950/20 backdrop-blur-md rounded-2xl p-6 mb-12 border border-red-700 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
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
              className="bg-black/50 rounded-xl border border-red-800 hover:scale-[1.02] transition group shadow-lg relative overflow-visible"
            >
              <div
                className="relative cursor-pointer rounded-t-xl overflow-hidden"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery"}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <i className="fas fa-expand text-white text-2xl"></i>
                </div>
              </div>
              <div className="p-3 flex justify-between items-center">
                {img.caption ? (
                  <p className="text-sm text-gray-200 truncate flex-1 mr-2">
                    {img.caption}
                  </p>
                ) : (
                  <span className="flex-1"></span>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === img.id ? null : img.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition px-2"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  {openMenuId === img.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-black/95 backdrop-blur-sm rounded-lg shadow-lg border border-red-800 z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(img.image_url, img.caption || "image");
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-red-950 rounded-t-lg"
                      >
                        <i className="fas fa-download mr-2"></i> Download
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id, img.storage_path);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950 rounded-b-lg"
                      >
                        <i className="fas fa-trash-alt mr-2"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-auto h-auto">
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || "Full size"}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl transition"
            >
              ✕
            </button>
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black/70 py-2 px-5 rounded-full backdrop-blur-sm text-sm">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        type={dialog.type}
      />
    </div>
  );
}
