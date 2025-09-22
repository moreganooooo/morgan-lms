import React, { useState } from 'react';
import { User, Briefcase, Target, TrendingUp, Star, Award, ChevronRight, Info, ExternalLink } from 'lucide-react';

interface PersonalizedAnalysisProps {
  skills: any[];
  theme: any;
}

export default function PersonalizedAnalysis({ skills, theme }: PersonalizedAnalysisProps) {
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  // Calculate personalized insights based on Morgan's background
  const getPersonalizedInsights = () => {
    const totalExperience = skills.reduce((sum, skill) => sum + skill.score, 0);
    const avgScore = totalExperience / skills.length;
    
    // Identify strengths based on current scores
    const topSkills = skills.filter(skill => skill.score >= 2.5).sort((a, b) => b.score - a.score);
    const growthAreas = skills.filter(skill => skill.score < 2.5).sort((a, b) => a.score - b.score);
    
    // Strategic recommendations based on Morgan's background
    const strategicSkills = skills.filter(skill => skill.category === 'Strategic');
    const avgStrategic = strategicSkills.reduce((sum, skill) => sum + skill.score, 0) / strategicSkills.length;
    
    return {
      overallLevel: avgScore >= 3.0 ? 'Senior Professional' : avgScore >= 2.5 ? 'Experienced Professional' : 'Developing Professional',
      primaryStrengths: topSkills.slice(0, 3),
      growthOpportunities: growthAreas.slice(0, 3),
      strategicReadiness: avgStrategic,
      recommendations: generatePersonalizedRecommendations(topSkills, growthAreas)
    };
  };

  const generatePersonalizedRecommendations = (strengths: any[], growth: any[]) => {
    const recs = [];
    
    // Based on Morgan's 10+ years experience in CRM/lifecycle
    if (strengths.some(s => s.id === 'lifecycle')) {
      recs.push({
        type: 'leverage',
        title: 'Leverage Your CRM Expertise',
        description: 'Your decade+ of lifecycle marketing experience is a major asset. Consider showcasing advanced automation strategies and customer journey optimization.',
        action: 'Create portfolio case studies'
      });
    }

    // Based on Salesforce/Outreach.io experience
    if (strengths.some(s => s.id === 'platform')) {
      recs.push({
        type: 'expand',
        title: 'Cross-Platform Mastery',
        description: 'Your Salesforce & Outreach.io background positions you perfectly for senior IC roles. Consider adding HubSpot certification to round out platform expertise.',
        action: 'Complete HubSpot certification'
      });
    }

    // Based on creative strategy background
    if (strengths.some(s => s.id === 'copywriting') || strengths.some(s => s.id === 'content')) {
      recs.push({
        type: 'differentiate',
        title: 'Creative Strategy Edge',
        description: 'Your creative strategy + systems thinking combination is rare in email marketing. This strategic empathy approach could be your competitive advantage.',
        action: 'Document your methodology'
      });
    }

    // Growth recommendations
    if (growth.some(s => s.id === 'analytics')) {
      recs.push({
        type: 'upskill',
        title: 'Data Analysis Advancement',
        description: 'Strengthening analytics skills will complement your strategic background perfectly for senior remote IC roles.',
        action: 'Focus on ROI attribution modules'
      });
    }

    return recs.slice(0, 4); // Return top 4 recommendations
  };

  const insights = getPersonalizedInsights();

  const getRecommendationIcon = (type: string) => {
    const icons = {
      leverage: '💪',
      expand: '🚀', 
      differentiate: '✨',
      upskill: '📈'
    };
    return icons[type as keyof typeof icons] || '💡';
  };

  const getCareerRelevance = (skill: any) => {
    const relevanceMap = {
      'lifecycle': 'Critical for senior CRM/lifecycle roles. Your 10+ years experience here is a major strength.',
      'platform': 'Essential for IC marketing roles. Your Salesforce/Outreach.io background is valuable.',
      'copywriting': 'Highly valued in remote creative strategy positions. Shows strategic empathy.',
      'segmentation': 'Key for data-driven marketing roles. Builds on your systems thinking.',
      'analytics': 'Important for proving ROI impact. Essential for senior IC advancement.',
      'automation': 'Core competency for marketing operations roles. High demand in remote work.',
      'attribution': 'Critical for proving business impact. Valuable for executive-level discussions.',
      'planning': 'Essential leadership skill. Shows strategic thinking ability.',
      'deliverability': 'Technical expertise that differentiates you from pure creative roles.',
      'compliance': 'Increasingly important. Shows business maturity and risk awareness.',
      'design': 'Complements your Canva background. Useful for comprehensive creative roles.',
      'content': 'Core to content strategy roles. Shows editorial and strategic thinking.',
      'testing': 'Data-driven approach valued in remote IC roles. Shows optimization mindset.',
      'development': 'Technical skill that increases versatility and collaboration with dev teams.',
      'dataanalysis': 'Advanced analytical skill for senior roles. Shows data literacy.'
    };
    
    return relevanceMap[skill.id as keyof typeof relevanceMap] || 'Valuable skill for email marketing professionals.';
  };

  return (
    <div className="space-y-6">
      {/* Personal Profile Section */}
      <div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}10)`, border: `1px solid ${theme.primary}30` }}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: theme.primary, color: 'white' }}>
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Email Marketing Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4" style={{ color: theme.primary }} />
                  <span className="font-semibold text-gray-700">Experience Level</span>
                </div>
                <div className="text-lg font-bold" style={{ color: theme.primary }}>
                  {insights.overallLevel}
                </div>
                <div className="text-sm text-gray-600">
                  10+ years in CRM, lifecycle marketing & creative strategy
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" style={{ color: theme.accent }} />
                  <span className="font-semibold text-gray-700">Career Focus</span>
                </div>
                <div className="text-lg font-bold" style={{ color: theme.accent }}>
                  Remote IC Leadership
                </div>
                <div className="text-sm text-gray-600">
                  Senior marketing roles with strategic empathy approach
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Strengths */}
        <div className="p-6 rounded-xl bg-white border">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Star className="w-5 h-5" style={{ color: theme.success }} />
            Your Core Strengths
          </h4>
          <div className="space-y-3">
            {insights.primaryStrengths.map((skill) => (
              <div 
                key={skill.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{skill.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{skill.label}</div>
                    <div className="text-xs text-gray-500">{skill.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: theme.success }}>
                    {skill.score.toFixed(1)}/5.0
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Opportunities */}
        <div className="p-6 rounded-xl bg-white border">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <TrendingUp className="w-5 h-5" style={{ color: theme.warning }} />
            Growth Opportunities
          </h4>
          <div className="space-y-3">
            {insights.growthOpportunities.map((skill) => (
              <div 
                key={skill.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{skill.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{skill.label}</div>
                    <div className="text-xs text-gray-500">High impact for senior roles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: theme.warning }}>
                    {skill.score.toFixed(1)}/5.0
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="p-6 rounded-xl bg-white border">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Award className="w-5 h-5" style={{ color: theme.accent }} />
          Personalized Career Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: `${theme.primary}05` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{getRecommendationIcon(rec.type)}</span>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 mb-1">{rec.title}</h5>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="text-xs font-medium" style={{ color: theme.primary }}>
                    → {rec.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedSkill.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedSkill.label}</h3>
                  <div className="text-sm text-gray-500">{selectedSkill.category} Skill</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSkill(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Current Level</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: theme.primary,
                        width: `${(selectedSkill.score / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg" style={{ color: theme.primary }}>
                    {selectedSkill.score.toFixed(1)}/5.0
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{selectedSkill.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Career Relevance</h4>
                <p className="text-gray-600">{getCareerRelevance(selectedSkill)}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How to Improve</h4>
                <div className="text-sm text-gray-600">
                  Complete more modules in the {selectedSkill.category.toLowerCase()} category to advance this skill. 
                  Each completed module will automatically update your progress.
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="w-full p-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: theme.primary }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}