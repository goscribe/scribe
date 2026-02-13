"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useSession } from "@/lib/useSession";

export function VerifyEmailBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  const resendMutation = trpc.auth.resendVerification.useMutation({
    onSuccess: () => {
      toast.success("Verification email sent! Check your inbox.");
      setSending(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send email");
      setSending(false);
    },
  });

  // Don't show if: no session, already verified, or dismissed
  if (!session?.user || session.user.emailVerified || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
      <div className="flex items-center justify-center gap-3 text-sm">
        <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-amber-800 dark:text-amber-200">
          Please verify your email address.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
          disabled={sending}
          onClick={() => {
            setSending(true);
            resendMutation.mutate();
          }}
        >
          {sending ? "Sending..." : "Resend email"}
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
