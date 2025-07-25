import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const StatsFooter = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up real-time listener for stats
    const statsRef = doc(db, 'stats', 'global');
    
    const unsubscribe = onSnapshot(
      statsRef,
      (doc) => {
        setIsLoading(false);
        setError(null);
        
        if (doc.exists()) {
          const data = doc.data();
          setStats({
            totalUsers: data.totalUsers || 0,
            totalNotes: data.totalNotes || 0
          });
        } else {
          // If document doesn't exist, show default values
          setStats({
            totalUsers: 0,
            totalNotes: 0
          });
        }
      },
      (error) => {
        console.error('Error fetching real-time stats:', error);
        setError(error);
        setIsLoading(false);
        
        // Fallback to default values on error
        setStats({
          totalUsers: 0,
          totalNotes: 0
        });
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Show loading skeleton while loading
  if (isLoading) {
    return (
      <div className="mt-16 mb-8">
        <Card className="glass border-white/20 max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                    <span className="text-2xl font-bold text-white/50">--</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">Happy Learners</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                    <span className="text-2xl font-bold text-white/50">--</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">Notes Generated</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <div className="flex items-center justify-center space-x-2 text-white/50 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Loading community stats...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Growing community of learners worldwide 🌍</span>
            </div>
            {error && (
              <p className="text-orange-400 text-xs mt-2">
                Live stats temporarily unavailable
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsFooter;
