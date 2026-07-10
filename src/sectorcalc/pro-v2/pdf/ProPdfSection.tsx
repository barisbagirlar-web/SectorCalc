// SectorCalc PRO V2 — PDF Section Wrapper
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginBottom: 14,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottom: "2px solid #BD5D3A",
    paddingBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1A1915",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {},
});

interface ProPdfSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ProPdfSection({ title, children }: ProPdfSectionProps) {
  if (!children) return null;
  return (
    <View style={styles.section} wrap={false}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}
