"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, BookCheck, Clock, Target } from "lucide-react";

interface StudyStreakCardProps {
  streak: number;
  totalStudyDays: number;
  weeklyActivity: boolean[];
  flashcards: {
    total: number;
    mastered: number;
    dueForReview: number;
  };
  worksheets: {
    completed: number;
    correct: number;
    accuracy: number;
  };
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StudyStreakCard({
  streak,
  totalStudyDays,
  weeklyActivity,
  flashcards,
  worksheets,
}: StudyStreakCardProps) {
  return (
    <Card className="border-border mb-6">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Streak */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <div className="text-3xl font-bold leading-none">
                {streak}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                day streak
              </p>
            </div>
          </div>

          {/* Weekly activity dots */}
          <div className="flex items-center gap-1.5">
            {weeklyActivity.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full transition-colors ${
                    active
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {DAY_LABELS[i]}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-border" />

          {/* Stats */}
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <BookCheck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-semibold leading-none">
                  {flashcards.mastered}
                  <span className="text-muted-foreground font-normal">
                    /{flashcards.total}
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  cards mastered
                </p>
              </div>
            </div>

            {flashcards.dueForReview > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-semibold leading-none">
                    {flashcards.dueForReview}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    due for review
                  </p>
                </div>
              </div>
            )}

            {worksheets.completed > 0 && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold leading-none">
                    {worksheets.accuracy}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    worksheet accuracy
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
