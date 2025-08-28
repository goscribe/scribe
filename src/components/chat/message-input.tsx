"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  onTypingChange,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [content]);

  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (content.trim()) {
      setIsTyping(true);
      onTypingChange?.(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTypingChange?.(false);
      }, 1000);
    } else {
      setIsTyping(false);
      onTypingChange?.(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [content, onTypingChange]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onSendMessage(content);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    
    // If pasting a URL, format it as a link
    if (pastedText.match(/^https?:\/\//)) {
      e.preventDefault();
      const linkText = `[${pastedText}](${pastedText})`;
      setContent(prev => prev + linkText);
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={cn(
            "min-h-[44px] max-h-[120px] resize-none pr-12",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",
            "border-border bg-background",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          rows={1}
        />
        
        {/* Emoji button (placeholder for future implementation) */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 bottom-2 h-6 w-6 p-0 opacity-50 hover:opacity-100"
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || isSubmitting || disabled}
        size="sm"
        className="h-10 w-10 p-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
