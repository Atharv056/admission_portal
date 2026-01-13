import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

interface Stats {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  todayApplications: number;
  weekApplications: number;
}

interface ApplicationPayload {
  new: { status: ApplicationStatus; created_at: string };
  old: { status: ApplicationStatus } | null;
  eventType: "INSERT" | "UPDATE" | "DELETE";
}

export function useRealtimeStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    draft: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    todayApplications: 0,
    weekApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: applications, error } = await supabase
        .from("applications")
        .select("status, created_at");

      if (error) throw error;

      const newStats: Stats = {
        total: applications?.length || 0,
        draft: 0,
        submitted: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        todayApplications: 0,
        weekApplications: 0,
      };

      applications?.forEach((app) => {
        switch (app.status) {
          case "draft":
            newStats.draft++;
            break;
          case "submitted":
            newStats.submitted++;
            break;
          case "under_review":
            newStats.underReview++;
            break;
          case "approved":
            newStats.approved++;
            break;
          case "rejected":
            newStats.rejected++;
            break;
        }

        const createdAt = new Date(app.created_at);
        if (createdAt >= today) {
          newStats.todayApplications++;
        }
        if (createdAt >= weekAgo) {
          newStats.weekApplications++;
        }
      });

      setStats(newStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up realtime subscription
    const channel = supabase
      .channel("applications-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        (payload) => {
          // Refetch stats on any change
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading, lastUpdated, refetch: fetchStats };
}
