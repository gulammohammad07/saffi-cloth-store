import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDER = "Saffi Ecom Store";
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadResult = {
  secure_url: string;
  public_id: string;
};

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function isValidImageFile(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; error: string } {
  if (!file.type || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      ok: false,
      error:
        "Invalid file type. Allowed formats: JPEG, PNG, WEBP, GIF, AVIF.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: "File too large. Maximum allowed size is 5 MB.",
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "The selected file is empty." };
  }

  return { ok: true };
}

export function isValidVideoFile(file: {
  type: string;
  size: number;
}): { ok: true } | { ok: false; error: string } {
  if (!file.type || !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: "Invalid video type. Allowed formats: MP4, MOV, AVI, WEBM.",
    };
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      ok: false,
      error: "Video too large. Maximum allowed size is 100 MB.",
    };
  }

  if (file.size === 0) {
    return { ok: false, error: "The selected video file is empty." };
  }

  return { ok: true };
}

export function uploadImageBuffer(
  buffer: Buffer,
  folder: string = CLOUDINARY_FOLDER,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 1200, crop: "limit", quality: "auto:good" }],
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
          return;
        }

        if (!result || !result.secure_url || !result.public_id) {
          reject(new Error("Cloudinary returned an incomplete response."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.on("error", (error) => reject(error));
    stream.end(buffer);
  });
}

export function uploadVideoBuffer(
  buffer: Buffer,
  folder: string = CLOUDINARY_FOLDER,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
          return;
        }

        if (!result || !result.secure_url || !result.public_id) {
          reject(new Error("Cloudinary returned an incomplete response."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.on("error", (error) => reject(error));
    stream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(
  publicId: string,
): Promise<boolean> {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok" || result.result === "not found";
  } catch {
    return false;
  }
}

export async function deleteVideoFromCloudinary(
  publicId: string,
): Promise<boolean> {
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result.result === "ok" || result.result === "not found";
  } catch {
    return false;
  }
}
