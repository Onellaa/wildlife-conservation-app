// import { supabase } from "../../../../lib/supabase";
// import {
//   validateClassification,
//   validateSuspiciousFlag,
//   validateInvestigationStatus,
// } from "../utils/validation";

// function mapImage(row) {
//   const alert = row.camera_trap_alerts?.[0] ?? null;

//   return {
//     id: row.id,
//     cameraTrapId: row.camera_trap_id,
//     imageUrl: row.image_url,
//     location: row.location,
//     latitude: row.latitude,
//     longitude: row.longitude,
//     timestamp: row.captured_at,
//     species: row.species,
//     animalCount: row.animal_count,
//     behaviour: row.behaviour,
//     notes: row.notes || "",
//     flagged: row.flagged,
//     reviewStatus: row.review_status,
//     suspiciousReason: alert?.reason ?? null,
//     suspiciousDescription: alert?.description ?? null,
//     severity: alert?.severity ?? null,
//     investigationStatus: alert?.investigation_status ?? null,
//     assignedOfficer: alert?.assigned_officer ?? null,
//     investigationNotes: alert?.investigation_notes ?? "",
//   };
// }

// const IMAGE_SELECT = `
//   *,
//   camera_trap_alerts (
//     id,
//     reason,
//     description,
//     severity,
//     investigation_status,
//     assigned_officer,
//     investigation_notes,
//     created_at
//   )
// `;

// export async function getCameraTrapImages(filter = "ALL") {
//   let query = supabase
//     .from("camera_trap_images")
//     .select(IMAGE_SELECT)
//     .order("captured_at", { ascending: false });

//   const normalized = String(filter || "ALL").toUpperCase();

//   if (normalized !== "ALL") {
//     query = query.eq("review_status", normalized);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error(error);
//     throw new Error("FAILED_TO_LOAD_IMAGES");
//   }

//   return (data || []).map(mapImage);
// }

// export async function getCameraTrapImageById(id) {
//   const { data, error } = await supabase
//     .from("camera_trap_images")
//     .select(IMAGE_SELECT)
//     .eq("id", id)
//     .single();

//   if (error) {
//     if (error.code === "PGRST116") throw new Error("IMAGE_NOT_FOUND");
//     console.error(error);
//     throw new Error("FAILED_TO_LOAD_IMAGE");
//   }

//   return mapImage(data);
// }

// export async function saveClassification(
//   imageId,
//   { species, animalCount, behaviour = "", notes = "" }
// ) {
//   const validation = validateClassification({ species, animalCount });

//   if (!validation.isValid) {
//     const error = new Error("INVALID_CLASSIFICATION");
//     error.validationErrors = validation.errors;
//     throw error;
//   }

//   const { data, error } = await supabase
//     .from("camera_trap_images")
//     .update({
//       species: species.trim(),
//       animal_count: Number(animalCount),
//       behaviour: behaviour || null,
//       notes: notes.trim(),
//       review_status: "REVIEWED",
//     })
//     .eq("id", imageId)
//     .select(IMAGE_SELECT)
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("FAILED_TO_SAVE_CLASSIFICATION");
//   }

//   return mapImage(data);
// }

// export async function markImageReviewed(imageId) {
//   const { data: image, error: loadError } = await supabase
//     .from("camera_trap_images")
//     .select("flagged")
//     .eq("id", imageId)
//     .single();

//   if (loadError) throw new Error("IMAGE_NOT_FOUND");

//   const { data, error } = await supabase
//     .from("camera_trap_images")
//     .update({
//       review_status: image.flagged ? "FLAGGED" : "REVIEWED",
//     })
//     .eq("id", imageId)
//     .select(IMAGE_SELECT)
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("FAILED_TO_MARK_REVIEWED");
//   }

//   return mapImage(data);
// }

// export async function flagImageAsSuspicious(
//   imageId,
//   { reason, description, severity, notifyEnforcement = true }
// ) {
//   const validation = validateSuspiciousFlag({
//     reason,
//     description,
//     severity,
//   });

//   if (!validation.isValid) {
//     const error = new Error("INVALID_SUSPICIOUS_FLAG");
//     error.validationErrors = validation.errors;
//     throw error;
//   }

//   const { error: imageError } = await supabase
//     .from("camera_trap_images")
//     .update({
//       flagged: true,
//       review_status: "FLAGGED",
//     })
//     .eq("id", imageId);

//   if (imageError) {
//     console.error(imageError);
//     throw new Error("FAILED_TO_FLAG_IMAGE");
//   }

//   const { error: alertError } = await supabase
//     .from("camera_trap_alerts")
//     .insert({
//       image_id: imageId,
//       reason: reason.trim(),
//       description: description.trim(),
//       severity,
//       investigation_status: notifyEnforcement ? "PENDING" : null,
//     });

//   if (alertError) {
//     console.error(alertError);
//     throw new Error("FAILED_TO_CREATE_ALERT");
//   }

//   return getCameraTrapImageById(imageId);
// }

// export async function getFlaggedImages() {
//   const { data, error } = await supabase
//     .from("camera_trap_images")
//     .select(IMAGE_SELECT)
//     .eq("flagged", true)
//     .order("captured_at", { ascending: false });

//   if (error) {
//     console.error(error);
//     throw new Error("FAILED_TO_LOAD_FLAGGED_IMAGES");
//   }

//   return (data || []).map(mapImage);
// }

// export async function updateInvestigationStatus(
//   imageId,
//   { status, assignedOfficer = "", notes = "" }
// ) {
//   if (!validateInvestigationStatus(status)) {
//     throw new Error("INVALID_INVESTIGATION_STATUS");
//   }

//   const { data: image, error: imageError } = await supabase
//     .from("camera_trap_images")
//     .select("id, flagged")
//     .eq("id", imageId)
//     .single();

//   if (imageError) throw new Error("IMAGE_NOT_FOUND");
//   if (!image.flagged) throw new Error("IMAGE_NOT_FLAGGED");

//   const { data: alert, error: alertError } = await supabase
//     .from("camera_trap_alerts")
//     .select("id")
//     .eq("image_id", imageId)
//     .order("created_at", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   if (alertError) throw new Error("FAILED_TO_LOAD_ALERT");
//   if (!alert) throw new Error("ALERT_NOT_FOUND");

//   const { error: updateError } = await supabase
//     .from("camera_trap_alerts")
//     .update({
//       investigation_status: status,
//       assigned_officer: assignedOfficer.trim() || null,
//       investigation_notes: notes.trim(),
//     })
//     .eq("id", alert.id);

//   if (updateError) {
//     console.error(updateError);
//     throw new Error("FAILED_TO_UPDATE_INVESTIGATION");
//   }

//   return getCameraTrapImageById(imageId);
// }



// export async function flagImageAsPoacherEvidence(
//   imageId,
//   { reason, description, severity }
// ) {
//   const validation = validateSuspiciousFlag({
//     reason,
//     description,
//     severity,
//   });

//   if (!validation.isValid) {
//     const error = new Error("INVALID_POACHER_EVIDENCE");
//     error.validationErrors = validation.errors;
//     throw error;
//   }

//   const { error: imageError } = await supabase
//     .from("camera_trap_images")
//     .update({
//       flagged: true,
//       review_status: "FLAGGED",
//       review_outcome: "POACHER_EVIDENCE",
//     })
//     .eq("id", imageId);

//   if (imageError) {
//     console.error("Failed to flag image:", imageError);
//     throw new Error("FAILED_TO_FLAG_IMAGE");
//   }

//   const { error: alertError } = await supabase
//     .from("camera_trap_alerts")
//     .insert({
//       image_id: imageId,
//       reason: reason.trim(),
//       description: description.trim(),
//       severity,
//       notification_recipient_role: "PARK_MANAGER",
//       acknowledged: false,
//       investigation_status: "PENDING",
//     });

//   if (alertError) {
//     console.error("Failed to create Park Manager alert:", alertError);
//     throw new Error("FAILED_TO_NOTIFY_PARK_MANAGER");
//   }

//   return getCameraTrapImageById(imageId);
// }

import { supabase } from "../../../../lib/supabase";
import {
  validateClassification,
  validateSuspiciousFlag,
  validateInvestigationStatus,
} from "../utils/validation";

/*
|--------------------------------------------------------------------------
| Convert Supabase row into the format used by the UI
|--------------------------------------------------------------------------
*/

function mapImage(row) {
  const alert = row.camera_trap_alerts?.[0] ?? null;

  return {
    id: row.id,
    cameraTrapId: row.camera_trap_id,
    imageUrl: row.image_url,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    timestamp: row.captured_at,

    species: row.species,
    animalCount: row.animal_count,
    behaviour: row.behaviour,
    notes: row.notes || "",

    flagged: row.flagged,
    reviewStatus: row.review_status,
    reviewOutcome: row.review_outcome ?? null,

    suspiciousReason: alert?.reason ?? null,
    suspiciousDescription: alert?.description ?? null,
    severity: alert?.severity ?? null,

    notificationRecipientRole:
      alert?.notification_recipient_role ?? null,

    acknowledged: alert?.acknowledged ?? false,
    acknowledgedAt: alert?.acknowledged_at ?? null,
    acknowledgedBy: alert?.acknowledged_by ?? null,

    investigationStatus:
      alert?.investigation_status ?? null,

    assignedOfficer:
      alert?.assigned_officer ?? null,

    investigationNotes:
      alert?.investigation_notes ?? "",
  };
}

/*
|--------------------------------------------------------------------------
| Supabase select
|--------------------------------------------------------------------------
*/

const IMAGE_SELECT = `
  *,
  camera_trap_alerts (
    id,
    reason,
    description,
    severity,
    notification_recipient_role,
    acknowledged,
    acknowledged_at,
    acknowledged_by,
    investigation_status,
    assigned_officer,
    investigation_notes,
    created_at
  )
`;

/*
|--------------------------------------------------------------------------
| Get all camera trap images
|--------------------------------------------------------------------------
*/

export async function getCameraTrapImages(filter = "ALL") {
  let query = supabase
    .from("camera_trap_images")
    .select(IMAGE_SELECT)
    .order("captured_at", {
      ascending: false,
    });

  const normalized = String(
    filter || "ALL"
  ).toUpperCase();

  if (normalized !== "ALL") {
    query = query.eq(
      "review_status",
      normalized
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to load camera trap images:",
      error
    );

    throw new Error(
      "FAILED_TO_LOAD_IMAGES"
    );
  }

  return (data || []).map(mapImage);
}

/*
|--------------------------------------------------------------------------
| Get one camera trap image
|--------------------------------------------------------------------------
*/

export async function getCameraTrapImageById(
  id
) {
  const { data, error } = await supabase
    .from("camera_trap_images")
    .select(IMAGE_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        "IMAGE_NOT_FOUND"
      );
    }

    console.error(
      "Failed to load camera trap image:",
      error
    );

    throw new Error(
      "FAILED_TO_LOAD_IMAGE"
    );
  }

  return mapImage(data);
}

/*
|--------------------------------------------------------------------------
| Species classification
|--------------------------------------------------------------------------
|
| UC-03 outcome:
| Species identified
| → REVIEWED
| → SPECIES_IDENTIFIED
|
*/

export async function saveClassification(
  imageId,
  {
    species,
    animalCount,
    behaviour = "",
    notes = "",
  }
) {
  const validation =
    validateClassification({
      species,
      animalCount,
    });

  if (!validation.isValid) {
    const error = new Error(
      "INVALID_CLASSIFICATION"
    );

    error.validationErrors =
      validation.errors;

    throw error;
  }

  const { data, error } = await supabase
    .from("camera_trap_images")
    .update({
      species: species.trim(),
      animal_count:
        Number(animalCount),
      behaviour:
        behaviour.trim() || null,
      notes: notes.trim(),

      review_status: "REVIEWED",
      review_outcome:
        "SPECIES_IDENTIFIED",

      flagged: false,
    })
    .eq("id", imageId)
    .select(IMAGE_SELECT)
    .single();

  if (error) {
    console.error(
      "Failed to save classification:",
      error
    );

    throw new Error(
      "FAILED_TO_SAVE_CLASSIFICATION"
    );
  }

  return mapImage(data);
}

/*
|--------------------------------------------------------------------------
| Mark image reviewed
|--------------------------------------------------------------------------
*/

export async function markImageReviewed(
  imageId
) {
  const {
    data: image,
    error: loadError,
  } = await supabase
    .from("camera_trap_images")
    .select("flagged")
    .eq("id", imageId)
    .single();

  if (loadError) {
    throw new Error(
      "IMAGE_NOT_FOUND"
    );
  }

  const nextStatus = image.flagged
    ? "FLAGGED"
    : "REVIEWED";

  const { data, error } = await supabase
    .from("camera_trap_images")
    .update({
      review_status: nextStatus,
    })
    .eq("id", imageId)
    .select(IMAGE_SELECT)
    .single();

  if (error) {
    console.error(
      "Failed to mark image reviewed:",
      error
    );

    throw new Error(
      "FAILED_TO_MARK_REVIEWED"
    );
  }

  return mapImage(data);
}

/*
|--------------------------------------------------------------------------
| Mark image inconclusive
|--------------------------------------------------------------------------
|
| UC-03 outcome:
| Cannot identify image
| → INCONCLUSIVE
|
*/

export async function markImageInconclusive(
  imageId
) {
  const { data, error } = await supabase
    .from("camera_trap_images")
    .update({
      species: null,
      animal_count: null,
      behaviour: null,

      flagged: false,

      review_status:
        "INCONCLUSIVE",

      review_outcome:
        "INCONCLUSIVE",
    })
    .eq("id", imageId)
    .select(IMAGE_SELECT)
    .single();

  if (error) {
    console.error(
      "Failed to mark image inconclusive:",
      error
    );

    throw new Error(
      "FAILED_TO_MARK_INCONCLUSIVE"
    );
  }

  return mapImage(data);
}

/*
|--------------------------------------------------------------------------
| Flag as POACHER EVIDENCE
|--------------------------------------------------------------------------
|
| UC-03 outcome:
| Poacher evidence
| → FLAGGED
| → POACHER_EVIDENCE
| → Notify PARK_MANAGER
|
*/

export async function flagImageAsPoacherEvidence(
  imageId,
  {
    reason,
    description,
    severity,
  }
) {
  const validation =
    validateSuspiciousFlag({
      reason,
      description,
      severity,
    });

  if (!validation.isValid) {
    const error = new Error(
      "INVALID_POACHER_EVIDENCE"
    );

    error.validationErrors =
      validation.errors;

    throw error;
  }

  /*
  ------------------------------------------------------------
  First update the camera image
  ------------------------------------------------------------
  */

  const { error: imageError } =
    await supabase
      .from("camera_trap_images")
      .update({
        flagged: true,

        review_status:
          "FLAGGED",

        review_outcome:
          "POACHER_EVIDENCE",
      })
      .eq("id", imageId);

  if (imageError) {
    console.error(
      "Failed to flag image:",
      imageError
    );

    throw new Error(
      "FAILED_TO_FLAG_IMAGE"
    );
  }

  /*
  ------------------------------------------------------------
  Create Park Manager notification
  ------------------------------------------------------------
  */

  const { error: alertError } =
    await supabase
      .from("camera_trap_alerts")
      .insert({
        image_id: imageId,

        reason:
          reason.trim(),

        description:
          description.trim(),

        severity,

        notification_recipient_role:
          "PARK_MANAGER",

        acknowledged: false,

        investigation_status:
          "PENDING",
      });

  if (alertError) {
    console.error(
      "Failed to notify Park Manager:",
      alertError
    );

    throw new Error(
      "FAILED_TO_NOTIFY_PARK_MANAGER"
    );
  }

  return getCameraTrapImageById(
    imageId
  );
}

/*
|--------------------------------------------------------------------------
| Older suspicious flag function
|--------------------------------------------------------------------------
|
| Kept because some of your existing screens may still call:
| flagImageAsSuspicious()
|
*/

export async function flagImageAsSuspicious(
  imageId,
  {
    reason,
    description,
    severity,
    notifyEnforcement = true,
  }
) {
  const validation =
    validateSuspiciousFlag({
      reason,
      description,
      severity,
    });

  if (!validation.isValid) {
    const error = new Error(
      "INVALID_SUSPICIOUS_FLAG"
    );

    error.validationErrors =
      validation.errors;

    throw error;
  }

  const { error: imageError } =
    await supabase
      .from("camera_trap_images")
      .update({
        flagged: true,
        review_status: "FLAGGED",
      })
      .eq("id", imageId);

  if (imageError) {
    console.error(
      "Failed to flag image:",
      imageError
    );

    throw new Error(
      "FAILED_TO_FLAG_IMAGE"
    );
  }

  const { error: alertError } =
    await supabase
      .from("camera_trap_alerts")
      .insert({
        image_id: imageId,

        reason:
          reason.trim(),

        description:
          description.trim(),

        severity,

        investigation_status:
          notifyEnforcement
            ? "PENDING"
            : null,
      });

  if (alertError) {
    console.error(
      "Failed to create alert:",
      alertError
    );

    throw new Error(
      "FAILED_TO_CREATE_ALERT"
    );
  }

  return getCameraTrapImageById(
    imageId
  );
}

/*
|--------------------------------------------------------------------------
| Get all flagged images
|--------------------------------------------------------------------------
*/

export async function getFlaggedImages() {
  const { data, error } = await supabase
    .from("camera_trap_images")
    .select(IMAGE_SELECT)
    .eq("flagged", true)
    .order("captured_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load flagged images:",
      error
    );

    throw new Error(
      "FAILED_TO_LOAD_FLAGGED_IMAGES"
    );
  }

  return (data || []).map(mapImage);
}

/*
|--------------------------------------------------------------------------
| Park Manager acknowledges poacher alert
|--------------------------------------------------------------------------
|
| UC-03:
| Park Manager receives notification
| → acknowledges it
|
*/

export async function acknowledgePoacherAlert(
  imageId,
  {
    acknowledgedBy =
      "Park Manager",
  } = {}
) {
  /*
  ------------------------------------------------------------
  Find the latest Park Manager alert
  ------------------------------------------------------------
  */

  const {
    data: alert,
    error: loadError,
  } = await supabase
    .from("camera_trap_alerts")
    .select("id")
    .eq("image_id", imageId)
    .eq(
      "notification_recipient_role",
      "PARK_MANAGER"
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (loadError) {
    console.error(
      "Failed to load Park Manager alert:",
      loadError
    );

    throw new Error(
      "FAILED_TO_LOAD_ALERT"
    );
  }

  if (!alert) {
    throw new Error(
      "ALERT_NOT_FOUND"
    );
  }

  /*
  ------------------------------------------------------------
  Acknowledge notification
  ------------------------------------------------------------
  */

  const { error: updateError } =
    await supabase
      .from("camera_trap_alerts")
      .update({
        acknowledged: true,

        acknowledged_at:
          new Date().toISOString(),

        acknowledged_by:
          acknowledgedBy,
      })
      .eq("id", alert.id);

  if (updateError) {
    console.error(
      "Failed to acknowledge alert:",
      updateError
    );

    throw new Error(
      "FAILED_TO_ACKNOWLEDGE_ALERT"
    );
  }

  return getCameraTrapImageById(
    imageId
  );
}

/*
|--------------------------------------------------------------------------
| Investigation enhancement
|--------------------------------------------------------------------------
|
| This is an Assignment 2 improvement.
|
| PENDING
| → UNDER_INVESTIGATION
| → RESOLVED
|
*/

export async function updateInvestigationStatus(
  imageId,
  {
    status,
    assignedOfficer = "",
    notes = "",
  }
) {
  /*
  ------------------------------------------------------------
  Validate status
  ------------------------------------------------------------
  */

  if (
    !validateInvestigationStatus(
      status
    )
  ) {
    throw new Error(
      "INVALID_INVESTIGATION_STATUS"
    );
  }

  /*
  ------------------------------------------------------------
  Check image is flagged
  ------------------------------------------------------------
  */

  const {
    data: image,
    error: imageError,
  } = await supabase
    .from("camera_trap_images")
    .select("id, flagged")
    .eq("id", imageId)
    .single();

  if (imageError) {
    throw new Error(
      "IMAGE_NOT_FOUND"
    );
  }

  if (!image.flagged) {
    throw new Error(
      "IMAGE_NOT_FLAGGED"
    );
  }

  /*
  ------------------------------------------------------------
  Find latest alert
  ------------------------------------------------------------
  */

  const {
    data: alert,
    error: alertError,
  } = await supabase
    .from("camera_trap_alerts")
    .select("id")
    .eq("image_id", imageId)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (alertError) {
    throw new Error(
      "FAILED_TO_LOAD_ALERT"
    );
  }

  if (!alert) {
    throw new Error(
      "ALERT_NOT_FOUND"
    );
  }

  /*
  ------------------------------------------------------------
  Update investigation
  ------------------------------------------------------------
  */

  const { error: updateError } =
    await supabase
      .from("camera_trap_alerts")
      .update({
        investigation_status:
          status,

        assigned_officer:
          assignedOfficer.trim() ||
          null,

        investigation_notes:
          notes.trim(),
      })
      .eq("id", alert.id);

  if (updateError) {
    console.error(
      "Failed to update investigation:",
      updateError
    );

    throw new Error(
      "FAILED_TO_UPDATE_INVESTIGATION"
    );
  }

  return getCameraTrapImageById(
    imageId
  );
}