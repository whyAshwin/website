import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Bento } from "@/components/bento";
import { Projects } from "@/components/projects";
import { Playground } from "@/components/playground";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Hero />
      <Stats />
      <Bento />
      <Projects />
      <Experience />
      <Education />
      <Contact />
      {/* The playground closes the page: read the work, then play with two
          products. Keep it after Contact — and keep the footer after it. */}
      <Playground />
      <Footer />
    </main>
  );
}
