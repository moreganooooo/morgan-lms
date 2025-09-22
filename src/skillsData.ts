// skillsData.ts - Comprehensive Email Marketing Skills Framework

export interface Skill {
  id: string;
  label: string;
  category: 'Technical' | 'Strategic' | 'Creative' | 'Analytical';
  description: string;
  score: number;
  maxScore: number;
  icon: string;
}

// Comprehensive Email Marketing Skills Framework
export const INITIAL_SKILLS: Skill[] = [
  // 🔧 TECHNICAL SKILLS
  { 
    id: 'platform', 
    label: 'Platform Mastery', 
    category: 'Technical',
    description: 'HubSpot, Mailchimp, Klaviyo proficiency and platform optimization',
    score: 2.1,
    maxScore: 5.0,
    icon: '⚙️'
  },
  { 
    id: 'deliverability', 
    label: 'Deliverability Engineering', 
    category: 'Technical',
    description: 'SPF, DKIM, DMARC setup, warming strategies, inbox placement',
    score: 1.8,
    maxScore: 5.0,
    icon: '📧'
  },
  { 
    id: 'automation', 
    label: 'Marketing Automation', 
    category: 'Technical',
    description: 'Workflows, triggers, drip sequences, behavioral automation',
    score: 2.0,
    maxScore: 5.0,
    icon: '🤖'
  },
  { 
    id: 'development', 
    label: 'Email Development', 
    category: 'Technical',
    description: 'HTML/CSS, responsive templates, dynamic content',
    score: 1.5,
    maxScore: 5.0,
    icon: '💻'
  },

  // 🎯 STRATEGIC SKILLS  
  { 
    id: 'lifecycle', 
    label: 'Lifecycle Marketing', 
    category: 'Strategic',
    description: 'Customer journey mapping, nurture strategies, retention',
    score: 2.3,
    maxScore: 5.0,
    icon: '🔄'
  },
  { 
    id: 'segmentation', 
    label: 'Segmentation Strategy', 
    category: 'Strategic',
    description: 'Behavioral, demographic, predictive audience targeting',
    score: 1.9,
    maxScore: 5.0,
    icon: '🎯'
  },
  { 
    id: 'planning', 
    label: 'Campaign Planning', 
    category: 'Strategic',
    description: 'Strategy development, goal setting, roadmap creation',
    score: 2.2,
    maxScore: 5.0,
    icon: '📋'
  },
  { 
    id: 'compliance', 
    label: 'Compliance & Privacy', 
    category: 'Strategic',
    description: 'GDPR, CAN-SPAM, data protection, consent management',
    score: 1.7,
    maxScore: 5.0,
    icon: '🛡️'
  },

  // ✨ CREATIVE SKILLS
  { 
    id: 'copywriting', 
    label: 'Copywriting & Messaging', 
    category: 'Creative',
    description: 'Subject lines, CTAs, storytelling, brand voice',
    score: 2.8,
    maxScore: 5.0,
    icon: '✍️'
  },
  { 
    id: 'design', 
    label: 'Design & UX', 
    category: 'Creative',
    description: 'Email design, user experience, visual hierarchy',
    score: 2.4,
    maxScore: 5.0,
    icon: '🎨'
  },
  { 
    id: 'content', 
    label: 'Content Strategy', 
    category: 'Creative',
    description: 'Editorial calendars, personalization, content planning',
    score: 2.1,
    maxScore: 5.0,
    icon: '📝'
  },

  // 📊 ANALYTICAL SKILLS
  { 
    id: 'analytics', 
    label: 'Performance Analytics', 
    category: 'Analytical',
    description: 'Metrics, dashboards, reporting, trend analysis',
    score: 2.0,
    maxScore: 5.0,
    icon: '📈'
  },
  { 
    id: 'testing', 
    label: 'A/B Testing', 
    category: 'Analytical',
    description: 'Experimentation, statistical significance, optimization',
    score: 1.8,
    maxScore: 5.0,
    icon: '🧪'
  },
  { 
    id: 'attribution', 
    label: 'ROI Attribution', 
    category: 'Analytical',
    description: 'Tracking, attribution models, business impact measurement',
    score: 1.6,
    maxScore: 5.0,
    icon: '💰'
  },
  { 
    id: 'dataanalysis', 
    label: 'Data Analysis', 
    category: 'Analytical',
    description: 'Segmentation analysis, cohort studies, predictive modeling',
    score: 1.9,
    maxScore: 5.0,
    icon: '🔍'
  }
];

// Skill gains per module completion
export const MODULE_SKILL_MAPPING: Record<string, Record<string, number>> = {
  // Day 1 - Technical Foundation
  '1-1a': { // HubSpot Email Marketing Certification
    platform: 0.4,
    planning: 0.3,
    copywriting: 0.2,
    analytics: 0.2
  },
  '1-1b': { // Advanced Deliverability Mastery  
    deliverability: 0.5,
    platform: 0.2,
    analytics: 0.2,
    compliance: 0.3
  },
  '1-1c': { // Platform Mastery Strategy
    platform: 0.4,
    lifecycle: 0.3,
    planning: 0.3,
    segmentation: 0.2
  },

  // Day 2 - Strategic Automation
  '2-2a': { // Advanced Lifecycle Marketing Framework
    lifecycle: 0.5,
    automation: 0.4,
    segmentation: 0.3,
    planning: 0.2
  },
  '2-2b': { // Behavioral Segmentation Excellence
    segmentation: 0.5,
    dataanalysis: 0.4,
    analytics: 0.3,
    automation: 0.2
  },

  // Day 3 - Advanced Analytics
  '3-3a': { // Performance Analytics & ROI Attribution
    analytics: 0.5,
    attribution: 0.5,
    dataanalysis: 0.4,
    testing: 0.3
  }
};

// Future expansion: Add more modules here as the curriculum grows
export const FUTURE_MODULES = {
  // Day 4 - Advanced Creative & Conversion
  '4-4a': { // Email Design Mastery
    design: 0.5,
    development: 0.4,
    copywriting: 0.3
  },
  '4-4b': { // Advanced A/B Testing
    testing: 0.5,
    analytics: 0.3,
    dataanalysis: 0.3
  },
  
  // Day 5 - Compliance & Advanced Strategy
  '5-5a': { // GDPR & Privacy Mastery
    compliance: 0.5,
    planning: 0.3
  },
  '5-5b': { // Advanced Automation Workflows
    automation: 0.5,
    lifecycle: 0.4,
    segmentation: 0.3
  }
};

// Skill level definitions for UI
export const SKILL_LEVELS = {
  BEGINNER: { min: 0, max: 2.0, label: 'Beginner', color: '#ef4444' },
  DEVELOPING: { min: 2.0, max: 3.0, label: 'Developing', color: '#f59e0b' },
  PROFICIENT: { min: 3.0, max: 4.0, label: 'Proficient', color: '#8b5cf6' },
  ADVANCED: { min: 4.0, max: 4.5, label: 'Advanced', color: '#06b6d4' },
  EXPERT: { min: 4.5, max: 5.0, label: 'Expert', color: '#10b981' }
};