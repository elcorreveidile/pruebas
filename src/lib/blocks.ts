import { parse, HTMLElement, TextNode, type Node } from "node-html-parser";
import type { Block } from "@/types";

/**
 * Conversión entre el modelo de bloques (Block[]) y HTML, para el editor
 * visual (TipTap). El editor trabaja en HTML; al guardar lo convertimos a
 * bloques (los mismos que renderiza el sitio) y al cargar hacemos lo inverso.
 */

// Etiquetas en línea permitidas dentro de un párrafo.
const INLINE_ALLOWED = new Set(["STRONG", "B", "EM", "I", "A", "BR", "U"]);

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function safeHref(url: string): string | null {
  const u = (url ?? "").trim();
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u) ? u : null;
}

/** Serializa el contenido en línea de un nodo dejando solo etiquetas seguras. */
function serializeInline(node: Node): string {
  let out = "";
  for (const child of node.childNodes) {
    if (child instanceof TextNode) {
      out += escapeHtml(child.rawText);
    } else if (child instanceof HTMLElement) {
      const tag = child.tagName?.toUpperCase();
      if (tag && INLINE_ALLOWED.has(tag)) {
        if (tag === "BR") {
          out += "<br>";
        } else if (tag === "A") {
          const href = safeHref(child.getAttribute("href") ?? "");
          const inner = serializeInline(child);
          out += href
            ? `<a href="${href}" class="text-coral-dark underline">${inner}</a>`
            : inner;
        } else {
          out += `<${tag.toLowerCase()}>${serializeInline(child)}</${tag.toLowerCase()}>`;
        }
      } else {
        // Etiqueta no permitida: conserva solo su contenido.
        out += serializeInline(child);
      }
    }
  }
  return out.trim();
}

/** Convierte el HTML del editor en la lista de bloques del sitio. */
export function htmlToBlocks(html: string): Block[] {
  const root = parse(html ?? "", { comment: false });
  const blocks: Block[] = [];
  walk(root, blocks);
  return blocks;
}

function walk(parent: Node, blocks: Block[]): void {
  for (const node of parent.childNodes) {
    if (node instanceof TextNode) {
      const t = node.rawText.trim();
      if (t) blocks.push({ type: "paragraph", text: t, html: escapeHtml(t) });
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    const tag = node.tagName?.toUpperCase();

    switch (tag) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6": {
        const text = node.text.trim();
        if (text) blocks.push({ type: "heading", level: Number(tag[1]), text });
        break;
      }
      case "P": {
        const text = node.text.trim();
        const inner = serializeInline(node);
        if (text || node.querySelector("img")) {
          const img = node.querySelector("img");
          if (img && !text) {
            blocks.push({
              type: "image",
              src: img.getAttribute("src") ?? "",
              alt: img.getAttribute("alt") ?? undefined,
            });
          } else if (text) {
            blocks.push({ type: "paragraph", text, html: inner });
          }
        }
        break;
      }
      case "UL":
      case "OL": {
        const items = node
          .querySelectorAll("li")
          .map((li) => li.text.trim())
          .filter(Boolean);
        if (items.length) blocks.push({ type: "list", ordered: tag === "OL", items });
        break;
      }
      case "IMG":
        blocks.push({
          type: "image",
          src: node.getAttribute("src") ?? "",
          alt: node.getAttribute("alt") ?? undefined,
        });
        break;
      case "FIGURE": {
        const img = node.querySelector("img");
        if (img) {
          blocks.push({
            type: "image",
            src: img.getAttribute("src") ?? "",
            alt: img.getAttribute("alt") ?? undefined,
          });
        }
        break;
      }
      case "BLOCKQUOTE": {
        const text = node.text.trim();
        if (text) blocks.push({ type: "paragraph", text, html: serializeInline(node) });
        break;
      }
      case "DIV":
      case "SECTION":
      case "ARTICLE":
        walk(node, blocks); // recorre contenedores
        break;
      default: {
        // Otros bloques: intenta rescatar el texto como párrafo.
        const text = node.text.trim();
        if (text) blocks.push({ type: "paragraph", text, html: serializeInline(node) });
      }
    }
  }
}

/** Convierte los bloques del sitio en HTML para precargar el editor. */
export function blocksToHtml(blocks: Block[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "heading": {
        const level = Math.min(Math.max(b.level, 1), 4);
        // El H1 lo pinta el hero; en el editor lo tratamos como H2.
        const tag = level <= 1 ? "h2" : `h${level}`;
        parts.push(`<${tag}>${escapeHtml(b.text)}</${tag}>`);
        break;
      }
      case "paragraph":
        parts.push(`<p>${b.html ?? escapeHtml(b.text)}</p>`);
        break;
      case "list": {
        const tag = b.ordered ? "ol" : "ul";
        parts.push(
          `<${tag}>${b.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</${tag}>`,
        );
        break;
      }
      case "image":
        parts.push(`<img src="${b.src}" alt="${escapeHtml(b.alt ?? "")}">`);
        break;
      case "button": {
        const href = safeHref(b.href ?? "#") ?? "#";
        parts.push(`<p><a href="${href}">${escapeHtml(b.text)}</a></p>`);
        break;
      }
      case "blurb":
        parts.push(`<h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.desc)}</p>`);
        break;
      case "toggle":
        parts.push(`<h3>${escapeHtml(b.title)}</h3><p>${b.html ?? escapeHtml(b.content)}</p>`);
        break;
      case "video":
        break;
    }
  }
  return parts.join("\n");
}
