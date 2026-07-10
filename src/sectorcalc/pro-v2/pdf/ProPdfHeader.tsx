// SectorCalc PRO V2 — PDF Header
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    backgroundColor: "#1A1915",
  },
  brand: {
    fontSize: 13,
    fontWeight: 700,
    color: "#F0EEE6",
    letterSpacing: 1,
  },
  title: {
    fontSize: 10,
    color: "#BD5D3A",
    fontWeight: 600,
  },
  reportId: {
    fontSize: 8,
    color: "#999",
  },
});

interface ProPdfHeaderProps {
  reportTitle: string;
  reportId?: string;
}

export default function ProPdfHeader({ reportTitle, reportId }: ProPdfHeaderProps) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.brand}>SECTORCALC</Text>
      <Text style={styles.title}>{reportTitle}</Text>
      {reportId && <Text style={styles.reportId}>{reportId.slice(0, 12)}</Text>}
    </View>
  );
}
