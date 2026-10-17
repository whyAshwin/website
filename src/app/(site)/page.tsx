import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Bento } from "@/components/bento";
import { Projects } from "@/components/projects";
import { PMSimulator } from "@/components/pm-simulator";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Hero />
      <Stats />
      <PMSimulator />
      <Bento />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </main>
  );
}
