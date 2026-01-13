import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface LiveStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "primary" | "secondary" | "success" | "warning" | "destructive";
  trend?: number;
  delay?: number;
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  destructive: "bg-destructive/10 text-destructive",
};

export function LiveStatsCard({ title, value, icon: Icon, color, trend, delay = 0 }: LiveStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-foreground mt-1"
              >
                {value.toLocaleString()}
              </motion.p>
              {trend !== undefined && (
                <p className={`text-xs mt-1 ${trend >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last week
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
