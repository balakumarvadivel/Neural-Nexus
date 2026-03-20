import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
      <p className="mt-3 text-sm text-slate-400">{hint}</p>
    </Card>
  );
}
