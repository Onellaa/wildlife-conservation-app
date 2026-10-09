export function validateClassification({ species, animalCount }) {
  const errors = {};

  if (!species || !species.trim()) {
    errors.species = "Species is required.";
  }

  const count = Number(animalCount);
  if (!Number.isInteger(count) || count < 1) {
    errors.animalCount = "Animal count must be a whole number greater than 0.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSuspiciousFlag({ reason, description, severity }) {
  const errors = {};

  if (!reason || !reason.trim()) {
    errors.reason = "Reason is required.";
  }

  if (!description || description.trim().length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  }

  if (!["LOW", "MEDIUM", "HIGH"].includes(severity)) {
    errors.severity = "Select a valid severity.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateInvestigationStatus(status) {
  return ["PENDING", "UNDER_INVESTIGATION", "RESOLVED"].includes(status);
}
