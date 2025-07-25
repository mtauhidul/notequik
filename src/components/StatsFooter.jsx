import { Card, CardContent } from "@/components/ui/card";
import { getGlobalStats } from "@/utils/firebase";
import { FileText, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

const StatsFooter = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const globalStats = await getGlobalStats();
        setStats(globalStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="mt-16 mb-8">
      <Card className="glass border-white/20 max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-white">
                  {stats.totalUsers.toLocaleString()}
                </span>
              </div>
              <p className="text-white/60 text-sm">Happy Learners</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5 text-secondary" />
                <span className="text-2xl font-bold text-white">
                  {stats.totalNotes.toLocaleString()}
                </span>
              </div>
              <p className="text-white/60 text-sm">Notes Generated</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <div className="flex items-center justify-center space-x-2 text-white/50 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>
                Join thousands of learners transforming YouTube videos into
                knowledge
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsFooter;
