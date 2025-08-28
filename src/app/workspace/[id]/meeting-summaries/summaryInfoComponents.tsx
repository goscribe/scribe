import {MetadataProp} from "@/app/workspace/[id]/meeting-summaries/page";
import {Badge} from "@/components/ui/badge";
import {Calendar, Clock, Users} from "lucide-react";
import {CardHeader, CardTitle} from "@/components/ui/card";

export const SummaryActionItems = ({summary}: MetadataProp) => {
    return (
        <div>
            <h4 className="text-sm font-medium mb-2">Action Items</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
                {summary.actionItems.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">□</span>
                        {item}
                    </li>
                ))}
                {summary.actionItems.length > 2 && (
                    <li className="text-xs">+{summary.actionItems.length - 2} more</li>
                )}
            </ul>
        </div>
    )
}

export const SummaryKeyPoints = ({summary}: MetadataProp) => {
    return(
        <div>
            <h4 className="text-sm font-medium mb-2">Key Points</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
                {summary.keyPoints.slice(0, 2).map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                    </li>
                ))}
                {summary.keyPoints.length > 2 && (
                    <li className="text-xs">+{summary.keyPoints.length - 2} more</li>
                )}
            </ul>
        </div>
    )
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Final': return 'bg-green-100 text-green-800 border-green-200';
        case 'Reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'bg-muted text-muted-foreground';
    }
};

export const SummaryMetadata = ({summary}: MetadataProp) => {
    return(
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <CardTitle className="text-base mb-2">{summary.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {summary.date}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {summary.duration}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {summary.participants.length} participants
                        </div>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={getStatusColor(summary.status)}
                >
                    {summary.status}
                </Badge>
            </div>
        </CardHeader>
    )
}