// src/components/log-field-incident/IncidentTypeCard.jsx
import { TouchableOpacity, View, Text } from "react-native";
import { logIncidentStyles as styles } from "../../styles/log-field-incident/logIncidentStyles";
import { COLORS } from "../../styles/log-field-incident/activePatrolStyles";

export default function IncidentTypeCard({ type, selected, onPress }) {
  const { label, Icon } = type;

  const iconColor = selected ? "#FFFFFF" : COLORS.text;
  const fillColor = selected ? "#FFFFFF" : "transparent";
  const labelStyle = selected
    ? styles.typeCardLabelActive
    : styles.typeCardLabel;

  return (
    <TouchableOpacity
      style={[styles.typeCard, selected && styles.typeCardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.typeCardIconWrap}>
        <Icon size={28} color={iconColor} strokeWidth={2.4} fill={fillColor} />
      </View>
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
