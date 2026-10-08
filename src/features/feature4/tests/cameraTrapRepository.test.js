import {
  flagImageAsSuspicious,
  getCameraTrapImageById,
  getCameraTrapImages,
  getFlaggedImages,
  markImageReviewed,
  resetCameraTrapRepository,
  saveClassification,
  updateInvestigationStatus,
} from "../services/cameraTrapRepository";

beforeEach(() => {
  resetCameraTrapRepository();
});

test("loads images", async () => {
  const images = await getCameraTrapImages();
  expect(images.length).toBeGreaterThan(0);
});

test("gets image", async () => {
  expect((await getCameraTrapImageById("img-001")).cameraTrapId).toBe("CAM-007");
});

test("missing image errors", async () => {
  await expect(getCameraTrapImageById("missing")).rejects.toThrow("IMAGE_NOT_FOUND");
});

test("saves classification", async () => {
  const x = await saveClassification("img-001", {
    species: "Sri Lankan Elephant",
    animalCount: 4,
    behaviour: "Feeding",
    notes: "Healthy herd",
  });

  expect(x.species).toBe("Sri Lankan Elephant");
  expect(x.animalCount).toBe(4);
  expect(x.reviewStatus).toBe("REVIEWED");
});

test("invalid classification errors", async () => {
  await expect(
    saveClassification("img-001", {
      species: "",
      animalCount: 0,
    })
  ).rejects.toThrow("INVALID_CLASSIFICATION");
});

test("marks reviewed", async () => {
  expect((await markImageReviewed("img-001")).reviewStatus).toBe("REVIEWED");
});

test("flags suspicious image", async () => {
  const x = await flagImageAsSuspicious("img-002", {
    reason: "Human Presence",
    description: "Two unidentified people in a restricted forest area.",
    severity: "HIGH",
  });

  expect(x.flagged).toBe(true);
  expect(x.reviewStatus).toBe("FLAGGED");
  expect(x.investigationStatus).toBe("PENDING");
});

test("flagged image appears in queue", async () => {
  await flagImageAsSuspicious("img-002", {
    reason: "Human Presence",
    description: "Two unidentified people in a restricted forest area.",
    severity: "HIGH",
  });

  const flagged = await getFlaggedImages();
  expect(flagged.some((x) => x.id === "img-002")).toBe(true);
});

test("updates investigation", async () => {
  await flagImageAsSuspicious("img-002", {
    reason: "Human Presence",
    description: "Two unidentified people in a restricted forest area.",
    severity: "HIGH",
  });

  const x = await updateInvestigationStatus("img-002", {
    status: "UNDER_INVESTIGATION",
    assignedOfficer: "Officer Perera",
    notes: "Patrol dispatched.",
  });

  expect(x.investigationStatus).toBe("UNDER_INVESTIGATION");
  expect(x.assignedOfficer).toBe("Officer Perera");
});

test("unflagged image cannot be investigated", async () => {
  await expect(
    updateInvestigationStatus("img-001", {
      status: "UNDER_INVESTIGATION",
    })
  ).rejects.toThrow("IMAGE_NOT_FLAGGED");
});
