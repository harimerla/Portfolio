import React, { useState, useEffect } from "react";
import { createClient, Entry } from "contentful";
import backupData from "../output.json";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Flex,
  IconButton,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import {
  FaBriefcase,
  FaGraduationCap,
  FaAward,
  FaFolder,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";

// Interfaces
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

interface Experience {
  position: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  coursework: string[];
}

interface Project {
  title: string;
  description: string;
  link: string;
}

interface Achievement {
  description: string;
}

interface PortfolioData {
  personalInfo?: PersonalInfo;
  experiences?: Experience[];
  education?: Education[];
  projects?: Project[];
  achievements?: Achievement[];
}

const transformContentfulData = (data: {
  items: Entry<any>[];
}): PortfolioData => {
  const items = data.items;
  return {
    personalInfo: items.find(
      (item) => item.sys.contentType.sys.id === "personalInfo"
    )?.fields as unknown as PersonalInfo,
    experiences: items
      .filter((item) => item.sys.contentType.sys.id === "experiences")
      .map((item) => item.fields as unknown as Experience)
      .sort(
        (a, b) =>
          new Date(b.duration.split(" - ")[0]).getTime() -
          new Date(a.duration.split(" - ")[0]).getTime()
      ),
    education: items
      .filter((item) => item.sys.contentType.sys.id === "education")
      .map((item) => item.fields as unknown as Education)
      .sort((a, b) => b.degree.localeCompare(a.degree)),
    projects: items
      .filter((item) => item.sys.contentType.sys.id === "project")
      .map((item) => item.fields as unknown as Project),
    achievements: items
      .filter((item) => item.sys.contentType.sys.id === "achievement")
      .map((item) => item.fields as unknown as Achievement),
  };
};

const Section: React.FC<{
  icon: any;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <VStack align="stretch" spacing={6} w="full">
    <HStack
      spacing={3}
      borderBottom="2px"
      borderColor="rgba(255,255,255,0.1)"
      pb={4}
    >
      <Icon as={icon} color="#60A5FA" boxSize={6} />
      <Heading size="lg" color="white">
        {title}
      </Heading>
    </HStack>
    {children}
  </VStack>
);

const ExperienceCard: React.FC<Experience> = ({
  position,
  company,
  location,
  duration,
  responsibilities,
}) => (
  <Box
    w="full"
    bg="#111827"
    borderRadius="xl"
    border="1px solid"
    borderColor="rgba(255,255,255,0.1)"
    p={6}
    _hover={{
      transform: "translateY(-4px)",
      borderColor: "#60A5FA",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}
    transition="all 0.3s"
  >
    <VStack align="start" spacing={4}>
      <HStack
        w="full"
        justify="space-between"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap={3}
      >
        <Box>
          <Text color="blue.400" mb={1}>
            {company}
          </Text>
          <Heading size="lg" color="white" mb={2}>
            {position}
          </Heading>
        </Box>
        <HStack spacing={3}>
          <Badge bg="#1E293B" color="#60A5FA" p={2} borderRadius="md">
            {location}
          </Badge>
          <Badge bg="#1E293B" color="#818CF8" p={2} borderRadius="md">
            {duration}
          </Badge>
        </HStack>
      </HStack>
      <VStack align="start" spacing={3} w="full">
        {responsibilities.map((item, idx) => (
          <HStack
            key={idx}
            spacing={3}
            p={3}
            w="full"
            borderRadius="md"
            _hover={{ bg: "#1E293B" }}
            transition="all 0.2s"
          >
            <Icon as={FaChevronRight} color="#60A5FA" boxSize={4} />
            <Text color="gray.300">{item}</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  </Box>
);

const ProjectCard: React.FC<Project> = ({ title, description, link }) => (
  <Card
    bg="#111827"
    border="1px solid"
    borderColor="rgba(255,255,255,0.1)"
    _hover={{
      transform: "translateY(-4px)",
      borderColor: "#60A5FA",
      shadow: "lg",
    }}
    transition="all 0.3s"
    h="full"
  >
    <CardBody p={6}>
      <VStack align="start" spacing={4} h="full">
        <Link
          href={link}
          isExternal
          _hover={{ color: "#60A5FA" }}
          transition="all 0.2s"
        >
          <Heading size="md" color="white">
            {title}
          </Heading>
        </Link>
        <Text color="gray.400" flex="1">
          {description}
        </Text>
      </VStack>
    </CardBody>
  </Card>
);

const Portfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = createClient({
          space: "ay0wtpjewurt",
          accessToken: "-r_wGRAg9Bk6By06BePLiHdZu4qe37i4E5X9MsW6cXs",
        });

        const response = await client.getEntries();
        const transformedData = transformContentfulData(response);
        setPortfolioData(transformedData);
        setLoading(false);
      } catch (err) {
        console.log("Contentful API failed, using backup data");
        setPortfolioData(backupData as PortfolioData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#0A0F1E">
        <VStack spacing={4}>
          <Spinner size="xl" color="#60A5FA" thickness="4px" />
          <Text color="white">Loading portfolio...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="#0A0F1E">
      <Container
        maxW={{ base: "95%", md: "90%", lg: "85%", xl: "80%" }}
        py={16}
      >
        <VStack spacing={16} align="stretch">
          {/* Header */}
          <VStack spacing={6} textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, #60A5FA, #818CF8)"
              bgClip="text"
            >
              {portfolioData?.personalInfo?.name}
            </Heading>
            <Text fontSize="xl" color="gray.400">
              {portfolioData?.personalInfo?.title}
            </Text>
            <HStack spacing={4}>
              {[
                {
                  icon: FaGithub,
                  href: portfolioData?.personalInfo?.github,
                  label: "GitHub",
                },
                {
                  icon: FaLinkedin,
                  href: portfolioData?.personalInfo?.linkedin,
                  label: "LinkedIn",
                },
                {
                  icon: FaEnvelope,
                  href: `mailto:${portfolioData?.personalInfo?.email}`,
                  label: "Email",
                },
              ].map((item, i) => (
                <Tooltip key={i} label={item.label}>
                  <IconButton
                    as={Link}
                    href={item.href}
                    aria-label={item.label}
                    icon={<Icon as={item.icon} />}
                    size="lg"
                    variant="ghost"
                    color="white"
                    _hover={{
                      transform: "translateY(-2px)",
                      color: "#60A5FA",
                      bg: "#1F2937",
                    }}
                    transition="all 0.2s"
                    isExternal
                  />
                </Tooltip>
              ))}
            </HStack>
          </VStack>

          {/* Experience */}
          <Section icon={FaBriefcase} title="Experience">
            <VStack spacing={6} w="full">
              {portfolioData?.experiences?.map((exp, idx) => (
                <ExperienceCard key={idx} {...exp} />
              ))}
            </VStack>
          </Section>

          {/* Education */}
          <Section icon={FaGraduationCap} title="Education">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {portfolioData?.education?.map((edu, idx) => (
                <Card
                  key={idx}
                  bg="#111827"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  _hover={{
                    transform: "translateY(-4px)",
                    borderColor: "#60A5FA",
                    shadow: "lg",
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color="white">
                          {edu.degree}
                        </Heading>
                        <Text color="#60A5FA" fontSize="lg">
                          {edu.institution}
                        </Text>
                        <Text color="gray.400">{edu.location}</Text>
                      </VStack>
                      <Flex gap={2} wrap="wrap">
                        {edu.coursework.map((course, i) => (
                          <Badge
                            key={i}
                            px={3}
                            py={1}
                            bg="#1F2937"
                            color="#60A5FA"
                          >
                            {course}
                          </Badge>
                        ))}
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Section>

          {/* Projects */}
          <Section icon={FaFolder} title="Projects">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {portfolioData?.projects?.map((project, idx) => (
                <ProjectCard key={idx} {...project} />
              ))}
            </SimpleGrid>
          </Section>

          {/* Achievements */}
          <Section icon={FaAward} title="Achievements">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {portfolioData?.achievements?.map((achievement, idx) => (
                <HStack
                  key={idx}
                  p={4}
                  bg="#111827"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  borderRadius="lg"
                  spacing={4}
                  _hover={{
                    transform: "translateY(-2px)",
                    borderColor: "#60A5FA",
                    shadow: "lg",
                  }}
                  transition="all 0.3s"
                >
                  <Icon as={FaAward} color="#60A5FA" boxSize={5} />
                  <Text color="gray.300">{achievement.description}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Section>
        </VStack>
      </Container>
    </Box>
  );
};

export default Portfolio;
