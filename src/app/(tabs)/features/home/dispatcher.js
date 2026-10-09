// src/app/(tabs)/features/home/dispatcher.js
// OCP: adding a role = adding one line below. Nothing else changes.

import { useAuth } from "../../../../context/AuthContext";
import RangerHome from "../log-field-incident/ActivePatrolScreen";
import DefaultHome from "./DefaultHome";

// ⭐ Friends: import your home screen, then add a mapping line below.
// Example:
// import LiaisonHome from "../alerts/AlertsListScreen";
// import AnalystHome from "../camera-trap/CameraReviewScreen";

const HOME_BY_ROLE = {
  ranger: RangerHome,
  // liaison_officer: LiaisonHome,     ← friend 1 (UC-02)
  // analyst: AnalystHome,             ← friend 2 (UC-03)
  // park_manager: ManagerDashboard,   ← optional
};

export default function HomeDispatcher() {
  const { profile } = useAuth();
  const Component = HOME_BY_ROLE[profile?.role] ?? DefaultHome;
  return <Component />;
}
