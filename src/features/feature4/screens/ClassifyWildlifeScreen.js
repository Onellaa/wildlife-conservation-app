import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
import { behaviourOptions, speciesOptions } from "../data/sampleImages";
import {
  getCameraTrapImageById,
  saveClassification,
} from "../services/cameraTrapRepository";

function OptionGroup({ title, value, options, onChange }) {
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable
            key={option}
            style={[styles.option, value === option && styles.optionActive]}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.optionTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
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

      Alert.alert("Saved", "Wildlife classification has been saved.");
      router.back();
    } catch (error) {
      const message =
        error.validationErrors?.species ||
        error.validationErrors?.animalCount ||
        "Unable to save classification.";

      Alert.alert("Check details", message);
    }
  };

  if (!image) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: image.imageUrl }} style={styles.image} />
        <Text style={styles.title}>Classify Wildlife</Text>

        <OptionGroup
          title="Species"
          value={species}
          options={speciesOptions}
          onChange={setSpecies}
        />

        <Text style={styles.label}>Animal Count</Text>
        <View style={styles.counter}>
          <Pressable
            style={styles.counterButton}
            onPress={() => setCount((current) => Math.max(1, current - 1))}
          >
            <Text style={styles.counterText}>−</Text>
          </Pressable>

          <Text style={styles.count}>{count}</Text>

          <Pressable
            style={styles.counterButton}
            onPress={() => setCount((current) => current + 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </Pressable>
        </View>

        <OptionGroup
          title="Behaviour"
          value={behaviour}
          options={behaviourOptions}
          onChange={setBehaviour}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Add observations..."
          style={styles.textArea}
        />

        <PrimaryButton title="Save Classification" onPress={save} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  container: { padding: 18, paddingBottom: 40 },
  image: { width: "100%", height: 220, borderRadius: 18 },
  title: { marginTop: 18, fontSize: 26, fontWeight: "900", color: "#17352C" },
  label: { marginTop: 20, marginBottom: 8, fontSize: 13, fontWeight: "800", color: "#374151" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, backgroundColor: "#E5E7EB" },
  optionActive: { backgroundColor: "#1F6B4F" },
  optionText: { fontSize: 12, color: "#374151" },
  optionTextActive: { color: "#FFFFFF", fontWeight: "700" },
  counter: { flexDirection: "row", alignItems: "center", gap: 20 },
  counterButton: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E7EB" },
  counterText: { fontSize: 24, fontWeight: "800" },
  count: { minWidth: 30, textAlign: "center", fontSize: 22, fontWeight: "900" },
  textArea: { minHeight: 110, borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D1D5DB", padding: 12, textAlignVertical: "top" },
});
