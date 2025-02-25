import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const MOCK_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}`,
  value: Math.floor(Math.random() * 100),
}));

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down";
  showChart?: boolean;
}

export default function MetricCard({
  title,
  value,
  description,
  showChart = true,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>
          <span className="text-2xl font-bold">{value}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        {showChart && (
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="url(#gradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
