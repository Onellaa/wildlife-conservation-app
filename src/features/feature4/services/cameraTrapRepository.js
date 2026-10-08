import { sampleImages } from "../data/sampleImages";
import {
  validateClassification,
  validateSuspiciousFlag,
  validateInvestigationStatus,
} from "../utils/validation";

let images = sampleImages.map((item) => ({ ...item }));

const clone = (value) => JSON.parse(JSON.stringify(value));

export function resetCameraTrapRepository() {
  images = sampleImages.map((item) => ({ ...item }));
}

export async function getCameraTrapImages(filter = "ALL") {
  const normalized = String(filter || "ALL").toUpperCase();

  const result =
    normalized === "ALL"
      ? images
      : images.filter((image) => image.reviewStatus === normalized);

  return clone(result);
}

export async function getCameraTrapImageById(id) {
  const image = images.find((item) => item.id === id);
  if (!image) throw new Error("IMAGE_NOT_FOUND");
  return clone(image);
}

export async function saveClassification(
  imageId,
  { species, animalCount, behaviour = "", notes = "" }
) {
  const validation = validateClassification({ species, animalCount });

  if (!validation.isValid) {
    const error = new Error("INVALID_CLASSIFICATION");
    error.validationErrors = validation.errors;
    throw error;
  }

  const image = images.find((item) => item.id === imageId);
  if (!image) throw new Error("IMAGE_NOT_FOUND");

  image.species = species.trim();
  image.animalCount = Number(animalCount);
  image.behaviour = behaviour;
  image.notes = notes.trim();
  image.reviewStatus = image.flagged ? "FLAGGED" : "REVIEWED";

  return clone(image);
}

export async function markImageReviewed(imageId) {
  const image = images.find((item) => item.id === imageId);
  if (!image) throw new Error("IMAGE_NOT_FOUND");

  image.reviewStatus = image.flagged ? "FLAGGED" : "REVIEWED";
  return clone(image);
}

export async function flagImageAsSuspicious(
  imageId,
  { reason, description, severity, notifyEnforcement = true }
) {
  const validation = validateSuspiciousFlag({
    reason,
    description,
    severity,
  });

  if (!validation.isValid) {
    const error = new Error("INVALID_SUSPICIOUS_FLAG");
    error.validationErrors = validation.errors;
    throw error;
  }

  const image = images.find((item) => item.id === imageId);
  if (!image) throw new Error("IMAGE_NOT_FOUND");

  image.flagged = true;
  image.reviewStatus = "FLAGGED";
  image.suspiciousReason = reason.trim();
  image.suspiciousDescription = description.trim();
  image.severity = severity;
  image.investigationStatus = notifyEnforcement ? "PENDING" : null;

  return clone(image);
}

export async function getFlaggedImages() {
  return clone(images.filter((item) => item.flagged));
}

export async function updateInvestigationStatus(
  imageId,
  { status, assignedOfficer = "", notes = "" }
) {
  if (!validateInvestigationStatus(status)) {
    throw new Error("INVALID_INVESTIGATION_STATUS");
  }

  const image = images.find((item) => item.id === imageId);
  if (!image) throw new Error("IMAGE_NOT_FOUND");
  if (!image.flagged) throw new Error("IMAGE_NOT_FLAGGED");

  image.investigationStatus = status;
  image.assignedOfficer = assignedOfficer.trim() || null;
  image.investigationNotes = notes.trim();

  return clone(image);
}
