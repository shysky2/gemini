export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string; preview: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is like "data:image/jpeg;base64,/9j/4AAQ..."
      const match = result.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        resolve({
          mimeType: match[1],
          base64: match[2],
          preview: result
        });
      } else {
        reject(new Error("Failed to parse base64 string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
