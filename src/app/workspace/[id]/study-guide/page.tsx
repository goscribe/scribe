"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import {
  BookOpen,
  Download,
  MessageSquarePlus,
  Trash2,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { usePusherStudyGuide } from "@/hooks/pusher/use-pusher-study-guide";
import { toast } from "sonner";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { contentToMarkdown, slugify } from "@/lib/study-guide-utils";
import { Textarea } from "@/components/ui/textarea";

// Custom sanitize schema that allows SVG elements but blocks scripts
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "svg", "circle", "rect", "path", "text", "line", "polyline", "polygon",
    "g", "defs", "marker", "style", "title", "desc", "use", "tspan",
    "foreignObject", "ellipse", "clipPath", "linearGradient", "radialGradient",
    "stop", "pattern", "image", "mark", "br", "hr", "span", "div", "sup", "sub",
  ],
  attributes: {
    ...defaultSchema.attributes,
    svg: ["viewBox", "width", "height", "xmlns", "fill", "stroke", "className", "preserveAspectRatio"],
    circle: ["cx", "cy", "r", "fill", "stroke", "strokeWidth", "className"],
    rect: ["x", "y", "width", "height", "rx", "ry", "fill", "stroke", "strokeWidth", "className"],
    path: ["d", "fill", "stroke", "strokeWidth", "className", "markerEnd", "markerStart"],
    text: ["x", "y", "dx", "dy", "textAnchor", "dominantBaseline", "fontSize", "fontFamily", "fill", "className", "transform"],
    line: ["x1", "y1", "x2", "y2", "stroke", "strokeWidth", "className", "markerEnd"],
    polyline: ["points", "fill", "stroke", "strokeWidth", "className"],
    polygon: ["points", "fill", "stroke", "strokeWidth", "className"],
    g: ["transform", "className", "fill", "stroke"],
    defs: [],
    marker: ["id", "viewBox", "refX", "refY", "markerWidth", "markerHeight", "orient", "fill"],
    style: [],
    title: [],
    desc: [],
    use: ["href", "x", "y", "width", "height"],
    tspan: ["x", "y", "dx", "dy", "fill", "className"],
    ellipse: ["cx", "cy", "rx", "ry", "fill", "stroke", "strokeWidth"],
    clipPath: ["id"],
    linearGradient: ["id", "x1", "y1", "x2", "y2", "gradientUnits"],
    radialGradient: ["id", "cx", "cy", "r", "fx", "fy", "gradientUnits"],
    stop: ["offset", "stopColor", "stopOpacity"],
    pattern: ["id", "x", "y", "width", "height", "patternUnits"],
    image: ["href", "x", "y", "width", "height", "preserveAspectRatio"],
    mark: ["className", "style", "data*"],
    span: ["className", "style", "data*"],
    div: ["className", "style"],
    "*": ["id", "className"],
  },
};

// ─── Highlight color palette ────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#FBBF24" },
  { name: "Green", value: "#34D399" },
  { name: "Blue", value: "#60A5FA" },
  { name: "Pink", value: "#F472B6" },
  { name: "Purple", value: "#A78BFA" },
];

// ─── Types ──────────────────────────────────────────────────────────
interface HighlightData {
  id: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  color: string;
  user: { id: string; name: string | null };
  comments: Array<{
    id: string;
    content: string;
    user: { id: string; name: string | null };
    createdAt: string;
  }>;
}

// ─── Selection Popover ──────────────────────────────────────────────
function SelectionPopover({
  position,
  onHighlight,
  onComment,
  onClose,
}: {
  position: { x: number; y: number };
  onHighlight: (color: string) => void;
  onComment: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed z-50 bg-popover border border-border rounded-xl shadow-xl p-2 flex items-center gap-1 backdrop-blur-sm"
      style={{ left: position.x, top: position.y - 50 }}
    >
      {HIGHLIGHT_COLORS.map((c) => (
        <button
          key={c.value}
          className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground/50 hover:scale-110 transition-all"
          style={{ backgroundColor: c.value }}
          onClick={() => onHighlight(c.value)}
          title={`Highlight ${c.name}`}
        />
      ))}
      <div className="w-px h-5 bg-border mx-1" />
      <button
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        onClick={onComment}
        title="Add comment"
      >
        <MessageSquarePlus className="h-4 w-4" />
      </button>
      <button
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        onClick={onClose}
        title="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Highlight Comment Popover ──────────────────────────────────────
function HighlightPopover({
  highlight,
  position,
  onAddComment,
  onDelete,
  onClose,
}: {
  highlight: HighlightData;
  position: { x: number; y: number };
  onAddComment: (highlightId: string, content: string) => void;
  onDelete: (highlightId: string) => void;
  onClose: () => void;
}) {
  const [newComment, setNewComment] = useState("");

  return (
    <div
      className="fixed z-50 bg-popover border border-border rounded-xl shadow-xl p-3 w-72 max-h-80 overflow-y-auto backdrop-blur-sm"
      style={{ left: position.x, top: position.y + 10 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          Highlighted by {highlight.user.name || "Unknown"}
        </span>
        <div className="flex gap-1">
          <button
            className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
            onClick={() => onDelete(highlight.id)}
            title="Delete highlight"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
          <button
            className="p-1 rounded-md hover:bg-muted transition-colors"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p
        className="text-xs italic mb-3 px-2 py-1.5 rounded-md border-l-2"
        style={{ borderColor: highlight.color, backgroundColor: highlight.color + "15" }}
      >
        &ldquo;{highlight.selectedText.slice(0, 100)}
        {highlight.selectedText.length > 100 ? "..." : ""}&rdquo;
      </p>

      {highlight.comments.length > 0 && (
        <div className="space-y-2 mb-3">
          {highlight.comments.map((comment) => (
            <div key={comment.id} className="text-xs bg-muted/50 rounded-md p-2">
              <span className="font-medium">{comment.user.name || "Unknown"}: </span>
              {comment.content}
            </div>
          ))}
        </div>
      )}

      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="text-xs min-h-[60px] resize-none"
      />
      <Button
        size="sm"
        className="w-full mt-1.5 text-xs h-7"
        disabled={!newComment.trim()}
        onClick={() => {
          onAddComment(highlight.id, newComment.trim());
          setNewComment("");
        }}
      >
        Comment
      </Button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function StudyGuidePanel() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const articleRef = useRef<HTMLElement>(null);

  // ── State ───────────────────────────────────────────────────────
  const [selectionPopover, setSelectionPopover] = useState<{
    position: { x: number; y: number };
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<{
    highlight: HighlightData;
    position: { x: number; y: number };
  } | null>(null);
  const [commentMode, setCommentMode] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [pendingHighlightColor, setPendingHighlightColor] = useState<string>("#FBBF24");

  // ── Pusher ──────────────────────────────────────────────────────
  const {
    isConnected,
    isGenerating,
    generationProgress,
    subscribeToStudyGuide,
  } = usePusherStudyGuide(workspaceId);

  const utils = trpc.useUtils();

  // ── Data fetching ───────────────────────────────────────────────
  const { data, isLoading, error } = trpc.studyguide.get.useQuery(
    { workspaceId },
    { enabled: !!workspaceId }
  );

  const guide = data?.latestVersion;
  const artifactVersionId = guide?.id;

  const { data: highlights = [], refetch: refetchHighlights } =
    trpc.annotations.listHighlights.useQuery(
      { artifactVersionId: artifactVersionId! },
      { enabled: !!artifactVersionId }
    );

  const createHighlightMutation = trpc.annotations.createHighlight.useMutation({
    onSuccess: () => {
      refetchHighlights();
      setSelectionPopover(null);
      setCommentMode(false);
      toast.success("Highlight added");
    },
  });

  const deleteHighlightMutation = trpc.annotations.deleteHighlight.useMutation({
    onSuccess: () => {
      refetchHighlights();
      setActiveHighlight(null);
      toast.success("Highlight removed");
    },
  });

  const addCommentMutation = trpc.annotations.addComment.useMutation({
    onSuccess: () => {
      refetchHighlights();
      toast.success("Comment added");
    },
  });

  // ── Subscribe to real-time updates ──────────────────────────────
  useEffect(() => {
    if (isConnected) {
      subscribeToStudyGuide({
        onGenerationStart: () => {
          toast.info("Starting study guide generation...");
        },
        onGenerationComplete: () => {
          toast.success("Study guide generated successfully!");
          utils.studyguide.get.invalidate({ workspaceId });
        },
        onGenerationError: (error) => {
          toast.error(`Generation failed: ${error}`);
        },
      });
    }
  }, [isConnected, subscribeToStudyGuide, utils.studyguide, workspaceId]);

  // ── Convert content to markdown ─────────────────────────────────
  const markdownContent = useMemo(() => {
    if (!guide?.content) return "";
    return contentToMarkdown(guide.content);
  }, [guide?.content]);

  // ── Text selection handler ──────────────────────────────────────
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !articleRef.current) {
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 2) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const preRange = document.createRange();
    preRange.selectNodeContents(articleRef.current);
    preRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preRange.toString().length;
    const endOffset = startOffset + text.length;

    setSelectionPopover({
      position: { x: rect.left + rect.width / 2 - 100, y: rect.top },
      text,
      startOffset,
      endOffset,
    });
    setActiveHighlight(null);
  }, []);

  // ── Highlight creation ──────────────────────────────────────────
  const handleCreateHighlight = useCallback(
    (color: string) => {
      if (!selectionPopover || !artifactVersionId) return;

      if (commentMode) {
        setPendingHighlightColor(color);
        return;
      }

      createHighlightMutation.mutate({
        artifactVersionId,
        startOffset: selectionPopover.startOffset,
        endOffset: selectionPopover.endOffset,
        selectedText: selectionPopover.text,
        color,
      });
      window.getSelection()?.removeAllRanges();
    },
    [selectionPopover, artifactVersionId, commentMode, createHighlightMutation]
  );

  const handleStartComment = useCallback(() => {
    setCommentMode(true);
  }, []);

  const handleSubmitWithComment = useCallback(() => {
    if (!selectionPopover || !artifactVersionId || !commentText.trim()) return;

    createHighlightMutation.mutate(
      {
        artifactVersionId,
        startOffset: selectionPopover.startOffset,
        endOffset: selectionPopover.endOffset,
        selectedText: selectionPopover.text,
        color: pendingHighlightColor,
      },
      {
        onSuccess: (newHighlight) => {
          addCommentMutation.mutate({
            highlightId: newHighlight.id,
            content: commentText.trim(),
          });
          setCommentText("");
          setCommentMode(false);
          window.getSelection()?.removeAllRanges();
        },
      }
    );
  }, [
    selectionPopover,
    artifactVersionId,
    commentText,
    pendingHighlightColor,
    createHighlightMutation,
    addCommentMutation,
  ]);

  // ── PDF export ──────────────────────────────────────────────────
  const handleExportPDF = async () => {
    const element = articleRef.current;
    if (!element) return;
    toast.info("Generating PDF...");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${data?.title || "study-guide"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(element)
        .save();
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  // ── Apply highlights to rendered content ────────────────────────
  const applyHighlightsToDOM = useCallback(() => {
    if (!articleRef.current || !highlights || highlights.length === 0) return;

    articleRef.current.querySelectorAll("mark[data-highlight-id]").forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        parent.normalize();
      }
    });

    const sortedHighlights = [...highlights].sort(
      (a, b) => b.startOffset - a.startOffset
    );

    for (const hl of sortedHighlights) {
      try {
        const walker = document.createTreeWalker(
          articleRef.current,
          NodeFilter.SHOW_TEXT,
          null
        );

        let currentOffset = 0;
        let node: Text | null = null;

        while ((node = walker.nextNode() as Text | null)) {
          const nodeLength = node.textContent?.length || 0;
          const nodeEnd = currentOffset + nodeLength;

          if (currentOffset <= hl.startOffset && nodeEnd >= hl.endOffset) {
            const relStart = hl.startOffset - currentOffset;
            const relEnd = hl.endOffset - currentOffset;
            const range = document.createRange();
            range.setStart(node, relStart);
            range.setEnd(node, Math.min(relEnd, nodeLength));

            const mark = document.createElement("mark");
            mark.setAttribute("data-highlight-id", hl.id);
            mark.style.backgroundColor = hl.color + "40";
            mark.style.borderBottom = `2px solid ${hl.color}`;
            mark.style.cursor = "pointer";
            mark.style.borderRadius = "2px";
            mark.style.padding = "0 1px";

            range.surroundContents(mark);
            break;
          }

          currentOffset = nodeEnd;
        }
      } catch {
        // Skip highlights that can't be applied
      }
    }
  }, [highlights]);

  useEffect(() => {
    const timeout = setTimeout(applyHighlightsToDOM, 300);
    return () => clearTimeout(timeout);
  }, [applyHighlightsToDOM, markdownContent]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mark = target.closest("mark[data-highlight-id]");
      if (mark) {
        const highlightId = mark.getAttribute("data-highlight-id");
        const hl = highlights.find((h) => h.id === highlightId);
        if (hl) {
          setActiveHighlight({
            highlight: hl as unknown as HighlightData,
            position: { x: e.clientX - 140, y: e.clientY },
          });
          setSelectionPopover(null);
        }
      }
    };

    article.addEventListener("click", handleClick);
    return () => article.removeEventListener("click", handleClick);
  }, [highlights]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-highlight-id]") && !target.closest(".fixed")) {
        setActiveHighlight(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Render states ───────────────────────────────────────────────
  if (isLoading || isGenerating) {
    return (
      <LoadingSkeleton
        type="study-guide"
        isGenerating={isGenerating}
        generationProgress={generationProgress}
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Error Loading Study Guide
          </h3>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!guide?.content) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Study Guide Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Upload files to your workspace to generate a study guide.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const uploadInput = document.getElementById("sidebar-file-upload");
                if (uploadInput) uploadInput.click();
              }}
            >
              Upload Files
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto relative">
      {/* Floating buttons */}
      <div className="sticky top-4 z-10 flex justify-end px-8 lg:px-16">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="shadow-lg"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            size="sm"
            onClick={() =>
              router.push(`/workspace/${workspaceId}/study-guide/study`)
            }
            className="shadow-lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Start Studying
          </Button>
        </div>
      </div>

      <ErrorBoundary>
        <article
          ref={articleRef}
          onMouseUp={handleMouseUp}
          className="prose prose-neutral dark:prose-invert max-w-none px-8 py-6 lg:px-16 mt-2"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeRaw,
              [rehypeSanitize, sanitizeSchema],
              rehypeKatex,
            ]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-8 mb-3 pb-2 border-b border-border">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-6 mb-2">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="text-base leading-7 mb-4 text-foreground/90">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-6 mb-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-7 text-foreground/90">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 italic text-muted-foreground bg-muted/30 rounded-r">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-8 border-border" />,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-border rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-border">{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-muted/30 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-sm text-foreground/90">
                  {children}
                </td>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>
      </ErrorBoundary>

      {/* ── Selection Popover ──────────────────────────────────── */}
      {selectionPopover && !commentMode && (
        <SelectionPopover
          position={selectionPopover.position}
          onHighlight={handleCreateHighlight}
          onComment={handleStartComment}
          onClose={() => {
            setSelectionPopover(null);
            window.getSelection()?.removeAllRanges();
          }}
        />
      )}

      {/* ── Comment Mode Popover ───────────────────────────────── */}
      {selectionPopover && commentMode && (
        <div
          className="fixed z-50 bg-popover border border-border rounded-xl shadow-xl p-3 w-72 backdrop-blur-sm"
          style={{
            left: selectionPopover.position.x,
            top: selectionPopover.position.y - 10,
          }}
        >
          <p className="text-xs text-muted-foreground mb-2">
            Highlight &amp; comment on: &ldquo;
            {selectionPopover.text.slice(0, 60)}
            {selectionPopover.text.length > 60 ? "..." : ""}&rdquo;
          </p>
          <div className="flex gap-1 mb-2">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  pendingHighlightColor === c.value
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
                onClick={() => setPendingHighlightColor(c.value)}
              />
            ))}
          </div>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="text-xs min-h-[60px] resize-none mb-2"
            autoFocus
          />
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => {
                setCommentMode(false);
                setSelectionPopover(null);
                window.getSelection()?.removeAllRanges();
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-7"
              disabled={!commentText.trim()}
              onClick={handleSubmitWithComment}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* ── Active Highlight Popover ───────────────────────────── */}
      {activeHighlight && (
        <HighlightPopover
          highlight={activeHighlight.highlight}
          position={activeHighlight.position}
          onAddComment={(highlightId, content) =>
            addCommentMutation.mutate({ highlightId, content })
          }
          onDelete={(highlightId) =>
            deleteHighlightMutation.mutate({ highlightId })
          }
          onClose={() => setActiveHighlight(null)}
        />
      )}
    </div>
  );
}
