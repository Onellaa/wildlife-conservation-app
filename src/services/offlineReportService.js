import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { createCommunityConflictReport } from "./reportService";

const OFFLINE_REPORTS_KEY = "offline_community_conflict_reports";

// Save a report locally
export const saveReportOffline = async (report) => {
  try {
    const existingReports =
      await AsyncStorage.getItem(OFFLINE_REPORTS_KEY);

    const reports = existingReports
      ? JSON.parse(existingReports)
      : [];

    reports.push({
      ...report,
      savedAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem(
      OFFLINE_REPORTS_KEY,
      JSON.stringify(reports)
    );

    console.log("Report saved offline.");
  } catch (error) {
    console.error(
      "Error saving report offline:",
      error
    );

    throw error;
  }
};

// Get locally saved reports
export const getOfflineReports = async () => {
  try {
    const existingReports =
      await AsyncStorage.getItem(OFFLINE_REPORTS_KEY);

    return existingReports
      ? JSON.parse(existingReports)
      : [];
  } catch (error) {
    console.error(
      "Error getting offline reports:",
      error
    );

    return [];
  }
};

// Submit all saved reports when internet is available
export const submitOfflineReports = async () => {
  try {
    const networkState =
      await NetInfo.fetch();

    if (!networkState.isConnected) {
      console.log(
        "Still offline. Reports remain in local storage."
      );

      return;
    }

    const offlineReports =
      await getOfflineReports();

    if (offlineReports.length === 0) {
      return;
    }

    console.log(
      `Found ${offlineReports.length} offline report(s).`
    );

    const remainingReports = [];

    for (const report of offlineReports) {
      try {
        await createCommunityConflictReport({
          userId: report.userId,
          incidentType: report.incidentType,
          description: report.description,
          latitude: report.latitude,
          longitude: report.longitude,
          manualLocation: report.manualLocation,
        });

        console.log(
          "Offline report submitted successfully."
        );
      } catch (error) {
        console.error(
          "Failed to submit offline report:",
          error
        );

        remainingReports.push(report);
      }
    }

    await AsyncStorage.setItem(
      OFFLINE_REPORTS_KEY,
      JSON.stringify(remainingReports)
    );

    console.log(
      `${offlineReports.length - remainingReports.length} offline report(s) submitted.`
    );
  } catch (error) {
    console.error(
      "Error submitting offline reports:",
      error
    );
  }
};

// Listen for internet connection changes
export const startOfflineReportListener = () => {
  return NetInfo.addEventListener(
    (state) => {
      if (state.isConnected) {
        console.log(
          "Internet connection restored."
        );

        submitOfflineReports();
      }
    }
  );
};