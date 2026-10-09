// src/services/log-field-incident/cloudinaryService.js
import { Platform } from "react-native";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_FOLDER = "wildlife-incidents";
const ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Asserts that the required Cloudinary env vars are present.
 * Throws with a clear message if any are missing.
 */
function assertConfig() {
  const missing = [];
  if (!CLOUD_NAME) missing.push("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME");
  if (!UPLOAD_PRESET) missing.push("EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET");

  if (missing.length) {
    throw new Error(
      `Cloudinary config missing: ${missing.join(", ")}. Check .env.local and restart Metro with --clear.`
    );
  }
}

/**
 * Builds the FormData file part — platform-aware.
 * - Native (iOS/Android): { uri, type, name } object
 * - Web: Blob fetched from the local URI
 */
async function buildFilePart(photoUri) {
  if (Platform.OS === "web") {
    const blob = await (await fetch(photoUri)).blob();
    return blob;
  }
  return {
    uri: photoUri,
    type: "image/jpeg",
    name: `incident-${Date.now()}.jpg`,
  };
}

/**
 * Uploads a local photo URI to Cloudinary.
 * @param {string|null} photoUri - Local file URI from the camera.
 * @returns {Promise<string|null>} Secure Cloudinary URL, or null if no photo.
 * @throws {Error} If env vars are missing or the upload fails.
 */
export async function uploadPhoto(photoUri) {
  if (!photoUri) return null;

  assertConfig();

  const filePart = await buildFilePart(photoUri);

  const formData = new FormData();
  formData.append("file", filePart);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", UPLOAD_FOLDER);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message ?? "Cloudinary upload failed");
  }

  return json.secure_url;
}