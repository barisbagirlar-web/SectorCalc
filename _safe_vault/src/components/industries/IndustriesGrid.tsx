import { IndustryCard, type IndustryCardProps } from "@/components/industries/IndustryCard";

type IndustriesGridProps = {
 items: IndustryCardProps[];
};

export function IndustriesGrid({ items }: IndustriesGridProps) {
 return (
 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
 {items.map((item) => (
 <IndustryCard key={item.slug} {...item} />
 ))}
 </div>
 );
}
