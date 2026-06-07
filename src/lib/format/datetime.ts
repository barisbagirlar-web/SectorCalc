export function formatLocalDateTime(value: string): string {
 const date = new Date(value);

 if (Number.isNaN(date.getTime())) {
 return "Invalid date";
 }

 return new Intl.DateTimeFormat("en-GB", {
 dateStyle: "medium",
 timeStyle: "short",
 hour12: false,
 }).format(date);
}
