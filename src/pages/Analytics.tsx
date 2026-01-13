import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { LiveStatsCard } from "@/components/LiveStatsCard";
import { ApplicationPieChart, ApplicationBarChart } from "@/components/ApplicationChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Analytics = () => {
  const { stats, loading, lastUpdated, refetch } = useRealtimeStats();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const approvalRate = stats.total > 0 
    ? ((stats.approved / (stats.approved + stats.rejected || 1)) * 100).toFixed(1)
    : "0";

  const processingRate = stats.total > 0
    ? (((stats.approved + stats.rejected) / stats.total) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time insights and application statistics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated: {format(lastUpdated, "HH:mm:ss")}
              </span>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <LiveStatsCard
              title="Total Applications"
              value={stats.total}
              icon={FileText}
              color="primary"
              delay={0}
            />
            <LiveStatsCard
              title="Pending Review"
              value={stats.submitted + stats.underReview}
              icon={Clock}
              color="warning"
              delay={0.1}
            />
            <LiveStatsCard
              title="Approved"
              value={stats.approved}
              icon={CheckCircle}
              color="success"
              delay={0.2}
            />
            <LiveStatsCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              color="destructive"
              delay={0.3}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <LiveStatsCard
              title="Today's Applications"
              value={stats.todayApplications}
              icon={Calendar}
              color="secondary"
              delay={0.4}
            />
            <LiveStatsCard
              title="This Week"
              value={stats.weekApplications}
              icon={TrendingUp}
              color="primary"
              delay={0.5}
            />
            <LiveStatsCard
              title="Under Review"
              value={stats.underReview}
              icon={Eye}
              color="warning"
              delay={0.6}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ApplicationPieChart stats={stats} />
            <ApplicationBarChart stats={stats} />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approval Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {approvalRate}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Of processed applications
                  </p>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${approvalRate}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {processingRate}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Applications reviewed
                  </p>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${processingRate}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Draft Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary">
                    {stats.total > 0 ? (((stats.total - stats.draft) / stats.total) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stats.draft} drafts pending submission
                  </p>
                  <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? ((stats.total - stats.draft) / stats.total) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
