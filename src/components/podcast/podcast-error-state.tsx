"use client";

import { AlertCircle, RefreshCw, Settings, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface PodcastError {
  type: 'api_key' | 'quota' | 'network' | 'validation' | 'generation' | 'unknown';
  message: string;
  details?: string;
  recoverable: boolean;
}

interface PodcastErrorStateProps {
  error: PodcastError;
  onRetry?: () => void;
  onDismiss?: () => void;
  isRetrying?: boolean;
}

/**
 * Enhanced error state component for podcast generation
 */
export function PodcastErrorState({ 
  error, 
  onRetry, 
  onDismiss, 
  isRetrying = false 
}: PodcastErrorStateProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'api_key':
        return <Settings className="h-5 w-5" />;
      case 'quota':
        return <AlertCircle className="h-5 w-5" />;
      case 'network':
        return <RefreshCw className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'api_key':
        return 'Configuration Error';
      case 'quota':
        return 'Quota Exceeded';
      case 'network':
        return 'Connection Error';
      case 'validation':
        return 'Validation Error';
      case 'generation':
        return 'Generation Failed';
      default:
        return 'Error';
    }
  };

  const getSuggestions = (): string[] => {
    switch (error.type) {
      case 'api_key':
        return [
          'Check that your Murf TTS API key is configured',
          'Verify the API key is valid and active',
          'Contact your administrator if you need access',
        ];
      case 'quota':
        return [
          'Your API quota has been reached',
          'Wait for the quota to reset (usually monthly)',
          'Consider upgrading your API plan',
          'Try again later',
        ];
      case 'network':
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'If the problem persists, the service may be temporarily down',
        ];
      case 'validation':
        return [
          'Review your input for errors',
          'Ensure all required fields are filled',
          'Check that your prompt is clear and specific',
        ];
      case 'generation':
        return [
          'Try simplifying your prompt',
          'Reduce the number of segments',
          'Check if the source content is accessible',
        ];
      default:
        return [
          'Try again in a few moments',
          'If the error persists, contact support',
        ];
    }
  };

  const variant = error.type === 'api_key' || error.type === 'quota' 
    ? 'destructive' 
    : 'default';

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          {getErrorIcon()}
          {getErrorTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant={variant}>
          <AlertTitle>Error Message</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message}
          </AlertDescription>
          {error.details && (
            <AlertDescription className="mt-2 text-xs text-muted-foreground">
              Details: {error.details}
            </AlertDescription>
          )}
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-medium">What you can do:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {getSuggestions().map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {onDismiss && (
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
        {error.recoverable && onRetry && (
          <Button 
            onClick={onRetry} 
            disabled={isRetrying}
            className="flex-1"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Parse error from API response
 */
export function parsePodcastError(error: unknown): PodcastError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // API key errors
    if (message.includes('api key') || message.includes('unauthorized') || message.includes('murf_tts_key')) {
      return {
        type: 'api_key',
        message: 'API configuration is missing or invalid',
        details: error.message,
        recoverable: false,
      };
    }
    
    // Quota errors
    if (message.includes('quota') || message.includes('rate limit') || message.includes('429')) {
      return {
        type: 'quota',
        message: 'API quota exceeded',
        details: error.message,
        recoverable: false,
      };
    }
    
    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return {
        type: 'network',
        message: 'Network connection error',
        details: error.message,
        recoverable: true,
      };
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid input')) {
      return {
        type: 'validation',
        message: 'Input validation failed',
        details: error.message,
        recoverable: true,
      };
    }
    
    // Generation errors
    if (message.includes('generate') || message.includes('structure') || message.includes('segment')) {
      return {
        type: 'generation',
        message: 'Podcast generation failed',
        details: error.message,
        recoverable: true,
      };
    }
  }
  
  // Unknown error
  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
    details: error instanceof Error ? error.message : String(error),
    recoverable: true,
  };
}

