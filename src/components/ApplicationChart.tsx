import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface ChartProps {
  stats: {
    draft: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
}

const COLORS = {
  draft: "hsl(var(--muted-foreground))",
  submitted: "hsl(221, 83%, 53%)",
  underReview: "hsl(45, 93%, 47%)",
  approved: "hsl(142, 76%, 36%)",
  rejected: "hsl(0, 84%, 60%)",
};

export function ApplicationPieChart({ stats }: ChartProps) {
  const data = [
    { name: "Draft", value: stats.draft, color: COLORS.draft },
    { name: "Submitted", value: stats.submitted, color: COLORS.submitted },
    { name: "Under Review", value: stats.underReview, color: COLORS.underReview },
    { name: "Approved", value: stats.approved, color: COLORS.approved },
    { name: "Rejected", value: stats.rejected, color: COLORS.rejected },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No application data available
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ApplicationBarChart({ stats }: ChartProps) {
  const data = [
    { name: "Draft", value: stats.draft, fill: COLORS.draft },
    { name: "Submitted", value: stats.submitted, fill: COLORS.submitted },
    { name: "Under Review", value: stats.underReview, fill: COLORS.underReview },
    { name: "Approved", value: stats.approved, fill: COLORS.approved },
    { name: "Rejected", value: stats.rejected, fill: COLORS.rejected },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applications by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
