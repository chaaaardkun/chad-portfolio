import { About } from "@/components/organisms/About/About";
import { Contact } from "@/components/organisms/Contact/Contact";
import { Experience } from "@/components/organisms/Experience/Experience";
import { Footer } from "@/components/organisms/Footer/Footer";
import { Header } from "@/components/organisms/Header/Header";
import { Hero } from "@/components/organisms/Hero/Hero";
import { HorizontalScroller } from "@/components/organisms/HorizontalScroller/HorizontalScroller";
import { Loader } from "@/components/organisms/Loader/Loader";
import { Projects } from "@/components/organisms/Projects/Projects";
import { SideNav } from "@/components/organisms/SideNav/SideNav";
import { Skills } from "@/components/organisms/Skills/Skills";
import { SmoothScroller } from "@/components/organisms/SmoothScroller/SmoothScroller";
import { TopButton } from "@/components/organisms/TopButton/TopButton";

export function PortfolioTemplate() {
  return (
    <>
      <Loader />
      <Header />
      <SideNav />
      <TopButton />
      <SmoothScroller>
        <main>
          <Hero />
          <About />
          <HorizontalScroller />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </SmoothScroller>
    </>
  );
}
