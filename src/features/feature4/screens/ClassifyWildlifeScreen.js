import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import PrimaryButton from "../components/PrimaryButton";
import { feature4Theme as t } from "../theme";

import {
  getCameraTrapImageById,
  saveClassification,
} from "../services/cameraTrapRepository";

const speciesOptions = [
  "Sri Lankan Elephant",
  "Sri Lankan Leopard",
  "Spotted Deer",
  "Wild Boar",
  "Peacock",
  "Other",
];

const behaviourOptions = [
  "Feeding",
  "Walking",
  "Resting",
  "Running",
  "Unknown",
];

function Chips({ value, options, onChange }) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = value === option;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              active && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                active && styles.chipTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ClassifyWildlifeScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);

  const [species, setSpecies] = useState("");
  const [count, setCount] = useState(1);
  const [behaviour, setBehaviour] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getCameraTrapImageById(String(imageId)).then((data) => {
      setImage(data);

      setSpecies(data.species || "");
      setCount(data.animalCount || 1);
      setBehaviour(data.behaviour || "");
      setNotes(data.notes || "");
    });
  }, [imageId]);

  const save = async () => {
    try {
      await saveClassification(String(imageId), {
        species,
        animalCount: count,
        behaviour,
        notes,
      });

      Alert.alert(
        "Classification saved",
        "The image has been marked as reviewed."
      );

      router.replace("/(tabs)/camera-trap");
    } catch (error) {
      const message =
        error.validationErrors?.species ||
        error.validationErrors?.animalCount ||
        "Unable to save classification.";

      Alert.alert("Check details", message);
    }
  };

  if (!image) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={{ uri: image.imageUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.kicker}>
              SPECIES CLASSIFICATION
            </Text>

            <Text style={styles.heroTitle}>
              {image.cameraTrapId}
            </Text>

            <Text style={styles.heroLocation}>
              {image.location}
            </Text>
          </View>
        </ImageBackground>

        <Text style={styles.title}>
          Classify Observation
        </Text>

        <Text style={styles.subtitle}>
          Record the species visible in this camera trap image.
        </Text>

        <Text style={styles.label}>
          Species
        </Text>

        <Chips
          value={species}
          options={speciesOptions}
          onChange={setSpecies}
        />

        <View style={styles.countCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.countTitle}>
              Animal Count
            </Text>

            <Text style={styles.countHint}>
              Enter how many animals are visible.
            </Text>
          </View>

          <View style={styles.counter}>
            <Pressable
              style={styles.counterButton}
              onPress={() =>
                setCount((current) =>
                  Math.max(1, current - 1)
                )
              }
            >
              <Text style={styles.counterText}>−</Text>
            </Pressable>

            <Text style={styles.count}>
              {count}
            </Text>

            <Pressable
              style={styles.counterButton}
              onPress={() =>
                setCount((current) => current + 1)
              }
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.label}>
          Behaviour
        </Text>

        <Chips
          value={behaviour}
          options={behaviourOptions}
          onChange={setBehaviour}
        />

        <Text style={styles.label}>
          Observation Notes
        </Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add notes about the animal or image..."
          placeholderTextColor={t.muted}
          style={styles.notes}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Review Outcome
          </Text>

          <Text style={styles.infoText}>
            Saving this classification will record the outcome as
            SPECIES IDENTIFIED and mark the capture as reviewed.
          </Text>
        </View>

        <PrimaryButton
          title="Save Classification"
          onPress={save}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: t.bg,
  },

  content: {
    padding: 18,
    paddingBottom: 60,
  },

  hero: {
    height: 250,
    justifyContent: "flex-end",
  },

  heroImage: {
    borderRadius: 26,
  },

  overlay: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(5, 12, 4, 0.30)",
  },

  kicker: {
    color: t.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  heroTitle: {
    color: t.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
  },

  heroLocation: {
    color: t.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  title: {
    color: t.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 22,
  },

  subtitle: {
    color: t.muted,
    lineHeight: 20,
    marginTop: 6,
  },

  label: {
    color: t.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 0.8,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  chip: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
  },

  chipActive: {
    backgroundColor: t.accent,
    borderColor: t.accent,
  },

  chipText: {
    color: t.muted,
    fontSize: 12,
    fontWeight: "800",
  },

  chipTextActive: {
    color: t.black,
  },

  countCard: {
    marginTop: 22,
    backgroundColor: t.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  countTitle: {
    color: t.text,
    fontWeight: "900",
  },

  countHint: {
    color: t.muted,
    fontSize: 11,
    marginTop: 4,
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
    alignItems: "center",
    justifyContent: "center",
  },

  counterText: {
    color: t.accent,
    fontSize: 22,
    fontWeight: "900",
  },

  count: {
    color: t.text,
    fontSize: 21,
    fontWeight: "900",
    minWidth: 28,
    textAlign: "center",
  },

  notes: {
    minHeight: 120,
    color: t.text,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
    textAlignVertical: "top",
  },

  infoCard: {
    marginTop: 20,
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
  },

  infoTitle: {
    color: t.accent,
    fontWeight: "900",
  },

  infoText: {
    color: t.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
});