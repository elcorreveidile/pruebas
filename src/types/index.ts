/** Tipos compartidos del sitio. Se ampliarán al modelar el contenido real. */

export interface Treatment {
  slug: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precioDesde?: number;
}

export interface Lead {
  nombre: string;
  telefono: string;
  email?: string;
  motivo?: string;
  mensaje?: string;
}
