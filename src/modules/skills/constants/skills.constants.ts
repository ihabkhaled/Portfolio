import type { SkillTierGroup } from '../types/skills.types';

/**
 * Skills grouped by depth of production experience. No percentages: a tier is
 * a qualitative claim, and its definition (in the message catalog) is the
 * only thing that has to be honest, not a number.
 */
export const SKILL_TIER_GROUPS: readonly SkillTierGroup[] = [
  {
    tier: 'primary',
    technologies: [
      'JavaScript',
      'TypeScript',
      'Node.js',
      'NestJS',
      'Express.js',
      'React',
      'Next.js',
      'REST APIs',
      'Backend architecture',
      'Full-stack development',
      'Integrations',
      'Microservices',
      'System design',
      'Authentication & RBAC',
      'Production troubleshooting',
      'Docker',
      'Testing',
      'CI/CD',
      'Git',
    ],
  },
  {
    tier: 'strong',
    technologies: [
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'RabbitMQ',
      'Firebase',
      'Sequelize',
      'Prisma',
      'TypeORM',
      'Mongoose',
      'React Native',
      'Capacitor',
      'Nginx',
      'Google Cloud Platform',
      'GitHub Actions',
      'Bitbucket Pipelines',
      'Unit & integration testing',
      'Security hardening',
      'Performance optimisation',
      'AI & LLM integrations',
      'Third-party API integrations',
    ],
  },
  {
    tier: 'working',
    technologies: [
      'PHP',
      'Laravel',
      'Python',
      'Flask',
      'C#',
      'WordPress',
      'Kubernetes',
      'Kotlin',
      'Swift',
      'Linux administration',
      'Shell & Bash',
      'Apache',
      'AWS',
      'Elasticsearch & OpenSearch',
      'Wazuh & security tooling',
    ],
  },
  {
    tier: 'foundational',
    technologies: ['Java & Spring Boot', 'Go', 'C++', 'OpenGL', 'Matlab', 'Networking (CCNA)'],
  },
] as const;
