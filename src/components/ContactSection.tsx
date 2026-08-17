import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { getContactSettings, getSchedule } from "@/lib/settings";

export default async function ContactSection() {
  const [contact, horario] = await Promise.all([
    getContactSettings(),
    getSchedule(),
  ]);

  const cards = [
    { icon: Phone, label: "Llámanos", value: contact.phone, href: contact.phoneHref },
    { icon: MessageCircle, label: "Whatsapéanos", value: contact.whatsapp, href: contact.whatsappHref },
    { icon: Mail, label: "Escríbenos", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Visítanos", value: contact.addressShort, href: contact.mapsUrl },
  ];

  return (
    <section id="contacto" className="scroll-mt-24 bg-cream-deep/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-coral-dark">
          Contáctanos
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-ink sm:text-4xl">
          Estamos aquí para ayudarte
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Tarjetas de contacto */}
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex flex-col gap-2 rounded-2xl border border-cream-deep bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral/15 text-coral-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-slate">{c.label}</span>
                  <span className="text-sm text-warm-gray">{c.value}</span>
                </a>
              );
            })}

            {/* Horario */}
            <div className="rounded-2xl border border-cream-deep bg-white p-5 sm:col-span-2">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-light text-slate">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-slate">Horario</span>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {horario.map((h) => (
                  <div key={h.dia} className="flex justify-between gap-3 border-b border-cream-deep/70 py-1">
                    <dt className="text-warm-gray">{h.dia}</dt>
                    <dd className="text-right font-medium text-slate">{h.horas}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white shadow-sm">
            <iframe
              title="Ubicación de La Fábrica de Sonrisas en Granada"
              src={contact.mapsEmbed}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
