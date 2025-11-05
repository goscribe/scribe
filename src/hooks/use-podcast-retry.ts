// import { useState, useCallback, useRef, useEffect } from 'react';
// import { toast } from 'sonner';

// interface RetryOptions {
//   maxAttempts?: number;
//   baseDelay?: number;
//   maxDelay?: number;
//   backoffMultiplier?: number;
//   onRetry?: (attempt: number) => void;
//   onSuccess?: () => void;
//   onFailure?: (error: Error) => void;
// }

// interface RetryState {
//   isRetrying: boolean;
//   currentAttempt: number;
//   lastError: Error | null;
//   nextRetryIn: number | null;
// }

// /**
//  * Hook for retry logic with exponential backoff
//  */
// export function usePodcastRetry(options: RetryOptions = {}) {
//   const {
//     maxAttempts = 3,
//     baseDelay = 1000,
//     maxDelay = 10000,
//     backoffMultiplier = 2,
//     onRetry,
//     onSuccess,
//     onFailure,
//   } = options;

//   const [state, setState] = useState<RetryState>({
//     isRetrying: false,
//     currentAttempt: 0,
//     lastError: null,
//     nextRetryIn: null,
//   });

//   const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   /**
//    * Calculate delay with exponential backoff
//    */
//   const calculateDelay = useCallback((attempt: number): number => {
//     const delay = Math.min(
//       baseDelay * Math.pow(backoffMultiplier, attempt - 1),
//       maxDelay
//     );
//     return delay;
//   }, [baseDelay, backoffMultiplier, maxDelay]);

//   /**
//    * Clear all timers
//    */
//   const clearTimers = useCallback(() => {
//     if (retryTimeoutRef.current) {
//       clearTimeout(retryTimeoutRef.current);
//       retryTimeoutRef.current = null;
//     }
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//       countdownIntervalRef.current = null;
//     }
//   }, []);

//   /**
//    * Execute function with retry logic
//    */
//   const executeWithRetry = useCallback(async <T,>(
//     fn: () => Promise<T>
//   ): Promise<T> => {
//     let attempt = 0;

//     while (attempt < maxAttempts) {
//       attempt++;

//       setState(prev => ({
//         ...prev,
//         isRetrying: true,
//         currentAttempt: attempt,
//       }));

//       try {
//         const result = await fn();
        
//         // Success!
//         setState({
//           isRetrying: false,
//           currentAttempt: 0,
//           lastError: null,
//           nextRetryIn: null,
//         });

//         clearTimers();
//         onSuccess?.();
        
//         if (attempt > 1) {
//           toast.success(`Succeeded after ${attempt} attempts`);
//         }

//         return result;
//       } catch (error) {
//         const err = error instanceof Error ? error : new Error(String(error));
        
//         setState(prev => ({
//           ...prev,
//           lastError: err,
//         }));

//         if (attempt < maxAttempts) {
//           // Calculate delay and notify
//           const delay = calculateDelay(attempt);
//           const delaySeconds = Math.ceil(delay / 1000);

//           onRetry?.(attempt);

//           toast.error(
//             `Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delaySeconds}s...`,
//             { id: `retry-${attempt}` }
//           );

//           // Update countdown
//           setState(prev => ({
//             ...prev,
//             nextRetryIn: delaySeconds,
//           }));

//           // Start countdown interval
//           let remainingSeconds = delaySeconds;
//           countdownIntervalRef.current = setInterval(() => {
//             remainingSeconds--;
//             setState(prev => ({
//               ...prev,
//               nextRetryIn: remainingSeconds,
//             }));
//           }, 1000);

//           // Wait before retry
//           await new Promise(resolve => {
//             retryTimeoutRef.current = setTimeout(resolve, delay);
//           });

//           clearTimers();
//         } else {
//           // Max attempts reached
//           setState({
//             isRetrying: false,
//             currentAttempt: 0,
//             lastError: err,
//             nextRetryIn: null,
//           });

//           clearTimers();
//           onFailure?.(err);

//           toast.error(`Failed after ${maxAttempts} attempts`, {
//             id: 'retry-failed',
//           });

//           throw err;
//         }
//       }
//     }

//     throw new Error('Retry loop exited unexpectedly');
//   }, [maxAttempts, calculateDelay, clearTimers, onRetry, onSuccess, onFailure]);

//   /**
//    * Manual retry function
//    */
//   const retry = useCallback(async <T,>(
//     fn: () => Promise<T>
//   ): Promise<T> => {
//     return executeWithRetry(fn);
//   }, [executeWithRetry]);

//   /**
//    * Cancel ongoing retry
//    */
//   const cancel = useCallback(() => {
//     clearTimers();
//     setState({
//       isRetrying: false,
//       currentAttempt: 0,
//       lastError: null,
//       nextRetryIn: null,
//     });
//     toast.dismiss();
//   }, [clearTimers]);

//   /**
//    * Reset state
//    */
//   const reset = useCallback(() => {
//     cancel();
//   }, [cancel]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       clearTimers();
//     };
//   }, [clearTimers]);

//   return {
//     ...state,
//     retry,
//     cancel,
//     reset,
//     canRetry: state.currentAttempt < maxAttempts,
//   };
// }

// /**
//  * Hook specifically for podcast generation retry
//  */
// export function usePodcastGenerationRetry(workspaceId: string) {
//   const retry = usePodcastRetry({
//     maxAttempts: 3,
//     baseDelay: 2000,
//     maxDelay: 15000,
//     onRetry: (attempt) => {
//       console.log(`Retrying podcast generation, attempt ${attempt}`);
//     },
//     onSuccess: () => {
//       console.log('Podcast generation succeeded');
//     },
//     onFailure: (error) => {
//       console.error('Podcast generation failed after all retries:', error);
//     },
//   });

//   return retry;
// }

