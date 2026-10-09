// src/components/log-field-incident/PatrolMap.jsx
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function PatrolMap({ parkLocation, parkName }) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parkLocation?.latitude ?? 6.9271,
          longitude: parkLocation?.longitude ?? 79.8612,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={false}
      >
        {parkLocation && (
          <Marker
            coordinate={{
              latitude: parkLocation.latitude,
              longitude: parkLocation.longitude,
            }}
            title={parkName || "Park location"}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 260, width: "100%" },
  map: { ...StyleSheet.absoluteFillObject },
});
