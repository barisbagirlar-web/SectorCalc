// SectorCalc PRO V2 — PDF Footer
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    borderTop: "1px solid #E0DDD5",
    fontSize: 7.5,
    color: "#999",
  },
  left: {
    flexDirection: "row",
    gap: 12,
  },
  right: {
    flexDirection: "row",
    gap: 12,
  },
});

interface ProPdfFooterProps {
  pageNumber?: number;
  generatedAt?: string;
}

export default function ProPdfFooter({ pageNumber, generatedAt }: ProPdfFooterProps) {
  const dateStr = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
  return (
    <View style={styles.footer} fixed>
      <View style={styles.left}>
        <Text>{dateStr}</Text>
        <Text>Decision-support report — verify project-specific assumptions before final use.</Text>
      </View>
      <View style={styles.right}>
        <Text>Stuttgart, Germany · Global Engineering Standards</Text>
        {pageNumber !== undefined && <Text>Page {pageNumber}</Text>}
      </View>
    </View>
  );
}
