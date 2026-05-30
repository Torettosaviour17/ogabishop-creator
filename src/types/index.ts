export interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
  imageUrls: string[];
  createdAt: Date;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  storagePath: string;
  caption: string;
  uploadedAt: Date;
}
