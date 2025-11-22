export enum CartoonStyle {
  Pixar3D = "3D Pixar Style",
  Anime = "Anime / Manga",
  ComicBook = "Vintage Comic Book",
  Caricature = "Exaggerated Caricature",
  FlatDesign = "Minimalist Flat Design"
}

export interface GeneratedImageResult {
  imageUrl: string;
  style: CartoonStyle;
}

export interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  base64Data: string | null; // Pure base64 without prefix
  mimeType: string | null;
}
