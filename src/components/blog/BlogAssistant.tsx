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
import { SEARCHING_STATUS, answerFromPost } from "@/src/lib/postQA";

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

function createAdapter(excerpt: string): ChatModelAdapter {
  return {
    async *run({ messages }) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const question = lastUser ? getMessageText(lastUser) : "";

      yield {
        content: [{ type: "text", text: SEARCHING_STATUS }],
      };

      if (!question) {
        yield {
          content: [
            {
              type: "text",
              text: "I can only answer questions about this blog post, and I couldn't find that in it.",
            },
          ],
        };
        return;
      }

      try {
        const answer = await answerFromPost(question, excerpt);
        yield {
          content: [{ type: "text", text: answer }],
        };
      } catch {
        yield {
          content: [
            {
              type: "text",
              text: "Something went wrong while searching this post. Please try again.",
            },
          ],
        };
      }
    },
  };
}

const BlogAssistantRuntime: FC<{ excerpt: string }> = ({ excerpt }) => {
  const adapter = useMemo(() => createAdapter(excerpt), [excerpt]);
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

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return <BlogAssistantRuntime excerpt={post.excerpt} />;
};
