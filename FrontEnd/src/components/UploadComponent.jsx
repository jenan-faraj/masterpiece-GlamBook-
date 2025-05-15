import { useRef, useState } from "react";
import axios from "axios";

export default function UploadComponent({ onUploadComplete }) {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const res = await axios.post("https://uploadthing.com/api/uploadFiles", {
        files: Array.from(files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        uploader: "imageUploader",
      });

      const { data } = res;
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const { url, fileKey } = data[i];
        await fetch(url, {
          method: "PUT",
          body: files[i],
        });

        uploadedUrls.push(`https://utfs.io/f/${fileKey}`);
      }

      onUploadComplete(uploadedUrls);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload files.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
