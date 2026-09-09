"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ImageValue } from "@/components/admin/ImageUploader";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type GalleryUploaderProps = {
  value: ImageValue[];
  onChange: (value: ImageValue[]) => void;
  label?: string;
  max?: number;
};

export default function GalleryUploader({
  value,
  onChange,
  label = "Gallery Images",
  max = 6,
}: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const remaining = max - value.length;

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, AVIF.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "File too large. Maximum allowed size is 5 MB.";
    }
    return null;
  };

  const upload = (file: File) => {
    const error = validate(file);
    if (error) {
      toast.error(error);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    const token = process.env.NEXT_PUBLIC_UPLOAD_TOKEN;
    if (token) xhr.setRequestHeader("x-upload-token", token);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);

      let data: {
        success: boolean;
        secure_url?: string;
        public_id?: string;
        error?: string;
      };
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        toast.error("Upload failed. Please try again.");
        return;
      }

      if (xhr.status === 200 && data.success && data.secure_url) {
        onChange([
          ...valueRef.current,
          { url: data.secure_url, publicId: data.public_id ?? null },
        ]);
        toast.success("Image uploaded successfully.");
      } else {
        toast.error(data.error ?? "Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setProgress(0);
      toast.error("Upload failed. Check your connection and try again.");
    };

    setUploading(true);
    setProgress(0);
    xhr.send(formData);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, remaining);
    if (list.length < files.length) {
      toast.error(`You can add up to ${max} images.`);
    }
    for (const file of list) upload(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="mb-2 block font-medium">
        {label}{" "}
        <span className="text-sm font-normal text-gray-500">
          ({value.length}/{max})
        </span>
      </span>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-gray-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={`Gallery image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {remaining > 0 && (
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
                "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-gray-50 text-sm font-medium text-gray-500 transition-colors",
                dragging
                  ? "border-black bg-gray-100 text-ink"
                  : "border-black/20 hover:border-black/50",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  dragging ? "bg-black text-white" : "bg-black/5 text-ink",
                )}
              >
                <ImagePlus size={20} />
              </span>
              Add more
            </button>
          )}
        </div>
      )}

      {value.length === 0 && (
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
            "flex h-36 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-gray-50 transition-colors",
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
            <ImagePlus size={22} />
          </span>
          <span className="text-sm font-medium">
            Drag &amp; drop or click to upload
          </span>
          <span className="text-xs text-gray-500">
            Select multiple images — PNG, JPG, WEBP, GIF or AVIF, max 5 MB each
          </span>
        </button>
      )}

      {uploading && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/10 bg-gray-50 px-4 py-3">
          <Loader2 size={18} className="animate-spin text-ink" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-black transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            Uploading {progress}%
          </span>
        </div>
      )}

      {remaining > 0 && value.length > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-black"
        >
          <UploadCloud size={15} />
          Upload More
        </button>
      )}
    </div>
  );
}
