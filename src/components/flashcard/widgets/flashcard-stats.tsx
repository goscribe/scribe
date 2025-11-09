import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface FlashcardStatsProps {
    timesStudied: number;
    masteryLevel: number;
    consecutiveIncorrect: number;
    currentCardIndex: number;
    totalCards: number;
}
    
export const FlashcardStats = ({ timesStudied, masteryLevel, consecutiveIncorrect, currentCardIndex, totalCards }: FlashcardStatsProps) => {
    const getMasteryColor = (level: number) => {
        if (level >= 80) return "bg-green-500 dark:bg-green-600";
        if (level >= 60) return "bg-blue-500 dark:bg-blue-600";
        if (level >= 40) return "bg-yellow-500 dark:bg-yellow-600";
        if (level >= 20) return "bg-orange-500 dark:bg-orange-600";
        return "bg-red-500 dark:bg-red-600";
    };

    const getMasteryLabel = (level: number) => {
        if (level >= 80) return "Mastered";
        if (level >= 60) return "Good";
        if (level >= 40) return "Learning";
        if (level >= 20) return "Needs Work";
        return "New";
    };
    return (
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-muted-foreground">
              {currentCardIndex + 1}
            </span>
            <span className="text-lg text-muted-foreground">/</span>
            <span className="text-lg text-muted-foreground">
              {totalCards}
            </span>
          </div>
          
          {/* Mastery Badge & Difficulty Warning */}
          <div className="flex items-center gap-2">
            {timesStudied > 0 && (
              <>
                <Badge variant="secondary" className="flex gap-2 items-center">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {timesStudied} {timesStudied === 1 ? 'study' : 'studies'}
                    </span>
                </Badge>
                {masteryLevel > 0 && (
                  <Badge 
                    className={`${getMasteryColor(masteryLevel)} text-white border-0`}
                  >
                    {masteryLevel}% {getMasteryLabel(masteryLevel)}
                  </Badge>
                )}
              </>
            )}
  
            {timesStudied == 0 && (
              <Badge 
                variant="secondary"
              >
                Unseen
              </Badge>
            )}
            
            {/* Difficulty Warning Badge */}
            {consecutiveIncorrect > 0 && (
              <Badge 
                variant="secondary"
                className="flex gap-1.5 items-center text-muted-foreground"
              >
                {consecutiveIncorrect >= 3 ? (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    <span>{consecutiveIncorrect} misses</span>
                  </>
                ) : consecutiveIncorrect === 2 ? (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    <span>2 misses</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-3 w-3" />
                    <span>1 miss</span>
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>
    )
}