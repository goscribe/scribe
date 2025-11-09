import { cn } from "@/lib/utils";

interface FlashcardDotsIndicatorProps {
    masteryLevel: number;
    timesStudied: number;
    consecutiveIncorrect: number;
}

export default function FlashcardDotsIndicator({ masteryLevel, timesStudied, consecutiveIncorrect }: FlashcardDotsIndicatorProps) {
        // Get progress data from the first element of progress array
        return (
          <div className="flex items-center gap-2.5">
            {/* Mastery Level Dots */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    level <= masteryLevel
                      ? masteryLevel >= 4
                        ? "bg-green-500"
                        : masteryLevel >= 2
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                      : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
            
            {/* Study Count */}
            {timesStudied > 0 && (
              <span className="text-xs text-muted-foreground/60 font-medium">
                {timesStudied}x
              </span>
            )}
            
            {/* Warning for consecutive incorrect */}
            {consecutiveIncorrect >= 2 && (
              <span className="text-xs text-orange-500/80" title={`${consecutiveIncorrect} consecutive incorrect`}>
                ⚠
              </span>
            )}
          </div>
        );
}