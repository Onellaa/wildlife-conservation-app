import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ChooseResponseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [selectedResponse, setSelectedResponse] = useState(null);

  const responseOptions = [
    {
      id: "INTERVENE",
      title: "Immediate Intervention",
      description:
        "Proceed to the affected area and actively respond to the situation.",
      icon: "navigate",
      color: "#C0392B",
      background: "#FDEDEC",
    },

    {
      id: "MONITOR",
      title: "Monitor Animal",
      description:
        "Continue observing the animal and monitor changes in its movement.",
      icon: "eye",
      color: "#176B4D",
      background: "#E8F5EE",
    },

    {
      id: "COORDINATE",
      title: "Coordinate Response",
      description:
        "Request additional assistance from field staff or community officers.",
      icon: "people",
      color: "#6C4AA0",
      background: "#F0EAF8",
    },
  ];

  const handleContinue = () => {
    if (!selectedResponse) {
      return;
    }

    router.push({
      pathname: "/alerts/action",
      params: {
        id,
        action: selectedResponse,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Choose Response</Text>

          <Text style={styles.headerSubtitle}>Alert {id}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* INFORMATION */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="alert-circle-outline" size={25} color="#176B4D" />
          </View>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              Select the most appropriate action
            </Text>

            <Text style={styles.infoText}>
              Choose a response based on the animal's current location and the
              level of risk.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Response Options</Text>

        {responseOptions.map((option) => {
          const selected = selectedResponse === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.8}
              style={[styles.optionCard, selected && styles.selectedCard]}
              onPress={() => setSelectedResponse(option.id)}
            >
              <View
                style={[
                  styles.optionIcon,
                  {
                    backgroundColor: option.background,
                  },
                ]}
              >
                <Ionicons name={option.icon} size={27} color={option.color} />
              </View>

              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>

                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  selected && styles.radioOuterSelected,
                ]}
              >
                {selected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* SAFETY NOTE */}
        <View style={styles.warningBox}>
          <Ionicons
            name="information-circle-outline"
            size={23}
            color="#8A6600"
          />

          <Text style={styles.warningText}>
            Keep the alert active if the situation still requires monitoring or
            additional intervention.
          </Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={selectedResponse ? 0.8 : 1}
          disabled={!selectedResponse}
          style={[
            styles.continueButton,
            !selectedResponse && styles.disabledButton,
          ]}
          onPress={handleContinue}
        >
          <Text
            style={[
              styles.continueText,
              !selectedResponse && styles.disabledText,
            ]}
          >
            CONTINUE
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color={selectedResponse ? "#FFFFFF" : "#999999"}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F5",
  },

  header: {
    backgroundColor: "#176B4D",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#CFE6DC",
    fontSize: 12,
    marginTop: 2,
  },

  content: {
    padding: 18,
    paddingBottom: 45,
  },

  infoCard: {
    backgroundColor: "#E9F5EF",
    borderRadius: 17,
    padding: 16,
    flexDirection: "row",
    marginBottom: 25,
  },

  infoIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#D5EADF",
    justifyContent: "center",
    alignItems: "center",
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    color: "#174E39",
    fontSize: 15,
    fontWeight: "800",
  },

  infoText: {
    color: "#60736A",
    lineHeight: 18,
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1E2D27",
    marginBottom: 13,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1.5,
    borderColor: "#ECEFEC",
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  selectedCard: {
    borderColor: "#176B4D",
    backgroundColor: "#FBFEFC",
  },

  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#24332D",
  },

  optionDescription: {
    color: "#737E79",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  radioOuter: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C4CAC7",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#176B4D",
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#176B4D",
  },

  warningBox: {
    backgroundColor: "#FFF8DD",
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    marginTop: 8,
  },

  warningText: {
    flex: 1,
    color: "#75601C",
    marginLeft: 10,
    lineHeight: 18,
    fontSize: 12,
  },

  continueButton: {
    marginTop: 25,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#176B4D",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#E2E4E3",
  },

  continueText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
    marginRight: 8,
  },

  disabledText: {
    color: "#999999",
  },
});
