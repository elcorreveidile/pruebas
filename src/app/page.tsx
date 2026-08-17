import Link from "next/link";
import { ArrowRight, Award, HeartHandshake, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import { treatments, getHome } from "@/lib/content";
import ContactSection from "@/components/ContactSection";
import FAQAccordion from "@/components/blocks/FAQAccordion";

const valores = [
  {
    img: "/media/verbena_FABRICASONRISAS_dientes_01.png",
    title: "Enfoque humano y emocional",
    text: "Escuchamos, entendemos y acompañamos. Cuidamos tu bienestar físico y emocional en cada visita.",
  },
  {
    img: "/media/verbena_FABRICASONRISAS_dientes_03.png",
    title: "Honestidad y calidad profesional",
    text: "Odontología integrativa y mínimamente invasiva, con materiales de primer nivel y total transparencia.",
  },
  {
    img: "/media/verbena_FABRICASONRISAS_dientes_04.png",
    title: "Experiencia diferenciadora",
    text: "Un equipo de élite en un ambiente que no te dejará indiferente. Ir al dentista puede ser distinto.",
  },
];

export default function HomePage() {
  const home = getHome();
  const bhaFaqs = (home?.blocks ?? [])
    .filter((b): b is Extract<typeof b, { type: "toggle" }> => b.type === "toggle")
    .map((b) => ({ title: b.title, content: b.content }));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-cream-deep bg-cream-deep/40">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-widest text-coral-dark">
            Clínica dental · {site.city}
          </p>
          <h1 className="animate-fade-in-up mt-4 text-4xl font-bold text-ink sm:text-6xl">
            {site.claim}
          </h1>
          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-warm-gray">
            La Fábrica de Sonrisas es una clínica dental de autor en {site.city}. Odontología
            enfocada al bienestar, honesta y de calidad, en un ambiente que no te dejará indiferente.
          </p>
          <div className="animate-fade-in-up mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/primera-visita"
              className="rounded-full bg-coral px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-coral-dark"
            >
              Pide tu cita
            </Link>
            <Link
              href="#servicios"
              className="rounded-full border border-coral px-8 py-3 font-semibold text-coral-dark transition-colors hover:bg-cream-deep"
            >
              Ver tratamientos
            </Link>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS + VALORES */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
            Quiénes somos
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
            Una clínica dental de autor
          </h2>
          <p className="mt-5 leading-relaxed text-warm-gray">
            La Fábrica de Sonrisas es una clínica dental en Granada de autor creada por la Dra.
            Hunayda BHA, que apareció en el panorama odontológico con una misión muy concreta: hacer
            felices a nuestros pacientes a través de una odontología enfocada al bienestar, honesta y
            de calidad, en un ambiente que no te dejará indiferente.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {valores.map((v) => (
            <div key={v.title} className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.img} alt="" className="mx-auto h-20 w-20 object-contain" />
              <h3 className="mt-4 text-lg font-bold text-coral-dark">{v.title}</h3>
              <p className="mt-2 text-sm text-warm-gray">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="scroll-mt-24 bg-cream-deep/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
              ¿Nos dejas ser tus dentistas?
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              Los servicios de nuestra clínica dental
            </h2>
            <p className="mt-5 leading-relaxed text-warm-gray">
              Entendemos la odontología como una disciplina que mejora la salud general del paciente,
              no solo la bucodental. Contamos con especialistas en todas las áreas: ortodoncia,
              implantes, estética, periodoncia y mucho más.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="group flex flex-col rounded-2xl border border-cream-deep bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {t.icono ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.icono} alt="" className="h-12 w-12 object-contain" />
                  ) : (
                    <Sparkles className="h-10 w-10 text-coral" />
                  )}
                  <h3 className="text-lg font-bold text-ink">{t.nombre}</h3>
                </div>
                <p className="mt-3 flex-1 text-sm text-warm-gray">{t.descripcion}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral-dark">
                  Saber más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO LO HACEMOS (CALMA) */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
          Cómo lo hacemos
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Con calma</h2>
        <p className="mt-5 leading-relaxed text-warm-gray">
          Trabajar con calma nos beneficia a todos. Hacer las cosas con tranquilidad hace que salgan
          mejor, también en la odontología. Dedicamos a cada paciente el tiempo que necesita para una
          buena comunicación, un buen diagnóstico y una correcta planificación.
        </p>
        <p className="mt-4 leading-relaxed text-warm-gray">
          En definitiva, menos pacientes y más tiempo con cada paciente, para poder ponerle a nuestro
          trabajo el alma que necesita.
        </p>
        <p className="mt-6 text-lg font-semibold text-coral-dark">
          Nuestro consejo: llena tu vida de momentos con CALMA.
        </p>
      </section>

      {/* SOLIDARIDAD */}
      <section className="bg-sage-light/40 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/clinica-dental-en-malaga-nuestro-metodo-bha.webp"
            alt="Iniciativas solidarias de La Fábrica de Sonrisas"
            className="w-full rounded-2xl border border-cream-deep sm:w-1/2"
          />
          <div className="sm:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
              Solidarios y sostenibles
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">La solidaridad de nuestra clínica</h2>
            <p className="mt-4 text-warm-gray">
              Descubre nuestras iniciativas solidarias: colaboramos con Cruz Roja, Who Gives A Crap y
              CajaGranada Fundación para crear sonrisas también fuera del sillón dental.
            </p>
            <Link
              href="/solidarios-y-sostenibles"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-white transition-colors hover:bg-coral-dark"
            >
              <HeartHandshake className="h-5 w-5" />
              Quiero saber más
            </Link>
          </div>
        </div>
      </section>

      {/* MÉTODO BHA */}
      <section id="bha" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
              Nuestra filosofía
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">El Método BHA</h2>
            <p className="mt-5 leading-relaxed text-warm-gray">
              Bienestar, Honestidad y Amor: los tres pilares sobre los que trabaja cada miembro de La
              Fábrica. Una filosofía de vida y de trabajo al servicio de tu sonrisa.
            </p>
          </div>
          {bhaFaqs.length > 0 && (
            <div className="mt-10">
              <FAQAccordion items={bhaFaqs} />
            </div>
          )}
        </div>
      </section>

      {/* PREMIOS */}
      <section className="bg-cream-deep/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Award className="mx-auto h-12 w-12 text-coral" />
          <h2 className="mt-4 text-3xl font-bold text-ink">Premios de nuestra clínica dental</h2>
          <p className="mt-4 text-warm-gray">
            Hemos recibido múltiples premios que avalan nuestro compromiso con la calidad y el cuidado
            de nuestros pacientes.
          </p>
          <Link
            href="/medios"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-coral px-6 py-3 font-semibold text-coral-dark transition-colors hover:bg-white"
          >
            Descubre todos nuestros reconocimientos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
          El equipo
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
          Las personas de La Fábrica
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/imagen-nueva-eqipo-la-fabrica-de-sonrisas.png"
          alt="Equipo de La Fábrica de Sonrisas"
          className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-cream-deep"
        />
        <p className="mx-auto mt-8 max-w-2xl text-warm-gray">
          Nos apasiona lo que hacemos y se nota: cada tratamiento es personalizado, adaptado a ti y a
          tu forma de vivir (y de sonreír). Ven a conocernos y verás que ir al dentista puede ser una
          experiencia tan cómoda como divertida.
        </p>
        <Link
          href="/el-equipo"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-white transition-colors hover:bg-coral-dark"
        >
          ¡Conócenos!
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <ContactSection />
    </>
  );
}
