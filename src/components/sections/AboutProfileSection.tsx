import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutProfileSection() {
  return (
    <section className="mb-32 md:mb-48 border-t border-theme pt-8 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-label mb-12">About / Profile</h2>
        <div className="w-full h-[1px] bg-theme mb-12 md:mb-24 opacity-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col justify-between gap-12 lg:gap-24">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight max-w-2xl">
              Over the years, I have worked on customer-facing products with a strong focus on excellent user
              experience and accessibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 text-sm">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Product Development</p>
                <p className="font-medium">UX/UI & Design</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="opacity-40">Say hello</p>
                <a
                  href="mailto:hello@alexcarter.dev"
                  className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity self-start"
                >
                  hello@alexcarter.dev
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium opacity-40">LinkedIn</p>
                <a
                  href="#"
                  className="border-b border-[var(--color-text)] pb-0.5 hover:opacity-50 transition-opacity flex items-center gap-1 self-start"
                >
                  Explore LinkedIn <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 text-lg md:text-xl opacity-80 font-light leading-relaxed">
            <p>
              Self-taught software engineer with a strong knowledge of TypeScript, Swift, and Java. I am
              passionate about working on meaningful projects that have a positive impact on people's lives.
            </p>
            <p>
              I have hands-on experience working on high-traffic, customer-facing products and prioritize
              building clean, maintainable codebases that enable continuous improvement and scalability.
            </p>
            <p>
              I hold a Bachelor of Business Administration from Hult International Business School in London
              and an International Baccalaureate from Leysin American School in Switzerland.
            </p>
            <p>
              I am fluent in English and Russian and have experience working and studying in an international
              environment.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

