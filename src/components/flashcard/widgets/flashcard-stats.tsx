import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react";

interface FlashcardStatsProps {
    timesStudied: number;
    masteryLevel: number;
    consecutiveIncorrect: number;
    currentCardIndex: number;
    totalCards: number;
}
    
export const FlashcardStats = ({ timesStudied, masteryLevel, consecutiveIncorrect, currentCardIndex, totalCards }: FlashcardStatsProps) => {
    const getMasteryColor = (level: number) => {
        if (level >= 80) return "bg-green-500";
        if (level >= 60) return "bg-blue-500";
        if (level >= 40) return "bg-yellow-500";
        if (level >= 20) return "bg-orange-500";
        return "bg-red-500";
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
                <Badge variant="secondary" className="flex gap-2 items-center bg-gray-100 text-gray-700 border-gray-200">
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
                className="bg-gray-100 text-gray-700 border-gray-200"
              >
                Unseen
              </Badge>
            )}
            
            {/* Difficulty Warning Badge */}
            {consecutiveIncorrect > 0 && (
              <Badge 
                variant="secondary"
                className={`
                  ${consecutiveIncorrect >= 3 
                    ? 'bg-slate-100 text-slate-700 border-slate-200' 
                    : consecutiveIncorrect === 2
                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200'}
                `}
              >
                {consecutiveIncorrect >= 3 
                  ? `⚠️ ${consecutiveIncorrect} misses`
                  : consecutiveIncorrect === 2
                  ? `⚠️ 2 misses`
                  : '💡 1 miss'}
              </Badge>
            )}
          </div>
        </div>
    )
}