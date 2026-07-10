// SectorCalc PRO V2 — PDF Table Component
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1A1915",
    minHeight: 24,
    alignItems: "center",
  },
  headerCell: {
    padding: "6px 10px",
    fontSize: 9,
    fontWeight: 700,
    color: "#F0EEE6",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #E0DDD5",
    minHeight: 22,
    alignItems: "center",
  },
  cell: {
    padding: "5px 10px",
    fontSize: 9,
    color: "#1A1915",
  },
});

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface ProPdfTableProps {
  columns: Column[];
  data: Record<string, string>[];
}

export default function ProPdfTable({ columns, data }: ProPdfTableProps) {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.table} wrap={false}>
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <Text key={col.key} style={[styles.headerCell, { width: col.width ?? `${100 / columns.length}%` }]}>
            {col.label}
          </Text>
        ))}
      </View>
      {data.map((row, ri) => (
        <View key={ri} style={[styles.row, { backgroundColor: ri % 2 === 0 ? "#F0EEE6" : "#E8E6DE" }]}>
          {columns.map((col) => (
            <Text key={col.key} style={[styles.cell, { width: col.width ?? `${100 / columns.length}%` }]}>
              {row[col.key] ?? ""}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
