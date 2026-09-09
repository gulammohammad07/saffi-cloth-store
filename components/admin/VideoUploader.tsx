"use client";

import { useRef, useState } from "react";
import { Video, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type VideoValue = {
  url: string;
  publicId: string | null;
};

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];
const MAX_SIZE_BYTES = 100 * 1024 * 1024;

type VideoUploaderProps = {
  value: VideoValue;
  onChange: (value: VideoValue) => void;
  label?: string;
};

export default function VideoUploader({
  value,
  onChange,
  label = "Product Video",
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Invalid file type. Allowed: MP4, MOV, AVI, WEBM.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "File too large. Maximum allowed size is 100 MB.";
    }
    return null;
  };

  const upload = (file: File) => {
    const error = validate(file);
    if (error) {
      toast.error(error);
      return;
    }

    const xhr = new XMLHttpRequest();
    setUploading(true);
    setProgress(0);
    fetch("/api/upload/signature", { method: "POST" })
      .then(async (response) => {
        const signed = await response.json();
        if (!response.ok) throw new Error(signed.error ?? "Unable to prepare video upload.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signed.apiKey);
        formData.append("timestamp", String(signed.timestamp));
        formData.append("signature", signed.signature);
        formData.append("folder", signed.folder);
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`);
        xhr.send(formData);
      })
      .catch((uploadError) => { setUploading(false); setProgress(0); toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again."); });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);

      let data: { success?: boolean; secure_url?: string; public_id?: string; error?: { message?: string } | string };
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        toast.error("Upload failed. Please try again.");
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        onChange({ url: data.secure_url, publicId: data.public_id ?? null });
        toast.success("Video uploaded successfully.");
      } else {
        toast.error(typeof data.error === "string" ? data.error : data.error?.message ?? "Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setProgress(0);
      toast.error("Upload failed. Check your connection and try again.");
    };

  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const clear = () => onChange({ url: "", publicId: null });

  return (
    <div>
      <span className="mb-2 block font-medium">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />

      {uploading ? (
        <div className="flex h-44 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-black/20 bg-gray-50">
          <Loader2 size={26} className="animate-spin text-ink" />
          <p className="text-sm font-medium">Uploading video to Cloudinary…</p>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-black transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{progress}%</p>
        </div>
      ) : value.url ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-xl border bg-gray-50">
            <video
              src={value.url}
              className="h-full w-full object-contain"
              controls
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              <UploadCloud size={15} />
              Replace Video
            </button>

            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={15} />
              Remove Video
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-gray-50 transition-colors",
            dragging
              ? "border-black bg-gray-100"
              : "border-black/20 hover:border-black/50",
          )}
        >
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              dragging ? "bg-black text-white" : "bg-black/5 text-ink",
            )}
          >
            <Video size={22} />
          </span>
          <span className="text-sm font-medium">
            Drag &amp; drop or click to upload
          </span>
          <span className="text-xs text-gray-500">
            MP4, MOV, AVI, WEBM — max 100 MB
          </span>
        </button>
      )}
    </div>
  );
}
