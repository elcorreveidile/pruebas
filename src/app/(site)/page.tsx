import Link from "next/link";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import { treatments } from "@/lib/content";
import { getHomeBlocks } from "@/lib/pages";
import ContactSection from "@/components/ContactSection";
import FAQAccordion from "@/components/blocks/FAQAccordion";

export const revalidate = 60;

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

export default async function HomePage() {
  const homeBlocks = await getHomeBlocks();
  const bhaFaqs = homeBlocks
    .filter((b): b is Extract<typeof b, { type: "toggle" }> => b.type === "toggle")
    .map((b) => ({ title: b.title, content: b.content }));

  return (
    <>
      {/* HERO (réplica del sitio original) */}
      <section
        className="relative flex min-h-[620px] items-center overflow-hidden bg-white md:min-h-[780px] lg:min-h-[88vh]"
        style={{
          backgroundImage:
            "linear-gradient(86deg, #ffffff 0%, rgba(41,196,169,0) 71%), url('/media/hero-home.webp')",
          backgroundSize: "cover, 118%",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-8 py-20">
          <div className="max-w-xl">
            <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-wide text-slate">
              Clínica dental en {site.city}
            </p>
            <h1
              className="font-slab animate-fade-in-up mt-4 text-5xl font-medium leading-[1.08] text-slate sm:text-6xl lg:text-[80px]"
            >
              {site.claim}
            </h1>
            <div className="animate-fade-in-up mt-8">
              <Link
                href="/contacto"
                className="font-slab inline-block border-2 border-slate bg-white/60 px-8 py-3 font-bold text-slate transition-colors hover:bg-white"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS + VALORES */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">
            Quiénes somos
          </p>
          <h2 className="font-slab mt-2 text-4xl font-medium text-slate sm:text-5xl">
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
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="scroll-mt-24 bg-coral py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Columna izquierda: texto + foto de la doctora */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/85">
                Los servicios de nuestra clínica dental en Granada
              </p>
              <h2 className="font-slab mt-3 text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
                ¿Nos dejas ser tus dentistas?
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/90">
                <p>
                  En nuestra clínica dental en Granada entendemos la odontología como una disciplina
                  que se encarga de mejorar la salud general del paciente, no solo la bucodental.
                  Contamos con especialistas en todas las áreas (ortodoncia, implantes, estética,
                  periodoncia, etc.) porque, para llevar a cabo nuestra misión de haceros felices y
                  más saludables, nuestra metodología de trabajo se basa en una odontología
                  integrativa y mínimamente invasiva.
                </p>
                <p>
                  Para muchas personas, visitar al dentista supone una situación de ansiedad y
                  estrés, por eso nos esforzamos al máximo por escucharte, entenderte y ofrecerte
                  realmente lo que necesitas.
                </p>
                <p>
                  Si buscas una clínica dental en Granada diferente, donde se haga odontología de
                  alto nivel, con un equipo de élite y en un ambiente que no te dejará indiferente,
                  este es tu sitio. Mándanos un WhatsApp, llámanos o pásate por aquí, estaremos
                  encantados de ser tus dentistas.
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/como-lo-hacemos-fabrica-de-sonrisas.webp"
                alt="Nuestra clínica dental en Granada"
                className="mt-8 w-full rounded-2xl object-cover"
              />
            </div>

            {/* Columna derecha: tarjetas apiladas */}
            <div className="space-y-4">
              {treatments.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="group block rounded-2xl bg-white/90 p-6 transition-all hover:bg-white hover:shadow-lg"
                >
                  {t.icono ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.icono} alt="" className="h-12 w-12 object-contain" />
                  ) : (
                    <Sparkles className="h-10 w-10 text-coral" />
                  )}
                  <h3 className="mt-3 text-lg font-bold text-slate">{t.nombre}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate/80">{t.descripcion}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO LO HACEMOS (CALMA) */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral-dark">
            Cómo lo hacemos en nuestra clínica dental en Granada
          </p>
          <h2 className="font-slab mt-3 text-4xl font-medium text-slate sm:text-5xl">Con calma</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-warm-gray">
            <p>
              Ya sabéis qué hacemos, ahora os vamos a explicar cómo lo hacemos… Trabajar con calma
              nos beneficia a todos. En estos tiempos tan frenéticos que vivimos, hacer las cosas con
              tranquilidad hace que salgan mejor, también en la odontología.
            </p>
            <p>
              Creemos que es de suma importancia que os podamos dedicar el tiempo que necesitáis para
              que haya una buena comunicación, un buen diagnóstico y una correcta planificación que
              simplifique el número de visitas y aumente nuestra capacidad de concentración,
              garantizando así el éxito del tratamiento.
            </p>
            <p>
              En definitiva, menos pacientes y más tiempo con cada paciente. Más tiempo con cada uno
              de vosotros, para poder ponerle a nuestro trabajo el alma que necesita.
            </p>
            <p className="text-lg font-semibold text-coral-dark">
              Nuestro consejo: llena tu vida de momentos con CALMA.
            </p>
          </div>
        </div>
      </section>

      {/* SOLIDARIDAD */}
      <section className="bg-sage-light py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral-dark">
            La solidaridad de nuestra clínica dental en Granada
          </p>
          <h2 className="font-slab mt-3 text-4xl font-medium text-slate sm:text-5xl">
            Solidarios y sostenibles
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate">
            Descubre nuestras iniciativas solidarias.
          </p>
          <Link
            href="/solidarios-y-sostenibles"
            className="font-slab mt-7 inline-block border-2 border-sage bg-cream-card px-7 py-3 font-bold text-sage transition-colors hover:bg-white"
          >
            Quiero saber más
          </Link>
        </div>
      </section>

      {/* MÉTODO BHA */}
      <section id="bha" className="scroll-mt-24 bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/clinica-dental-en-malaga-nuestro-metodo-bha.webp"
              alt="El Método BHA de La Fábrica de Sonrisas"
              className="w-full rounded-2xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-coral-dark">
                Clínica dental en Granada
              </p>
              <h2 className="font-slab mt-3 text-4xl font-medium text-slate sm:text-5xl">
                El Método BHA
              </h2>
              {bhaFaqs.length > 0 && (
                <div className="mt-6">
                  <FAQAccordion items={bhaFaqs} />
                </div>
              )}
            </div>
          </div>
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
