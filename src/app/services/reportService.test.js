import { supabase } from "../../../lib/supabase";
import { createCommunityConflictReport } from "./reportService";

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("createCommunityConflictReport", () => {
  let mockInsert;
  let mockSingle;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();

    const mockSelect = jest.fn(() => ({
      single: mockSingle,
    }));

    mockInsert = jest.fn(() => ({
      select: mockSelect,
    }));

    supabase.from.mockReturnValue({
      insert: mockInsert,
    });
  });

  test("UT-01: Successfully creates a report", async () => {
    const report = {
      report_id: "RPT-123",
      incident_type: "Elephant Sighting",
      status: "NEW",
    };

    mockSingle.mockResolvedValue({
      data: report,
      error: null,
    });

    const result = await createCommunityConflictReport({
      userId: "user-123",
      incidentType: "Elephant Sighting",
      description: "An elephant was seen near the village.",
      latitude: 7.2,
      longitude: 80.6,
      manualLocation: null,
    });

    expect(result).toEqual(report);
    expect(supabase.from).toHaveBeenCalledWith(
      "community_conflict_reports"
    );
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        user_id: "user-123",
        incident_type: "Elephant Sighting",
        status: "NEW",
        reporting_channel: "MOBILE_APP",
      }),
    ]);
  });

  test("UT-02: Uses null for optional missing fields", async () => {
    mockSingle.mockResolvedValue({
      data: { report_id: "RPT-456" },
      error: null,
    });

    await createCommunityConflictReport({
      userId: "user-123",
      incidentType: "Crop Damage",
      description: "",
      latitude: null,
      longitude: null,
      manualLocation: "",
    });

    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        description: null,
        latitude: null,
        longitude: null,
        manual_location: null,
      }),
    ]);
  });

  test("UT-03: Throws an error when saving fails", async () => {
    const saveError = new Error("Database error");

    mockSingle.mockResolvedValue({
      data: null,
      error: saveError,
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      createCommunityConflictReport({
        userId: "user-123",
        incidentType: "Elephant Sighting",
        description: "Elephant near the village.",
      })
    ).rejects.toThrow("Database error");

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
