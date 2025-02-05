// Types for our Contentful data
export interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  responsibilities: string[];
}

export interface Project {
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  coursework: string[];
}

export interface Achievement {
  id: string;
  description: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface PortfolioData {
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  achievements: Achievement[];
  skills: Skill[];
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
}
