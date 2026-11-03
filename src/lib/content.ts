import aboutJson from "@/content/about.json";
import contactJson from "@/content/contact.json";
import experienceJson from "@/content/experience.json";
import heroJson from "@/content/hero.json";
import highlightsJson from "@/content/highlights.json";
import projectsJson from "@/content/projects.json";
import siteJson from "@/content/site.json";
import skillsJson from "@/content/skills.json";
import workJson from "@/content/work.json";
import type { IconName } from "@/components/atoms/Icon/Icon";

/** Replaces `{key}` placeholders in a content string. Unknown keys are left as written. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type Profile = {
  name: string;
  greeting: string;
  tagline: string;
  email: string;
  avatar: string;
  avatarAlt: string;
};

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string; icon: IconName };

type SiteContent = {
  metadata: { title: string; description: string };
  profile: Profile;
  socialLinks: SocialLink[];
  navigation: { ariaLabel: string; items: NavItem[] };
  header: { emailAriaLabel: string; openMenuLabel: string; closeMenuLabel: string };
  topButton: { ariaLabel: string; label: string };
  footer: { copyright: string };
};

export type HeroStat = { value: number; suffix: string; label: string };
type HeroContent = { scrollLabel: string; scrollHref: string; graphicScreenTitle: string; stats: HeroStat[] };

type AboutContent = { title: string; paragraphs: string[] };

export type Skill = { name: string; icon: IconName; color: string };
type SkillsContent = { eyebrow: string; title: string; items: Skill[] };

export type ExperienceEntry = {
  company: string;
  /** Omitted when the employer's location isn't known. */
  location?: string;
  position: string;
  period: string;
  highlights: string[];
};
type ExperienceContent = { eyebrow: string; title: string; items: ExperienceEntry[] };

export type Project = {
  title: string;
  /** Card background, chosen to contrast with the logo. */
  color: string;
  /** Logo image path under public/. */
  logo: string;
};
type ProjectsContent = {
  eyebrow: string;
  title: string;
  previousLabel: string;
  nextLabel: string;
  items: Project[];
};

/** A project card in the pinned scroller: a site screenshot. */
export type WorkItem = {
  title: string;
  /** Short factual description of the site, shown in the project modal. */
  description: string;
  /** Live site URL, opened from the project modal. */
  url: string;
  /** Card background shown behind the screenshot. */
  color: string;
  /** Card image: the home page, under public/. */
  image: string;
  /** Desktop gallery shots for the laptop frame, under public/. */
  desktop: string[];
  /** Phone-sized gallery shots for the phone frame, under public/. */
  mobile: string[];
};
type WorkContent = {
  items: WorkItem[];
  modal: {
    /** Card button label. `{title}` is the project name. */
    openLabel: string;
    /** Small hint under the title in the card overlay. */
    hintLabel: string;
    /** Slideshow dot label. `{n}` and `{total}` are filled in. */
    slideLabel: string;
    closeLabel: string;
    viewLabel: string;
    desktopLabel: string;
    mobileLabel: string;
    /** Live site link text. */
    visitLabel: string;
    /** Spoken hint appended to the link name. */
    newTabLabel: string;
  };
};

type HighlightsContent = { title: string };

type ContactField = { label: string; placeholder: string };
type ContactContent = {
  eyebrow: string;
  title: string;
  intentLegend: string;
  intents: { value: string; label: string }[];
  fields: { name: ContactField; email: ContactField; message: ContactField };
  submitLabel: string;
  hint: string;
  mailto: { subject: string; body: string };
};

// Annotating each import checks the JSON shape against its type at build time.
const site: SiteContent = siteJson as SiteContent;
const hero: HeroContent = heroJson;
const about: AboutContent = aboutJson;
const skills: SkillsContent = skillsJson as SkillsContent;
const experience: ExperienceContent = experienceJson;
const projects: ProjectsContent = projectsJson;
const contact: ContactContent = contactJson;
const work: WorkContent = workJson;
const highlights: HighlightsContent = highlightsJson;

export const content = { site, hero, about, skills, experience, projects, work, highlights, contact };

export const profile = site.profile;
// Evaluated once at module load (as before), not per render, so prerendering needs no request-time Date.
export const copyright = fill(site.footer.copyright, { name: profile.name, year: new Date().getFullYear() });
