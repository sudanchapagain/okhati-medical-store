import { useState } from "react";

type Props = {
  onChange: (url: string | null) => void;
};

export default function ImageUpload({ onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error("Upload failed:", errorData);
        setError(errorData.detail || "Upload failed");
        onChange(null);
        return;
      }

      const result = await uploadRes.json();
      console.log("Upload successful:", result);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError("Upload failed - no URL returned");
        onChange(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Network error occurred");
      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        className="rounded-lg border-1 bg-gray-100 p-4"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <div className="text-blue-600">Uploading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
