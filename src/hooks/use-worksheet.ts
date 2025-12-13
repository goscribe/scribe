import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { usePusherWorksheet } from './pusher/use-pusher-worksheet';
import { RouterOutputs } from '@goscribe/server';
import { WorksheetQuestionMeta } from '@/types/worksheet';

type Worksheet = RouterOutputs['worksheets']['get'];
type WorksheetProblem = Worksheet['questions'][number];

/**
 * Custom hook for managing all worksheet operations
 * 
 * Provides functionality for:
 * - Listing worksheets with real-time updates
 * - Individual worksheet detail management
 * - Creating, updating, and deleting worksheets
 * - Real-time synchronization via Pusher
 * - Progress tracking and answer management
 * 
 * @param workspaceId - The ID of the workspace
 * @param worksheetId - Optional ID of a specific worksheet for detail operations
 * @returns Object containing worksheet operations and state
 * 
 * @example
 * ```tsx
 * // For worksheet list
 * const { worksheets, isLoading, createWorksheet, deleteWorksheet } = useWorksheet(workspaceId);
 * 
 * // For worksheet detail
 * const { worksheet, userAnswers, completeProblem } = useWorksheet(workspaceId, worksheetId);
 * ```
 */
export const useWorksheet = (workspaceId: string, worksheetId?: string) => {
  const router = useRouter();

  // State management for detail operations
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [showAnswers, setShowAnswers] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  // Pusher integration for real-time updates
  const { 
    isConnected, 
    isGenerating, 
    // generationProgress,
    subscribeToWorksheets 
  } = usePusherWorksheet(workspaceId);

  // tRPC queries
  const { data: worksheets = [], isLoading: worksheetsLoading, error: worksheetsError, refetch: refetchWorksheets } = trpc.worksheets.list.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const checkAnswerMutation = trpc.worksheets.checkAnswer.useMutation({
    onSuccess: (data) => {
        refetchWorksheet();
         // Update local state
        setIsCheckingAnswer(false);
        refetchProgress();
        //        return { isCorrect, userMarkScheme, progress };
    //   const { isCorrect, userMarkScheme, progress } = data;
    //   const problemId = progress.worksheetQuestionId;
    // setCompletedProblems(prev => new Set([...prev, problemId]));
    // if (!isCorrect) {
    //   setIncorrectAnswers(prev => new Set([...prev, problemId]));
    // }
    
    // // Save to server
    // updateProblemMutation.mutate({
    //   problemId,
    //   completed: true,
    //   correct: isCorrect,
    //   answer,
    // });
      toast.success("Answer checked successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to check answer");
    },
  });

  const { data: worksheet, isLoading: worksheetLoading, error: worksheetError, refetch: refetchWorksheet } = trpc.worksheets.get.useQuery(
    { worksheetId: worksheetId! },
    { enabled: !!workspaceId && !!worksheetId }
  );

  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = trpc.worksheets.getProgress.useQuery(
    { worksheetId: worksheetId! },
    { enabled: !!workspaceId && !!worksheetId }
  );

  // Mutations
  const createMutation = trpc.worksheets.create.useMutation({
    onSuccess: () => {
      refetchWorksheets();
      toast.success("Worksheet created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create worksheet");
    },
  });

  const generateMutation = trpc.worksheets.generateFromPrompt.useMutation({
    onSuccess: () => {
      refetchWorksheets();
      toast.success("Worksheet generated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate worksheet");
    },
  });

  const deleteMutation = trpc.worksheets.delete.useMutation({
    onSuccess: () => {
      refetchWorksheets();
      toast.success("Worksheet deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete worksheet");
    },
  });

  const updateProblemMutation = trpc.worksheets.updateProblemStatus.useMutation({
    onSuccess: (data, variables) => {
      toast.success("Answer saved!");
      refetchProgress();
      
      // Update local state immediately for better UX
      if (variables.completed) {
        setCompletedProblems(prev => new Set([...prev, variables.problemId]));
        
        // Track if the answer was incorrect
        if (!variables.correct) {
          setIncorrectAnswers(prev => new Set([...prev, variables.problemId]));
        } else {
          // Remove from incorrect if it was previously incorrect but now correct
          setIncorrectAnswers(prev => {
            const newSet = new Set(prev);
            newSet.delete(variables.problemId);
            return newSet;
          });
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save answer");
    },
  });

  const updateProblemStatusMutation = trpc.worksheets.updateProblemStatus.useMutation({
    onSuccess: (data, variables) => {
      toast.success("Answer saved!");
      
      // Update local state immediately for better UX
      if (variables.completed) {
        setCompletedProblems(prev => new Set([...prev, variables.problemId]));
        
        // Track if the answer was incorrect
        if (!variables.correct) {
          setIncorrectAnswers(prev => new Set([...prev, variables.problemId]));
        } else {
          // Remove from incorrect if it was previously incorrect but now correct
          setIncorrectAnswers(prev => {
            const newSet = new Set(prev);
            newSet.delete(variables.problemId);
            return newSet;
          });
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save answer");
    },
  });

  const updateMutation = trpc.worksheets.update.useMutation({
    onSuccess: () => {
      refetchWorksheet();
      refetchWorksheets();
      toast.success("Worksheet updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update worksheet");
    },
  });

  /**
   * Subscribe to real-time worksheet updates
   */
  useEffect(() => {
    if (isConnected) {
      subscribeToWorksheets({
        onNewWorksheet: () => {
          toast.success("New worksheet created!");
          refetchWorksheets();
        },
        onWorksheetUpdate: (updatedWorksheet) => {
          toast.success("Worksheet updated!");
          refetchWorksheets();
          
          // If this is the current worksheet, refetch its details too
          if (worksheetId && updatedWorksheet.id === worksheetId) {
            refetchWorksheet();
          }
        },
        onWorksheetDelete: (deletedWorksheetId) => {
          toast.success("Worksheet deleted!");
          refetchWorksheets();
          
          // If this is the current worksheet, redirect to list
          if (worksheetId && deletedWorksheetId === worksheetId) {
            toast.error("This worksheet has been deleted!");
            router.push(`/workspace/${workspaceId}/worksheet`);
          }
        },
        onGenerationStart: () => {
          toast.info("Starting worksheet generation...");
        },
        onGenerationComplete: () => {
          toast.success("Worksheet generated successfully!");
          refetchWorksheets();
          // Also refetch individual worksheet if we're viewing one
          if (worksheetId) {
            refetchWorksheet();
          }
        },
        onGenerationError: (error) => {
          toast.error(`Generation failed: ${error}`);
        },
        onWorksheetInfoComplete: () => {
          toast.success("Worksheet information updated!");
          refetchWorksheets();
          // Also refetch individual worksheet if we're viewing one
          if (worksheetId) {
            refetchWorksheet();
          }
        },
      });
    }
  }, [isConnected, worksheetId, subscribeToWorksheets, refetchWorksheets, refetchWorksheet, router, workspaceId]);

  /**
   * Initialize completed problems and user answers from worksheet and progress data
   */
  useEffect(() => {
    if (worksheet && progressData) {
      // Create a map of question progress for quick lookup
      const progressMap = new Map(
        progressData.map(progress => [progress.worksheetQuestionId, progress])
      );

      const completed = new Set<string>();
      const incorrect = new Set<string>();
      const correct = new Set<string>();
      const answers: Record<string, string> = {};

      worksheet.questions.forEach((problem: WorksheetProblem) => {
        const progress = progressMap.get(problem.id);
        
        // Check if question is completed based on progress data
        if (progress?.completedAt) {
          completed.add(problem.id);
          
          // Track incorrect answers (completed but not correct)
          if (!progress.correct) {
            incorrect.add(problem.id);
          } else {
            correct.add(problem.id);
          }
        }
        
        // Initialize user answers from progress data
        if (progress?.userAnswer) {
          answers[problem.id] = progress.userAnswer;
        }
      });

      setCompletedProblems(completed);
      setIncorrectAnswers(incorrect);
      setCorrectAnswers(correct);
      setUserAnswers(answers);
    }
  }, [worksheet, progressData]);


  /**
   * Creates a new worksheet with sample problems
   */
  const createWorksheet = () => {
    generateMutation.mutate({
      workspaceId,
      prompt: "Generate a worksheet",
    });


    // createMutation.mutate({
    //   workspaceId,
    //   title: `New Worksheet ${worksheets.length + 1}`,
    //   description: 'Generated practice problems',
    //   difficulty: 'MEDIUM',
    //   estimatedTime: '30 min',
    //   problems: [
    //     {
    //       question: 'Sample question 1',
    //       answer: 'Sample answer 1',
    //       type: 'TEXT',
    //     },
    //     {
    //       question: 'Sample question 2',
    //       answer: 'Sample answer 2',
    //       type: 'TEXT',
    //     },
    //     {
    //       question: 'Sample question 3',
    //       answer: 'Sample answer 3',
    //       type: 'MULTIPLE_CHOICE',
    //       options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    //     },
    //     {
    //       question: 'Sample question 4',
    //       answer: 'Sample answer 4',
    //       type: 'NUMERIC',
    //     },
    //     {
    //       question: 'Sample question 5',
    //       answer: 'Sample answer 5',
    //       type: 'TRUE_FALSE',
    //     },
    //     {
    //       question: 'Sample question 6',
    //       answer: 'Sample answer 6',
    //       type: 'MATCHING',
    //       options: ['Option 1', 'Option 2', 'Option 3'],
    //     }
    //   ],
    // });
  };

  /**
   * Opens a worksheet in view mode
   * @param id - The ID of the worksheet to open
   */
  const openWorksheet = (id: string) => {
    router.push(`/workspace/${workspaceId}/worksheet/${id}`);
  };

  /**
   * Opens a worksheet in edit mode
   * @param id - The ID of the worksheet to edit
   */
  const openEditPage = (id: string) => {
    router.push(`/workspace/${workspaceId}/worksheet/${id}/edit`);
  };

  /**
   * Deletes a worksheet
   * @param id - The ID of the worksheet to delete
   */
  const deleteWorksheet = (id: string) => {
    deleteMutation.mutate({ id });
  };

  /**
   * Updates a user's answer for a specific problem
   * @param problemId - The ID of the problem
   * @param answer - The user's answer
   */
  const updateAnswer = (problemId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [problemId]: answer
    }));
  };

  /**
   * Checks if an answer is correct
   * @param problemId - The ID of the problem to check
   * @param userAnswer - The user's answer
   * @param type - The problem type
   * @param correctAnswer - The correct answer (optional, for direct checking)
   * @returns Whether the answer is correct
   */
  const checkAnswer = (problemId: string, userAnswer: string, type: string, correctAnswer?: string) => {
    if (!userAnswer) return false;
    
    // For MCQ and TRUE_FALSE, check directly without waiting for API call
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
      if (!correctAnswer) {
        const problem = worksheet?.questions.find((q: WorksheetProblem) => q.id === problemId);
        correctAnswer = problem?.answer || '';
      }
      
      let isCorrect: boolean;
      
      if (type === 'TRUE_FALSE') {
        // TRUE_FALSE: Check against 'TRUE' or 'FALSE' (uppercase strings)
        const normalizedCorrect = correctAnswer.toUpperCase();
        const normalizedUser = userAnswer.toUpperCase();
        isCorrect = normalizedUser === normalizedCorrect && (normalizedCorrect === 'TRUE' || normalizedCorrect === 'FALSE');
      } else if (type === 'MULTIPLE_CHOICE') {
        // MCQ: Use 0-based index (0 to N-1 where N is number of options)
        const problem = worksheet?.questions.find((q: WorksheetProblem) => q.id === problemId);
        const options = (problem?.meta as WorksheetQuestionMeta)?.options || [];
        
        // Convert user answer (option text) to 0-based index
        const userIndex = options.indexOf(userAnswer);
        
        // Convert correct answer to 0-based index
        // It could be an index string ("0", "1", etc.) or option text
        let correctIndex = -1;
        const correctAsNumber = parseInt(correctAnswer, 10);
        if (!isNaN(correctAsNumber) && correctAsNumber >= 0 && correctAsNumber < options.length) {
          // Correct answer is a numeric index
          correctIndex = correctAsNumber;
        } else {
          // Correct answer is option text, find its index
          correctIndex = options.indexOf(correctAnswer);
        }
        
        isCorrect = userIndex === correctIndex && userIndex !== -1 && correctIndex !== -1;
      } else {
        // Fallback: direct comparison
        isCorrect = userAnswer === correctAnswer;
      }
      
      // Update local state immediately
      setIsCheckingAnswer(false);
      setCompletedProblems(prev => new Set([...prev, problemId]));
      
      if (isCorrect) {
        setCorrectAnswers(prev => new Set([...prev, problemId]));
        setIncorrectAnswers(prev => {
          const next = new Set(prev);
          next.delete(problemId);
          return next;
        });
      } else {
        setIncorrectAnswers(prev => new Set([...prev, problemId]));
        setCorrectAnswers(prev => {
          const next = new Set(prev);
          next.delete(problemId);
          return next;
        });
      }

      updateProblemStatusMutation.mutate({
        problemId: problemId,
        completed: true,
        correct: isCorrect,
        answer: userAnswer,
      });
    //   updateProblemStatus: authedProcedure
    // .input(z.object({
    //   problemId: z.string(),
    //   completed: z.boolean(),
    //   answer: z.string().optional(),
    //   correct: z.boolean().optional(),
    // }))


      // // Still save progress to backend, but don't wait for it
      // checkAnswerMutation.mutate({
      //   worksheetId: worksheetId!,
      //   questionId: problemId,
      //   answer: userAnswer,
      // });
      
      return isCorrect;
    }
    
    // For other types (TEXT, NUMERIC, MATCHING, etc.), use the API mutation
    setIsCheckingAnswer(true);
    checkAnswerMutation.mutate({
      worksheetId: worksheetId!,
      questionId: problemId,
      answer: userAnswer,
    });

    return true;
  };

  /**
   * Marks a problem as completed and saves the answer
   * @param problemId - The ID of the problem to complete
   */
  const completeProblem = (problemId: string) => {
    const answer = userAnswers[problemId] || '';
    const problem = worksheet?.questions.find((q: WorksheetProblem) => q.id === problemId);
    
    if (!problem) return;
    
    setIsCheckingAnswer(true);
    // Check if answer is correct (pass correctAnswer for direct checking of MCQ/TrueFalse)
    checkAnswer(problemId, answer, problem.type, problem.answer || '');
  };

  /**
   * Toggles the show answers state
   */
  const toggleShowAnswers = () => {
    setShowAnswers(prev => !prev);
  };

  /**
   * Resets the worksheet progress
   */
  const resetProgress = () => {
    setUserAnswers({});
    setCompletedProblems(new Set());
    setIncorrectAnswers(new Set());
    setShowAnswers(false);
  };

  /**
   * Updates a worksheet
   * @param data - The worksheet update data
   */
  const updateWorksheet = (data: {
    id: string;
    title?: string;
    description?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    estimatedTime?: string;
    problems?: Array<{
      question: string;
      answer: string;
      id?: string;
      type?: "TEXT" | "NUMERIC" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK" | "MATCHING";
      options?: string[];
    }>;
  }) => {
    updateMutation.mutate(data);
  };

  // Return different interfaces based on whether we're in list or detail mode
  if (worksheetId) {
    // Detail mode - return worksheet detail interface
    return {
      /** The worksheet data */
      worksheet,
      /** Whether the worksheet is loading */
      isLoading: worksheetLoading || progressLoading,
      /** Error state if any */
      error: worksheetError,
      /** User's answers for each problem */
      userAnswers,
      /** Whether an answer is being checked */
      isCheckingAnswer,
      /** Set of correct answer problem IDs */
      correctAnswers,
      /** Set of incorrect answer problem IDs */
      incorrectAnswers,
      /** Set of completed problem IDs */
      completedProblems,
      /** Whether to show correct answers */
      showAnswers,
      /** Function to update an answer */
      updateAnswer,
      /** Function to complete a problem */
      completeProblem,
      /** Function to toggle show answers */
      toggleShowAnswers,
      /** Function to reset progress */
      resetProgress,
      /** Function to refetch worksheet data */
      refetch: refetchWorksheet,
      /** Function to refetch progress data */
      refetchProgress,
      /** Function to update worksheet */
      updateWorksheet,
      /** Whether worksheet is being updated */
      isUpdating: updateMutation.isPending,
    };
  } else {
    // List mode - return worksheet list interface
    return {
      /** Array of worksheets */
      worksheets,
      /** Whether worksheets are loading */
      isLoading: worksheetsLoading,
      /** Error state if any */
      error: worksheetsError,
      /** Whether a worksheet is being created */
      isCreating: createMutation.isPending,
      /** Whether a worksheet is being deleted */
      isDeleting: deleteMutation.isPending,
      /** Whether worksheet generation is in progress */
      isGenerating,
      /** Function to create a new worksheet */
      createWorksheet,
      /** Function to open a worksheet */
      openWorksheet,
      /** Function to open worksheet edit page */
      openEditPage,
      /** Function to delete a worksheet */
      deleteWorksheet,
      /** Function to refetch worksheets */
      refetch: refetchWorksheets,
    };
  }
};
