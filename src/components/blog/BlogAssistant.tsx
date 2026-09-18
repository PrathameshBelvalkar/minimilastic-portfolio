import { useEffect, useMemo, useState, type FC } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage,
} from "@assistant-ui/react";
import { AssistantModal } from "@/src/components/assistant-ui/elements/assistant-modal.aui";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import type { BlogPost } from "@/src/blog";
import {
  LOADING_STATUS,
  formatAssistantError,
  streamAnswerFromPost,
} from "@/src/lib/postQA";

type BlogAssistantProps = {
  post: BlogPost;
};

function getMessageText(message: ThreadMessage): string {
  if (!("content" in message) || !Array.isArray(message.content)) return "";
  return message.content
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function buildPostFallback(post: BlogPost): string {
  return [`Title: ${post.title}`, post.excerpt].filter(Boolean).join("\n\n");
}

function createAdapter(postContent: string): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const question = lastUser ? getMessageText(lastUser) : "";

      yield {
        content: [{ type: "text", text: LOADING_STATUS }],
      };

      try {
        let last = "";
        for await (const chunk of streamAnswerFromPost(
          question,
          postContent,
          abortSignal,
        )) {
          if (abortSignal?.aborted) return;
          const text = chunk.trim();
          if (!text || text === last) continue;
          last = text;
          yield {
            content: [{ type: "text", text }],
          };
        }
        if (!last) {
          yield {
            content: [
              {
                type: "text",
                text: "Hi! Ask me anything about this post, or just say hello.",
              },
            ],
          };
        }
      } catch (err) {
        yield {
          content: [
            {
              type: "text",
              text: formatAssistantError(err),
            },
          ],
        };
      }
    },
  };
}

const BlogAssistantRuntime: FC<{ postContent: string }> = ({ postContent }) => {
  const adapter = useMemo(() => createAdapter(postContent), [postContent]);
  const runtime = useLocalRuntime(adapter);

  return (
    <TooltipProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <AssistantModal />
      </AssistantRuntimeProvider>
    </TooltipProvider>
  );
};

export const BlogAssistant: FC<BlogAssistantProps> = ({ post }) => {
  const [ready, setReady] = useState(false);
  const postContent = useMemo(() => buildPostFallback(post), [post]);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return <BlogAssistantRuntime postContent={postContent} />;
};
