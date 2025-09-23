// Enhanced skills data structure with career paths
export interface Certification {
  id: string;
  name: string;
  provider: string;
  cost: string;
  timeToComplete: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  skillBoost: number;
  salaryImpact: string;
  completed: boolean;
  dateCompleted?: string;
  nextSteps: string[];
  marketValue: string;
  directLink: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SkillBranch {
  name: string;
  skills: Record<string, {
    level: number;
    target: number;
    certification?: string;
    timeToComplete?: string;
  }>;
}

export interface SkillTree {
  name: string;
  category: 'core' | 'specialized' | 'leadership' | 'emerging';
  currentLevel: number;
  targetLevel: number;
  salaryImpact: string;
  marketDemand: 'low' | 'medium' | 'high' | 'critical';
  branches: Record<string, SkillBranch>;
}

export interface CareerStage {
  title: string;
  salaryRange: string;
  timeFrame: string;
  requiredSkills: string[];
  certifications: string[];
  description: string;
  marketOutlook: string;
}

export interface CareerPath {
  name: string;
  currentStage: number;
  stages: CareerStage[];
  totalEarningPotential: string;
  marketGrowth: string;
}

// CERTIFICATIONS DATABASE
export const CERTIFICATIONS: Record<string, Certification> = {
  klaviyoProduct: {
    id: 'klaviyo-product',
    name: 'Klaviyo Product Certification',
    provider: 'Klaviyo',
    cost: 'FREE',
    timeToComplete: '1 hour',
    difficulty: 'Beginner',
    skills: ['klaviyo', 'emailMarketing', 'analytics'],
    skillBoost: 0.8,
    salaryImpact: '+$3K',
    completed: false,
    nextSteps: ['iterable-foundations', 'hubspot-email'],
    marketValue: 'High - Required for 89% of email marketing jobs',
    directLink: 'https://academy.klaviyo.com/en-us/collections/product-certification',
    priority: 'urgent'
  },
  hubspotEmail: {
    id: 'hubspot-email',
    name: 'HubSpot Email Marketing Certification',
    provider: 'HubSpot',
    cost: 'FREE',
    timeToComplete: '4 hours',
    difficulty: 'Beginner',
    skills: ['hubspot', 'emailMarketing', 'automation'],
    skillBoost: 0.6,
    salaryImpact: '+$5K',
    completed: false,
    nextSteps: ['hubspot-marketing-hub', 'salesforce-pardot'],
    marketValue: 'Very High - Industry standard certification',
    directLink: 'https://academy.hubspot.com/courses/email-marketing',
    priority: 'high'
  },
  iterableFoundations: {
    id: 'iterable-foundations',
    name: 'Iterable Foundations Certification',
    provider: 'Iterable',
    cost: 'FREE',
    timeToComplete: '3 hours',
    difficulty: 'Beginner',
    skills: ['iterable', 'automation', 'crossChannel'],
    skillBoost: 0.7,
    salaryImpact: '+$4K',
    completed: false,
    nextSteps: ['iterable-ai', 'iterable-sms'],
    marketValue: 'High - Growing platform with 85% adoption rate',
    directLink: 'https://academy.iterable.com/',
    priority: 'medium'
  },
  hubspotMarketingHub: {
    id: 'hubspot-marketing-hub',
    name: 'HubSpot Marketing Hub Certification',
    provider: 'HubSpot',
    cost: 'FREE',
    timeToComplete: '6 hours',
    difficulty: 'Intermediate',
    skills: ['hubspot', 'marketingAutomation', 'leadGen', 'analytics'],
    skillBoost: 1.0,
    salaryImpact: '+$8K',
    completed: false,
    nextSteps: ['hubspot-sales', 'marketo-expert'],
    marketValue: 'Very High - Comprehensive marketing platform mastery',
    directLink: 'https://academy.hubspot.com/courses/marketing-software',
    priority: 'high'
  },
  salesforceAdmin: {
    id: 'salesforce-admin',
    name: 'Salesforce Administrator Certification',
    provider: 'Salesforce',
    cost: '$200',
    timeToComplete: '40 hours',
    difficulty: 'Intermediate',
    skills: ['salesforce', 'crm', 'dataManagement', 'automation'],
    skillBoost: 1.2,
    salaryImpact: '+$15K',
    completed: false,
    nextSteps: ['pardot-specialist', 'salesforce-marketing-cloud'],
    marketValue: 'Critical - Opens $70K+ CRM roles',
    directLink: 'https://trailhead.salesforce.com/credentials/administrator',
    priority: 'medium'
  },
  salesEnablement: {
    id: 'sales-enablement',
    name: 'Sales Enablement Certification',
    provider: 'Product Marketing Alliance',
    cost: '$499',
    timeToComplete: '8 hours',
    difficulty: 'Intermediate',
    skills: ['salesEnablement', 'contentStrategy', 'training'],
    skillBoost: 0.9,
    salaryImpact: '+$12K',
    completed: false,
    nextSteps: ['revenue-operations', 'sales-leadership'],
    marketValue: 'High - Bridge to $85K+ roles',
    directLink: 'https://learning.productmarketingalliance.com/on-demand/sales-enablement-certified',
    priority: 'medium'
  }
};

// ENHANCED SKILL TREES
export const SKILL_TREES: Record<string, SkillTree> = {
  emailMarketing: {
    name: 'Email Marketing Mastery',
    category: 'core',
    currentLevel: 3.4,
    targetLevel: 5.0,
    salaryImpact: '+$15K',
    marketDemand: 'critical',
    branches: {
      platforms: {
        name: 'Platform Proficiency',
        skills: {
          klaviyo: { level: 0, target: 5, certification: 'klaviyo-product', timeToComplete: '1 hour' },
          hubspot: { level: 2, target: 5, certification: 'hubspot-email', timeToComplete: '4 hours' },
          iterable: { level: 0, target: 4, certification: 'iterable-foundations', timeToComplete: '3 hours' },
          mailchimp: { level: 1, target: 3, timeToComplete: '2 hours' },
          constantContact: { level: 0, target: 2, timeToComplete: '1 hour' }
        }
      },
      strategy: {
        name: 'Campaign Strategy',
        skills: {
          segmentation: { level: 4, target: 5 },
          automation: { level: 3, target: 5 },
          abTesting: { level: 4, target: 5 },
          personalization: { level: 2, target: 5 },
          deliverability: { level: 3, target: 5 }
        }
      },
      analytics: {
        name: 'Performance Analytics',
        skills: {
          attribution: { level: 1, target: 4 },
          roiAnalysis: { level: 2, target: 4 },
          reporting: { level: 3, target: 5 },
          dataVisualization: { level: 2, target: 4 }
        }
      }
    }
  },
  crm: {
    name: 'CRM & Lifecycle Marketing',
    category: 'core',
    currentLevel: 3.2,
    targetLevel: 5.0,
    salaryImpact: '+$18K',
    marketDemand: 'high',
    branches: {
      platforms: {
        name: 'CRM Platforms',
        skills: {
          salesforce: { level: 2, target: 5, certification: 'salesforce-admin', timeToComplete: '40 hours' },
          hubspotCrm: { level: 3, target: 5, certification: 'hubspot-crm', timeToComplete: '3 hours' },
          pipedrive: { level: 1, target: 3 },
          zoho: { level: 0, target: 2 }
        }
      },
      strategy: {
        name: 'Lifecycle Strategy',
        skills: {
          leadNurturing: { level: 3, target: 5 },
          customerJourney: { level: 3, target: 5 },
          retention: { level: 2, target: 4 },
          winback: { level: 1, target: 4 }
        }
      }
    }
  },
  marketingAutomation: {
    name: 'Marketing Automation',
    category: 'specialized',
    currentLevel: 2.1,
    targetLevel: 4.5,
    salaryImpact: '+$20K',
    marketDemand: 'critical',
    branches: {
      platforms: {
        name: 'Automation Platforms',
        skills: {
          marketo: { level: 0, target: 4, certification: 'marketo-expert', timeToComplete: '60 hours' },
          pardot: { level: 0, target: 4, certification: 'pardot-specialist', timeToComplete: '30 hours' },
          activeCampaign: { level: 1, target: 3 },
          drip: { level: 0, target: 2 }
        }
      },
      workflows: {
        name: 'Workflow Design',
        skills: {
          leadScoring: { level: 1, target: 4 },
          behavioralTriggers: { level: 2, target: 5 },
          multiChannel: { level: 1, target: 4 }
        }
      }
    }
  },
  analytics: {
    name: 'Marketing Analytics',
    category: 'core',
    currentLevel: 2.5,
    targetLevel: 4.5,
    salaryImpact: '+$12K',
    marketDemand: 'high',
    branches: {
      tools: {
        name: 'Analytics Tools',
        skills: {
          googleAnalytics: { level: 3, target: 5, certification: 'ga4-certified' },
          mixpanel: { level: 1, target: 3 },
          amplitude: { level: 0, target: 3 },
          tableau: { level: 0, target: 3 }
        }
      },
      analysis: {
        name: 'Data Analysis',
        skills: {
          cohortAnalysis: { level: 1, target: 4 },
          attributionModeling: { level: 1, target: 4 },
          predictiveAnalytics: { level: 0, target: 3 }
        }
      }
    }
  },
  content: {
    name: 'Content & Copywriting',
    category: 'core',
    currentLevel: 3.7,
    targetLevel: 4.5,
    salaryImpact: '+$10K',
    marketDemand: 'high',
    branches: {
      copywriting: {
        name: 'Copywriting Skills',
        skills: {
          emailCopy: { level: 4, target: 5 },
          salesCopy: { level: 3, target: 5 },
          socialCopy: { level: 2, target: 4 },
          adCopy: { level: 2, target: 4 }
        }
      },
      strategy: {
        name: 'Content Strategy',
        skills: {
          brandVoice: { level: 4, target: 5 },
          storytelling: { level: 3, target: 5 },
          contentPlanning: { level: 3, target: 4 }
        }
      }
    }
  },
  salesEnablement: {
    name: 'Sales Enablement',
    category: 'specialized',
    currentLevel: 0.5,
    targetLevel: 4.0,
    salaryImpact: '+$25K',
    marketDemand: 'high',
    branches: {
      strategy: {
        name: 'Enablement Strategy',
        skills: {
          salesTraining: { level: 0, target: 4, certification: 'sales-enablement' },
          contentCreation: { level: 1, target: 4 },
          salesOps: { level: 0, target: 3 }
        }
      }
    }
  }
};

// CAREER PATHS
export const CAREER_PATHS: Record<string, CareerPath> = {
  emailSpecialist: {
    name: 'Email Marketing Specialist → Manager',
    currentStage: 0,
    stages: [
      {
        title: 'Email Marketing Associate',
        salaryRange: '$45K - $65K',
        timeFrame: '0-1 years',
        requiredSkills: ['klaviyo:3', 'hubspot:3', 'analytics:2'],
        certifications: ['klaviyo-product', 'hubspot-email'],
        description: 'Master platform basics and campaign execution',
        marketOutlook: 'High demand - 34.5% of marketing jobs are entry-level'
      },
      {
        title: 'Email Marketing Specialist',
        salaryRange: '$65K - $85K',
        timeFrame: '1-3 years',
        requiredSkills: ['automation:4', 'segmentation:4', 'analytics:3'],
        certifications: ['iterable-foundations', 'hubspot-marketing-hub'],
        description: 'Lead complex campaigns and automation workflows',
        marketOutlook: 'Growing 27.4% year-over-year'
      },
      {
        title: 'Email Marketing Manager',
        salaryRange: '$85K - $120K',
        timeFrame: '3-5 years',
        requiredSkills: ['leadership:3', 'strategy:4', 'budget:3'],
        certifications: ['marketo-expert', 'sales-enablement'],
        description: 'Manage team and email marketing strategy',
        marketOutlook: 'Strong growth with 6% annual increase'
      }
    ],
    totalEarningPotential: '$85K - $120K',
    marketGrowth: '6% annually'
  },
  marketingAutomation: {
    name: 'Marketing Automation Specialist',
    currentStage: 0,
    stages: [
      {
        title: 'Marketing Automation Associate',
        salaryRange: '$55K - $75K',
        timeFrame: '0-2 years',
        requiredSkills: ['hubspot:4', 'workflows:3', 'analytics:3'],
        certifications: ['hubspot-marketing-hub', 'salesforce-admin'],
        description: 'Build and optimize automated workflows',
        marketOutlook: 'Critical demand in B2B markets'
      },
      {
        title: 'Marketing Automation Specialist', 
        salaryRange: '$75K - $95K',
        timeFrame: '2-4 years',
        requiredSkills: ['marketo:4', 'leadScoring:4', 'integration:3'],
        certifications: ['marketo-expert', 'pardot-specialist'],
        description: 'Design complex automation strategies',
        marketOutlook: 'Enterprise demand growing rapidly'
      },
      {
        title: 'Marketing Operations Manager',
        salaryRange: '$95K - $130K',
        timeFrame: '4-6 years',
        requiredSkills: ['strategy:5', 'integration:5', 'leadership:4'],
        certifications: ['revenue-operations', 'marketing-analytics'],
        description: 'Own marketing technology stack and operations',
        marketOutlook: 'RevOps roles growing 300%'
      }
    ],
    totalEarningPotential: '$95K - $130K',
    marketGrowth: '8% annually'
  },
  fullStackMarketer: {
    name: 'Full-Stack Marketing Strategist',
    currentStage: 0,
    stages: [
      {
        title: 'Digital Marketing Generalist',
        salaryRange: '$50K - $70K',
        timeFrame: '0-2 years',
        requiredSkills: ['email:3', 'social:3', 'content:3', 'analytics:2'],
        certifications: ['google-ads', 'meta-social', 'hubspot-email'],
        description: 'Multi-channel campaign execution',
        marketOutlook: 'Strong entry-level opportunities'
      },
      {
        title: 'Marketing Strategist',
        salaryRange: '$70K - $100K',
        timeFrame: '2-5 years',
        requiredSkills: ['strategy:4', 'analytics:4', 'leadership:3'],
        certifications: ['google-analytics', 'content-marketing', 'sales-enablement'],
        description: 'Develop integrated marketing strategies',
        marketOutlook: 'High-growth with AI integration'
      },
      {
        title: 'Marketing Manager/Director',
        salaryRange: '$100K - $150K',
        timeFrame: '5+ years',
        requiredSkills: ['leadership:5', 'budget:4', 'strategy:5'],
        certifications: ['executive-leadership', 'marketing-analytics'],
        description: 'Lead marketing team and strategy',
        marketOutlook: 'Leadership roles growing 19.3%'
      }
    ],
    totalEarningPotential: '$100K - $150K',
    marketGrowth: '6% annually'
  }
};

// MARKET INTELLIGENCE
export const MARKET_DATA = {
  industryGrowth: '6%',
  avgSalary: '$81,505',
  salaryGrowth: '+8.7%',
  remoteOpportunities: '47%',
  entryLevelJobs: '34.5%',
  topSkillsInDemand: [
    { skill: 'Marketing Automation', demand: 94, growth: '+15%' },
    { skill: 'Email Marketing', demand: 89, growth: '+12%' },
    { skill: 'Analytics', demand: 87, growth: '+10%' },
    { skill: 'CRM Management', demand: 82, growth: '+8%' },
    { skill: 'Sales Enablement', demand: 76, growth: '+18%' }
  ]
};

// RECOMMENDATION ENGINE
export const getPersonalizedRecommendations = (currentSkills: any, careerGoal: string) => {
  const recommendations = {
    immediate: [] as any[],
    thisMonth: [] as any[],
    strategic: [] as any[]
  };

  // Immediate actions (this week)
  if (!CERTIFICATIONS.klaviyoProduct.completed) {
    recommendations.immediate.push({
      action: 'Complete Klaviyo Product Certification',
      reason: 'FREE, 1-hour, high-impact quick win',
      impact: 'Unlock 89% more job opportunities + $3K salary boost',
      urgency: 'Urgent',
      timeToComplete: '1 hour',
      link: CERTIFICATIONS.klaviyoProduct.directLink
    });
  }

  if (!CERTIFICATIONS.hubspotEmail.completed) {
    recommendations.immediate.push({
      action: 'Start HubSpot Email Marketing',
      reason: 'Build on your existing CRM experience',
      impact: 'Industry standard certification + $5K boost',
      urgency: 'High',
      timeToComplete: '4 hours',
      link: CERTIFICATIONS.hubspotEmail.directLink
    });
  }

  // This month goals
  recommendations.thisMonth.push({
    action: 'Master Email Automation',
    reason: 'Top skill in 94% of job postings',
    impact: 'Bridge to $75K+ automation roles'
  });

  // Strategic (6-month) goals
  if (careerGoal === 'emailSpecialist') {
    recommendations.strategic.push({
      action: 'Sales Enablement Training',
      reason: 'Bridge to higher-paying management roles',
      impact: 'Access to $85K+ manager positions'
    });
  }

  return recommendations;
};