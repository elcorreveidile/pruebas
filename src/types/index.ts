/** Tipos del modelo de contenido migrado desde WordPress (Divi). */

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string; html?: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "image"; src: string; alt?: string; srcset?: string | null }
  | {
      type: "blurb";
      title: string;
      desc: string;
      img?: string | null;
      alt?: string;
      href?: string | null;
    }
  | { type: "button"; text: string; href?: string | null }
  | { type: "toggle"; title: string; content: string; html?: string }
  | { type: "video"; src?: string | null };

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  blocks: Block[];
}

export interface Treatment {
  slug: string;
  nombre: string;
  descripcion: string;
  icono?: string | null;
}

export interface Lead {
  nombre: string;
  telefono: string;
  email?: string;
  motivo?: string;
  mensaje?: string;
}
