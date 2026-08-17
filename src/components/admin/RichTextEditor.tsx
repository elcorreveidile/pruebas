"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Quote,
} from "lucide-react";

/**
 * Editor visual (WYSIWYG) para el contenido del blog. No usa markdown:
 * el usuario da formato con la barra de herramientas. El HTML resultante se
 * sincroniza en un input oculto llamado `body` para enviarlo con el formulario.
 */
export default function RichTextEditor({ initialHTML }: { initialHTML: string }) {
  const [html, setHtml] = useState(initialHTML);

  const editor = useEditor({
    immediatelyRender: false, // evita desajustes de hidratación en Next
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: initialHTML || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[360px] rounded-b-xl border border-t-0 border-cream-deep bg-white px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div>
      <input type="hidden" name="body" value={html} />
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <EditorStyles />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL de la imagen:", "/media/");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-cream-deep bg-cream-deep/40 px-2 py-1.5">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrita">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Cursiva">
        <Italic className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Subtítulo">
        <Heading3 className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
        <List className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Cita">
        <Quote className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn onClick={setLink} active={editor.isActive("link")} title="Enlace">
        <Link2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Quitar enlace">
        <Link2Off className="h-4 w-4" />
      </Btn>
      <Btn onClick={addImage} title="Imagen">
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
        <Redo2 className="h-4 w-4" />
      </Btn>
    </div>
  );
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // Evita que el botón robe el foco/selección al editor al pulsarlo.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors " +
        (active ? "bg-coral text-white" : "text-slate hover:bg-white")
      }
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-cream-deep" />;
}

function EditorStyles() {
  return (
    <style>{`
      .prose-editor { color: var(--ink); font-size: 0.95rem; line-height: 1.65; }
      .prose-editor:focus { border-color: var(--coral); }
      .prose-editor p { margin: 0 0 0.75rem; }
      .prose-editor h2 { font-size: 1.4rem; font-weight: 700; margin: 1.2rem 0 0.5rem; color: var(--ink); }
      .prose-editor h3 { font-size: 1.15rem; font-weight: 700; margin: 1rem 0 0.4rem; color: var(--coral-dark); }
      .prose-editor ul { list-style: disc; padding-left: 1.4rem; margin: 0 0 0.75rem; }
      .prose-editor ol { list-style: decimal; padding-left: 1.4rem; margin: 0 0 0.75rem; }
      .prose-editor li { margin: 0.15rem 0; }
      .prose-editor a { color: var(--coral-dark); text-decoration: underline; }
      .prose-editor blockquote { border-left: 3px solid var(--coral-soft); padding-left: 0.9rem; color: var(--warm-gray); margin: 0 0 0.75rem; }
      .prose-editor img { max-width: 100%; border-radius: 0.75rem; margin: 0.5rem 0; }
      .prose-editor p.is-editor-empty:first-child::before {
        content: "Escribe el contenido…"; color: var(--warm-gray); float: left; height: 0; pointer-events: none;
      }
    `}</style>
  );
}
