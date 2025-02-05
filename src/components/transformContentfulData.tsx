import {
  Achievement,
  Education,
  Experience,
  Project,
  Skill,
} from "../interfaces";

interface PortfolioData {
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

const transformContentfulData = (contentfulResponse: any): PortfolioData => {
  // Find the main portfolio entry
  const portfolioEntry = contentfulResponse.items.find(
    (item: any) => item.sys.contentType.sys.id === "portfolio"
  );

  if (!portfolioEntry) {
    throw new Error("Portfolio entry not found in Contentful response");
  }

  const fields = portfolioEntry.fields;

  // Helper function to resolve linked entries
  const resolveReference = (entryId: string) => {
    return contentfulResponse.includes.Entry.find(
      (entry: any) => entry.sys.id === entryId
    )?.fields;
  };

  // Transform experiences
  const experiences: Experience[] = (fields.experiences || []).map(
    (expRef: any) => {
      const exp = resolveReference(expRef.sys.id);
      return {
        company: exp.company || "",
        position: exp.position || "",
        duration: exp.duration || "",
        location: exp.location || "",
        responsibilities: exp.responsibilities || [],
      };
    }
  );

  // Transform projects
  const projects: Project[] = (fields.projects || []).map((projRef: any) => {
    const proj = resolveReference(projRef.sys.id);
    return {
      title: proj.title || "",
      description: proj.description || "",
      link: proj.link || "",
      technologies: proj.technologies || [],
    };
  });

  // Transform education
  const education: Education[] = (fields.education || []).map((eduRef: any) => {
    const edu = resolveReference(eduRef.sys.id);
    return {
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      coursework: edu.coursework || [],
    };
  });

  // Transform achievements
  const achievements: Achievement[] = (fields.achievements || []).map(
    (achieveRef: any) => {
      const achieve = resolveReference(achieveRef.sys.id);
      return {
        id: achieveRef.sys.id,
        description: achieve.description || "",
      };
    }
  );

  // Transform skills
  const skills: Skill[] = (fields.skills || []).map((skillRef: any) => {
    const skill = resolveReference(skillRef.sys.id);
    return {
      category: skill.category || "",
      items: skill.items || [],
    };
  });

  // Transform personal info
  const personalInfo = {
    name: fields.name || "",
    title: fields.title || "",
    email: fields.email || "",
    phone: fields.phone || "",
    linkedin: fields.linkedin || "",
    github: fields.github || "",
  };

  return {
    experiences,
    projects,
    education,
    achievements,
    skills,
    personalInfo,
  };
};

export default transformContentfulData;
