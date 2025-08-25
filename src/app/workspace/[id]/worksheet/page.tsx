"use client";

import { useState } from "react";
import { Plus, Eye, Edit3, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Worksheet {
  id: string;
  title: string;
  description: string;
  totalProblems: number;
  completedProblems: number;
  lastModified: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

export default function WorksheetPanel() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([
    {
      id: '1',
      title: 'Calculus Derivatives',
      description: 'Practice problems on finding derivatives using power rule, chain rule, and product rule',
      totalProblems: 8,
      completedProblems: 3,
      lastModified: '2 hours ago',
      difficulty: 'Medium',
      estimatedTime: '25 min'
    },
    {
      id: '2',
      title: 'Integration Basics',
      description: 'Fundamental integration techniques and basic integrals',
      totalProblems: 12,
      completedProblems: 12,
      lastModified: '1 day ago',
      difficulty: 'Easy',
      estimatedTime: '30 min'
    },
    {
      id: '3',
      title: 'Limits and Continuity',
      description: 'Advanced problems on limits, continuity, and discontinuities',
      totalProblems: 15,
      completedProblems: 0,
      lastModified: '3 days ago',
      difficulty: 'Hard',
      estimatedTime: '45 min'
    }
  ]);

  const generateNewWorksheet = () => {
    const newWorksheet: Worksheet = {
      id: Date.now().toString(),
      title: `New Worksheet ${worksheets.length + 1}`,
      description: 'Generated practice problems',
      totalProblems: 10,
      completedProblems: 0,
      lastModified: 'Just now',
      difficulty: 'Medium',
      estimatedTime: '30 min'
    };
    setWorksheets([...worksheets, newWorksheet]);
  };

  const openWorksheet = (worksheetId: string) => {
    // This would navigate to individual worksheet view
    console.log('Opening worksheet:', worksheetId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Worksheets</h3>
          <p className="text-sm text-muted-foreground">
            Practice exercises and problems to test your knowledge
          </p>
        </div>
        <Button onClick={generateNewWorksheet} size="sm" className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Generate Worksheet
        </Button>
      </div>

      <div className="grid gap-4">
        {worksheets.map((worksheet) => {
          const progressPercentage = worksheet.totalProblems > 0 
            ? (worksheet.completedProblems / worksheet.totalProblems) * 100 
            : 0;

          return (
            <Card key={worksheet.id} className="shadow-soft hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{worksheet.title}</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {worksheet.description}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(worksheet.difficulty)}
                  >
                    {worksheet.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {worksheet.completedProblems}/{worksheet.totalProblems} completed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {worksheet.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {worksheet.lastModified}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => openWorksheet(worksheet.id)}
                    size="sm" 
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {worksheet.completedProblems > 0 ? 'Continue' : 'Start'}
                  </Button>
                  <Button 
                    onClick={() => openWorksheet(worksheet.id)}
                    size="sm" 
                    variant="outline"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {worksheets.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No worksheets yet.</p>
            <Button onClick={generateNewWorksheet} className="mt-2" variant="outline">
              Generate your first worksheet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};