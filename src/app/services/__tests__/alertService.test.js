jest.mock("../../../../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from "../../../../lib/supabase";

import {
  getActiveAlerts,
  getAlertById,
  acknowledgeAlert,
  saveAlertResponse,
  getAlertResponses,
  resolveAlert,
} from "../alertService";

describe("alertService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getActiveAlerts returns active alerts", async () => {
    const mockAlerts = [
      {
        id: "alert-1",
        status: "NEW",
        risk_level: "HIGH",
      },
      {
        id: "alert-2",
        status: "MONITORING",
        risk_level: "HIGH",
      },
    ];

    const order = jest.fn().mockResolvedValue({
      data: mockAlerts,
      error: null,
    });

    const inMock = jest.fn(() => ({
      order,
    }));

    const select = jest.fn(() => ({
      in: inMock,
    }));

    supabase.from.mockReturnValue({
      select,
    });

    const result = await getActiveAlerts();

    expect(result).toEqual(mockAlerts);

    expect(supabase.from).toHaveBeenCalledWith(
      "alerts"
    );
  });
});

test("getActiveAlerts throws error when Supabase fails", async () => {
  const mockError = new Error(
    "Database connection failed"
  );

  const order = jest.fn().mockResolvedValue({
    data: null,
    error: mockError,
  });

  const inMock = jest.fn(() => ({
    order,
  }));

  const select = jest.fn(() => ({
    in: inMock,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  await expect(
    getActiveAlerts()
  ).rejects.toThrow(
    "Database connection failed"
  );
});

test("acknowledgeAlert updates alert status to ACKNOWLEDGED", async () => {
  const updatedAlert = {
    id: "alert-1",
    status: "ACKNOWLEDGED",
  };

  const single = jest.fn().mockResolvedValue({
    data: updatedAlert,
    error: null,
  });

  const select = jest.fn(() => ({
    single,
  }));

  const eq = jest.fn(() => ({
    select,
  }));

  const update = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    update,
  });

  const result =
    await acknowledgeAlert("alert-1");

  expect(result.status).toBe(
    "ACKNOWLEDGED"
  );

  expect(update).toHaveBeenCalledWith(
    expect.objectContaining({
      status: "ACKNOWLEDGED",
    })
  );
});

test("acknowledgeAlert throws when database update fails", async () => {
  const single = jest.fn().mockResolvedValue({
    data: null,
    error: new Error("Update failed"),
  });

  const select = jest.fn(() => ({
    single,
  }));

  const eq = jest.fn(() => ({
    select,
  }));

  const update = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    update,
  });

  await expect(
    acknowledgeAlert("alert-1")
  ).rejects.toThrow("Update failed");
});
test("getAlertById returns the selected alert", async () => {
  const mockAlert = {
    id: "alert-1",
    status: "NEW",
    animals: {
      animal_code: "E-017",
      name: "Raja",
    },
  };

  const single = jest.fn().mockResolvedValue({
    data: mockAlert,
    error: null,
  });

  const eq = jest.fn(() => ({
    single,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  const result =
    await getAlertById("alert-1");

  expect(result).toEqual(mockAlert);

  expect(supabase.from).toHaveBeenCalledWith(
    "alerts"
  );
});

test("getAlertById throws error when alert cannot be loaded", async () => {
  const single = jest.fn().mockResolvedValue({
    data: null,
    error: new Error("Alert not found"),
  });

  const eq = jest.fn(() => ({
    single,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  await expect(
    getAlertById("wrong-id")
  ).rejects.toThrow("Alert not found");
});

test("getAlertResponses returns response history", async () => {
  const mockResponses = [
    {
      id: "response-1",
      response_type: "MONITOR",
      status: "MONITORING",
    },
    {
      id: "response-2",
      response_type: "RESOLVE",
      status: "RESOLVED",
    },
  ];

  const order = jest.fn().mockResolvedValue({
    data: mockResponses,
    error: null,
  });

  const eq = jest.fn(() => ({
    order,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  const result =
    await getAlertResponses("alert-1");

  expect(result).toEqual(mockResponses);
});

test("getAlertResponses throws when database request fails", async () => {
  const order = jest.fn().mockResolvedValue({
    data: null,
    error: new Error(
      "Unable to load responses"
    ),
  });

  const eq = jest.fn(() => ({
    order,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  await expect(
    getAlertResponses("alert-1")
  ).rejects.toThrow(
    "Unable to load responses"
  );
});
test("saveAlertResponse saves response and updates alert status", async () => {
  const mockResponse = {
    id: "response-1",
    alert_id: "alert-1",
    response_type: "MONITOR",
    status: "MONITORING",
    notes: "Animal moving away",
  };

  const mockAlert = {
    id: "alert-1",
    status: "MONITORING",
  };

  const responseSingle =
    jest.fn().mockResolvedValue({
      data: mockResponse,
      error: null,
    });

  const responseSelect = jest.fn(() => ({
    single: responseSingle,
  }));

  const insert = jest.fn(() => ({
    select: responseSelect,
  }));

  const alertSingle =
    jest.fn().mockResolvedValue({
      data: mockAlert,
      error: null,
    });

  const alertSelect = jest.fn(() => ({
    single: alertSingle,
  }));

  const eq = jest.fn(() => ({
    select: alertSelect,
  }));

  const update = jest.fn(() => ({
    eq,
  }));

  supabase.from
    .mockReturnValueOnce({
      insert,
    })
    .mockReturnValueOnce({
      update,
    });

  const result =
    await saveAlertResponse({
      alertId: "alert-1",
      responseType: "MONITOR",
      status: "MONITORING",
      notes: "Animal moving away",
    });

  expect(result.response).toEqual(
    mockResponse
  );

  expect(result.alert).toEqual(mockAlert);

  expect(insert).toHaveBeenCalledWith({
    alert_id: "alert-1",
    response_type: "MONITOR",
    status: "MONITORING",
    notes: "Animal moving away",
  });

  expect(update).toHaveBeenCalledWith({
    status: "MONITORING",
  });
});

test("saveAlertResponse throws when response insert fails", async () => {
  const insert = jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: new Error(
          "Response insert failed"
        ),
      }),
    })),
  }));

  supabase.from.mockReturnValue({
    insert,
  });

  await expect(
    saveAlertResponse({
      alertId: "alert-1",
      responseType: "MONITOR",
      status: "MONITORING",
      notes: "Test note",
    })
  ).rejects.toThrow(
    "Response insert failed"
  );
});

test("saveAlertResponse throws when alert status update fails", async () => {
  const responseInsert = jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({
        data: {
          id: "response-1",
        },
        error: null,
      }),
    })),
  }));

  const update = jest.fn(() => ({
    eq: jest.fn(() => ({
      select: jest.fn(() => ({
        single:
          jest.fn().mockResolvedValue({
            data: null,
            error: new Error(
              "Status update failed"
            ),
          }),
      })),
    })),
  }));

  supabase.from
    .mockReturnValueOnce({
      insert: responseInsert,
    })
    .mockReturnValueOnce({
      update,
    });

  await expect(
    saveAlertResponse({
      alertId: "alert-1",
      responseType: "INTERVENE",
      status: "RESPONDING",
      notes: "Proceeding to field",
    })
  ).rejects.toThrow(
    "Status update failed"
  );
});

test("resolveAlert successfully resolves an alert", async () => {
  const currentAlert = {
    id: "alert-1",
    status: "MONITORING",
  };

  const existingResponses = [
    {
      id: "response-1",
    },
  ];

  const resolutionResponse = {
    id: "response-2",
    alert_id: "alert-1",
    response_type: "RESOLVE",
    status: "RESOLVED",
    notes: "Animal returned safely to forest.",
  };

  const resolvedAlert = {
    id: "alert-1",
    status: "RESOLVED",
  };

  // 1. Load current alert
  const currentAlertSingle =
    jest.fn().mockResolvedValue({
      data: currentAlert,
      error: null,
    });

  const currentAlertEq = jest.fn(() => ({
    single: currentAlertSingle,
  }));

  const currentAlertSelect = jest.fn(() => ({
    eq: currentAlertEq,
  }));

  // 2. Check existing responses
  const responseLimit =
    jest.fn().mockResolvedValue({
      data: existingResponses,
      error: null,
    });

  const responseNeq = jest.fn(() => ({
    limit: responseLimit,
  }));

  const responseEq = jest.fn(() => ({
    neq: responseNeq,
  }));

  const responseCheckSelect = jest.fn(() => ({
    eq: responseEq,
  }));

  // 3. Insert resolution response
  const resolutionSingle =
    jest.fn().mockResolvedValue({
      data: resolutionResponse,
      error: null,
    });

  const resolutionSelect = jest.fn(() => ({
    single: resolutionSingle,
  }));

  const resolutionInsert = jest.fn(() => ({
    select: resolutionSelect,
  }));

  // 4. Update alert to RESOLVED
  const resolvedSingle =
    jest.fn().mockResolvedValue({
      data: resolvedAlert,
      error: null,
    });

  const resolvedSelect = jest.fn(() => ({
    single: resolvedSingle,
  }));

  const resolvedEq = jest.fn(() => ({
    select: resolvedSelect,
  }));

  const resolvedUpdate = jest.fn(() => ({
    eq: resolvedEq,
  }));

  supabase.from
    .mockReturnValueOnce({
      select: currentAlertSelect,
    })
    .mockReturnValueOnce({
      select: responseCheckSelect,
    })
    .mockReturnValueOnce({
      insert: resolutionInsert,
    })
    .mockReturnValueOnce({
      update: resolvedUpdate,
    });

  const result = await resolveAlert(
    "alert-1",
    "Animal returned safely to forest."
  );

  expect(result.response).toEqual(
    resolutionResponse
  );

  expect(result.alert).toEqual(
    resolvedAlert
  );

  expect(resolutionInsert).toHaveBeenCalledWith({
    alert_id: "alert-1",
    response_type: "RESOLVE",
    status: "RESOLVED",
    notes: "Animal returned safely to forest.",
  });

  expect(resolvedUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      status: "RESOLVED",
    })
  );
});

test("resolveAlert throws if alert is already resolved", async () => {
  const single = jest.fn().mockResolvedValue({
    data: {
      id: "alert-1",
      status: "RESOLVED",
    },
    error: null,
  });

  const eq = jest.fn(() => ({
    single,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  await expect(
    resolveAlert(
      "alert-1",
      "Trying to resolve again"
    )
  ).rejects.toThrow(
    "This alert is already resolved."
  );
});

test("resolveAlert throws if current alert cannot be loaded", async () => {
  const single = jest.fn().mockResolvedValue({
    data: null,
    error: new Error(
      "Unable to load alert"
    ),
  });

  const eq = jest.fn(() => ({
    single,
  }));

  const select = jest.fn(() => ({
    eq,
  }));

  supabase.from.mockReturnValue({
    select,
  });

  await expect(
    resolveAlert(
      "alert-1",
      "Final note"
    )
  ).rejects.toThrow(
    "Unable to load alert"
  );
});

test("resolveAlert throws when no previous response exists", async () => {
  const currentAlertSingle =
    jest.fn().mockResolvedValue({
      data: {
        id: "alert-1",
        status: "ACKNOWLEDGED",
      },
      error: null,
    });

  const currentAlertEq = jest.fn(() => ({
    single: currentAlertSingle,
  }));

  const currentAlertSelect = jest.fn(() => ({
    eq: currentAlertEq,
  }));

  const limit = jest.fn().mockResolvedValue({
    data: [],
    error: null,
  });

  const neq = jest.fn(() => ({
    limit,
  }));

  const responseEq = jest.fn(() => ({
    neq,
  }));

  const responseSelect = jest.fn(() => ({
    eq: responseEq,
  }));

  supabase.from
    .mockReturnValueOnce({
      select: currentAlertSelect,
    })
    .mockReturnValueOnce({
      select: responseSelect,
    });

  await expect(
    resolveAlert(
      "alert-1",
      "Final note"
    )
  ).rejects.toThrow(
    "At least one response must be recorded before resolving the alert."
  );
});

test("resolveAlert throws when checking existing responses fails", async () => {
  const currentAlertSingle =
    jest.fn().mockResolvedValue({
      data: {
        id: "alert-1",
        status: "MONITORING",
      },
      error: null,
    });

  const currentAlertEq = jest.fn(() => ({
    single: currentAlertSingle,
  }));

  const currentAlertSelect = jest.fn(() => ({
    eq: currentAlertEq,
  }));

  const limit = jest.fn().mockResolvedValue({
    data: null,
    error: new Error(
      "Response check failed"
    ),
  });

  const neq = jest.fn(() => ({
    limit,
  }));

  const responseEq = jest.fn(() => ({
    neq,
  }));

  const responseSelect = jest.fn(() => ({
    eq: responseEq,
  }));

  supabase.from
    .mockReturnValueOnce({
      select: currentAlertSelect,
    })
    .mockReturnValueOnce({
      select: responseSelect,
    });

  await expect(
    resolveAlert(
      "alert-1",
      "Final note"
    )
  ).rejects.toThrow(
    "Response check failed"
  );
});

test("resolveAlert throws when resolution response insert fails", async () => {
  const currentAlertSingle =
    jest.fn().mockResolvedValue({
      data: {
        id: "alert-1",
        status: "MONITORING",
      },
      error: null,
    });

  const currentAlertEq = jest.fn(() => ({
    single: currentAlertSingle,
  }));

  const currentAlertSelect = jest.fn(() => ({
    eq: currentAlertEq,
  }));

  const limit = jest.fn().mockResolvedValue({
    data: [{ id: "response-1" }],
    error: null,
  });

  const neq = jest.fn(() => ({
    limit,
  }));

  const responseEq = jest.fn(() => ({
    neq,
  }));

  const responseSelect = jest.fn(() => ({
    eq: responseEq,
  }));

  const insert = jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: new Error(
          "Resolution insert failed"
        ),
      }),
    })),
  }));

  supabase.from
    .mockReturnValueOnce({
      select: currentAlertSelect,
    })
    .mockReturnValueOnce({
      select: responseSelect,
    })
    .mockReturnValueOnce({
      insert,
    });

  await expect(
    resolveAlert(
      "alert-1",
      "Final note"
    )
  ).rejects.toThrow(
    "Resolution insert failed"
  );
});

test("resolveAlert throws when final alert update fails", async () => {
  const currentAlertSingle =
    jest.fn().mockResolvedValue({
      data: {
        id: "alert-1",
        status: "RESPONDING",
      },
      error: null,
    });

  const currentAlertEq = jest.fn(() => ({
    single: currentAlertSingle,
  }));

  const currentAlertSelect = jest.fn(() => ({
    eq: currentAlertEq,
  }));

  const limit = jest.fn().mockResolvedValue({
    data: [{ id: "response-1" }],
    error: null,
  });

  const neq = jest.fn(() => ({
    limit,
  }));

  const responseEq = jest.fn(() => ({
    neq,
  }));

  const responseSelect = jest.fn(() => ({
    eq: responseEq,
  }));

  const insert = jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn().mockResolvedValue({
        data: {
          id: "resolution-1",
        },
        error: null,
      }),
    })),
  }));

  const update = jest.fn(() => ({
    eq: jest.fn(() => ({
      select: jest.fn(() => ({
        single:
          jest.fn().mockResolvedValue({
            data: null,
            error: new Error(
              "Final update failed"
            ),
          }),
      })),
    })),
  }));

  supabase.from
    .mockReturnValueOnce({
      select: currentAlertSelect,
    })
    .mockReturnValueOnce({
      select: responseSelect,
    })
    .mockReturnValueOnce({
      insert,
    })
    .mockReturnValueOnce({
      update,
    });

  await expect(
    resolveAlert(
      "alert-1",
      "Final note"
    )
  ).rejects.toThrow(
    "Final update failed"
  );
});

