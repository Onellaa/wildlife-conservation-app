// src/constants/log-field-incident/incidentTypes.js
import { Search, Bone, Tent, PawPrint, Ellipsis } from "lucide-react-native";

/**
 * Single source of truth for incident types.
 * Adding a new type = adding one entry here. No component changes (OCP).
 *
 * Keys MUST match the `incident_type` enum in the Supabase schema.
 */
export const INCIDENT_TYPES = [
  {
    key: "snare",
    label: "Snare",
    shortLabel: "Snare removed",
    Icon: Search,
    color: "#EA7B2C",
    background: "#FFF7ED",
  },
  {
    key: "animal_carcass",
    label: "Animal Carcass",
    shortLabel: "Carcass found",
    Icon: Bone,
    color: "#78350F",
    background: "#FEF3C7",
  },
  {
    key: "illegal_campsite",
    label: "Illegal Campsite",
    shortLabel: "Campsite",
    Icon: Tent,
    color: "#B91C1C",
    background: "#FEE2E2",
  },
  {
    key: "at_risk_species_sighting",
    label: "At-Risk Species",
    shortLabel: "Species sighting",
    Icon: PawPrint,
    color: "#15803D",
    background: "#DCFCE7",
  },
  {
    key: "other",
    label: "Other",
    shortLabel: "Other",
    Icon: Ellipsis,
    color: "#475569",
    background: "#F1F5F9",
  },
];

/**
 * Lookup helper. Returns the type object or null if unknown.
 */
export function getIncidentType(key) {
  return INCIDENT_TYPES.find((t) => t.key === key) ?? null;
}
