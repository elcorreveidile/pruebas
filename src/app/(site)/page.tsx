import Link from "next/link";
import { Sparkles } from "lucide-react";
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
    color: "#d06540",
  },
  {
    img: "/media/verbena_FABRICASONRISAS_dientes_03.png",
    title: "Honestidad y calidad profesional",
    color: "#69826f",
  },
  {
    img: "/media/verbena_FABRICASONRISAS_dientes_04.png",
    title: "Experiencia diferenciadora",
    color: "#658291",
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
      <section className="bg-cream-deep py-40">
        <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-[850px] text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate">
            Clínica dental en Granada: Quiénes somos
          </p>
          <h2 className="font-slab mt-2 text-4xl font-medium text-slate sm:text-5xl">
            Una clínica dental de autor
          </h2>
          <p className="mt-5 leading-relaxed text-warm-gray">
            La Fábrica de Sonrisas es una clínica dental en Granada de autor creada por la Dra.
            Hunayda BHA que apareció en el panorama odontológico con una misión muy concreta: hacer
            felices a nuestros pacientes a través de una odontología enfocada al bienestar, honesta y
            de calidad en un ambiente que no te dejará indiferente.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {valores.map((v) => (
            <div key={v.title} className="mx-auto w-full max-w-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.img}
                alt=""
                className="block w-full object-cover"
                style={{ aspectRatio: "4 / 3" }}
              />
              <h3
                className="font-slab mt-5 border-b border-[#d6cbbb] pb-4 text-center text-lg font-medium tracking-[0.1em]"
                style={{ color: v.color }}
              >
                {v.title}
              </h3>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="scroll-mt-24 bg-coral py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Columna izquierda: texto + foto (fija al hacer scroll) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
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
      <section className="bg-[#dbe4e7] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral-dark">
            Premios de nuestra clínica dental
          </p>
          <h2 className="font-slab mt-3 text-4xl font-medium text-slate sm:text-5xl">
            Reconocidos por la excelencia
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate">
            Hemos recibido múltiples premios que avalan nuestro compromiso con la calidad y el
            cuidado de nuestros pacientes. Descubre todos nuestros reconocimientos.
          </p>
          <Link
            href="/medios"
            className="font-slab mt-7 inline-block border-2 border-slate bg-white/50 px-7 py-3 font-bold text-slate transition-colors hover:bg-white"
          >
            Más información
          </Link>
        </div>
      </section>

      {/* EQUIPO / FABRIEQUIPO */}
      <section className="bg-coral py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/85">
            El Equipo de nuestra clínica dental en Granada
          </p>
          <h2 className="font-slab mt-3 text-4xl font-medium text-white sm:text-5xl">
            FabriEquipo
          </h2>
          <blockquote className="font-slab mx-auto mt-6 max-w-2xl text-lg italic text-white/95">
            «Puedes diseñar y construir el lugar más maravilloso del mundo, pero se necesita gente
            para hacer el sueño realidad»
            <footer className="mt-2 text-sm not-italic text-white/80">– Walt Disney –</footer>
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90">
            En La Fábrica de Sonrisas nos apasiona lo que hacemos y se nota: cada tratamiento es
            personalizado, adaptado a ti y a tu forma de vivir (y de sonreír). Ven a conocernos y
            verás que ir al dentista puede ser una experiencia tan cómoda como divertida. Porque
            aquí, tu sonrisa es cosa seria… pero el ambiente, ¡nunca lo es!
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/imagen-nueva-eqipo-la-fabrica-de-sonrisas.png"
            alt="FabriEquipo de La Fábrica de Sonrisas"
            className="mx-auto mt-8 w-full max-w-3xl rounded-2xl"
          />
          <Link
            href="/el-equipo"
            className="font-slab mt-8 inline-block border-2 border-white bg-white/10 px-7 py-3 font-bold text-white transition-colors hover:bg-white hover:text-coral"
          >
            ¡Conócenos!
          </Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
