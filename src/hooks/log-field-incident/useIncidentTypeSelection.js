// src/hooks/log-field-incident/useIncidentTypeSelection.js
import { useMemo, useState } from "react";
import { getIncidentType } from "../../constants/log-field-incident/incidentTypes";

export function useIncidentTypeSelection(initialKey = null) {
  const [selectedKey, setSelectedKey] = useState(initialKey);

  const selectedType = useMemo(
    () => getIncidentType(selectedKey),
    [selectedKey],
  );

  const canContinue = selectedType !== null;

  const continueLabel = "Next";

  return {
    selectedKey,
    selectedType,
    canContinue,
    continueLabel,
    select: setSelectedKey,
  };
}
