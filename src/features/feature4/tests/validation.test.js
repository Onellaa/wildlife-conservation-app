import {
  validateClassification,
  validateSuspiciousFlag,
  validateInvestigationStatus,
} from "../utils/validation";

describe("validateClassification", () => {
  test("accepts valid classification", () => {
    expect(
      validateClassification({
        species: "Sri Lankan Elephant",
        animalCount: 4,
      }).isValid
    ).toBe(true);
  });

  test("rejects empty species", () => {
    expect(
      validateClassification({
        species: "",
        animalCount: 4,
      }).isValid
    ).toBe(false);
  });

  test("rejects zero count", () => {
    expect(
      validateClassification({
        species: "Sri Lankan Elephant",
        animalCount: 0,
      }).isValid
    ).toBe(false);
  });

  test("rejects negative count", () => {
    expect(
      validateClassification({
        species: "Sri Lankan Elephant",
        animalCount: -1,
      }).isValid
    ).toBe(false);
  });
});

describe("validateSuspiciousFlag", () => {
  test("accepts valid details", () => {
    expect(
      validateSuspiciousFlag({
        reason: "Human Presence",
        description: "Two people walking inside the restricted area.",
        severity: "HIGH",
      }).isValid
    ).toBe(true);
  });

  test("rejects invalid severity", () => {
    expect(
      validateSuspiciousFlag({
        reason: "Human Presence",
        description: "Two people walking inside the restricted area.",
        severity: "CRITICAL",
      }).isValid
    ).toBe(false);
  });
});

test("valid investigation statuses", () => {
  expect(validateInvestigationStatus("PENDING")).toBe(true);
  expect(validateInvestigationStatus("UNDER_INVESTIGATION")).toBe(true);
  expect(validateInvestigationStatus("RESOLVED")).toBe(true);
  expect(validateInvestigationStatus("CLOSED")).toBe(false);
});
