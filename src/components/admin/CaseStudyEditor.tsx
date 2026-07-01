"use client";

import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";
import { useEffect } from "react";

type CaseStudyEditorProps = {
  readonly content: string;
  readonly onChange: (html: string) => void;
  readonly placeholder?: string;
};

const toolbarButtonClass =
  "inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md border border-slate/20 bg-white text-deep-navy transition hover:border-sc-copper/40 hover:bg-off-white disabled:opacity-40";

const toolbarButtonActiveClass =
  "border-sc-copper/40 bg-sc-copper/10 text-deep-navy";

const editorSurfaceClass =
  "case-study-tiptap [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-deep-navy [&_.ProseMirror]:outline-none [&_.ProseMirror_a]:text-sc-copper [&_.ProseMirror_a]:underline [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-text-secondary [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5";

function normalizeEditorHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>" || trimmed === "<br>") {
    return "";
  }
  return trimmed;
}

function ToolbarButton({
  label,
  pressed,
  onClick,
  children,
}: {
  readonly label: string;
  readonly pressed?: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${toolbarButtonClass}${pressed ? ` ${toolbarButtonActiveClass}` : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed ?? false}
    >
      {children}
    </button>
  );
}

export function CaseStudyEditor({ content, onChange, placeholder }: CaseStudyEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(normalizeEditorHtml(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const currentHtml = normalizeEditorHtml(editor.getHTML());
    const nextHtml = normalizeEditorHtml(content);
    if (currentHtml !== nextHtml) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  const addLink = () => {
    if (!editor) {
      return;
    }
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter Link URL (https://...)", previousUrl ?? "https://");
    if (url === null) {
      return;
    }
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  if (!editor) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate/25 bg-white shadow-sm">
        <div className="border-b border-slate/15 bg-off-white px-2 py-2">
          <div className="h-9 w-48 animate-pulse rounded-md bg-slate/10" />
        </div>
        <div className="min-h-[140px] animate-pulse bg-off-white" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate/25 bg-white shadow-sm">
      <div className="flex flex-wrap gap-1 border-b border-slate/15 bg-off-white px-2 py-2">
        <ToolbarButton
          label="Bold"
          pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Bulleted list"
          pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          pressed={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Add link" pressed={editor.isActive("link")} onClick={addLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className={editorSurfaceClass} />
    </div>
  );
}
