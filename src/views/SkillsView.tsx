import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Award, Target, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import PersonalizedAnalysis from '../components/PersonalizedAnalysis';

interface Skill {
  id: string;
  label: string;
  category: string;
  description: string;
  score: number;
  maxScore: number;
  icon: string;
}

interface SkillsViewProps {
  skills: Skill[];
  theme: any;
}

export default function SkillsView({ skills, theme }: SkillsViewProps) {
  const [showPersonalizedAnalysis, setShowPersonalizedAnalysis] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const categories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    return categories;
  }, [skills]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0);
    const averageScore = totalScore / skills.length;
    const expertSkills = skills.filter(skill => skill.score >= 4.0).length;
    const advancedSkills = skills.filter(skill => skill.score >= 3.0 && skill.score < 4.0).length;
    const topSkill = skills.reduce((top, skill) => 
      skill.score > top.score ? skill : top, skills[0]);
    
    return {
      averageScore,
      expertSkills,
      advancedSkills,
      topSkill,
      totalSkills: skills.length
    };
  }, [skills]);

  // Prepare data for radar chart (top 6 skills)
  const radarData = useMemo(() => {
    const topSkills = [...skills]
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    
    return topSkills.map(skill => ({
      subject: skill.label.length > 15 ? 
        skill.label.substring(0, 12) + '...' : 
        skill.label,
      score: skill.score,
      fullMark: 5
    }));
  }, [skills]);

  const getSkillLevel = (score: number) => {
    if (score >= 4.5) return { label: 'Expert', color: '#10b981', bg: '#10b98120' };
    if (score >= 4.0) return { label: 'Advanced', color: '#06b6d4', bg: '#06b6d420' };
    if (score >= 3.0) return { label: 'Proficient', color: '#8b5cf6', bg: '#8b5cf620' };
    if (score >= 2.0) return { label: 'Developing', color: '#f59e0b', bg: '#f59e0b20' };
    return { label: 'Beginner', color: '#ef4444', bg: '#ef444420' };
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Technical': '🔧',
      'Strategic': '🎯', 
      'Creative': '✨',
      'Analytical': '📊'
    };
    return icons[category] ?? '📈';
  };

  return (
    <div className="space-y-8">
      {/* Personalized Analysis Section - Collapsible */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Your Skills Dashboard</h2>
          <button
            onClick={() => setShowPersonalizedAnalysis(!showPersonalizedAnalysis)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>Personal Analysis</span>
            {showPersonalizedAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        
        {showPersonalizedAnalysis && (
          <PersonalizedAnalysis skills={skills} theme={theme} />
        )}
      </div>

      {/* Skills Overview Stats with Enhanced Tooltips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all duration-300" 
          style={{ backgroundColor: `${theme.primary}10`, borderColor: `${theme.primary}30` }}
          onMouseEnter={() => setHoveredSkill('average')}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
            <span className="font-semibold text-gray-700">Average Score</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.primary }}>
            {stats.averageScore.toFixed(1)}/5.0
          </div>
          {hoveredSkill === 'average' && (
            <div className="text-xs text-gray-600 mt-2">
              Your overall skill level across all email marketing competencies
            </div>
          )}
        </div>
        
        <div 
          className="p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all duration-300" 
          style={{ backgroundColor: `${theme.success}10`, borderColor: `${theme.success}30` }}
          onMouseEnter={() => setHoveredSkill('expert')}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" style={{ color: theme.success }} />
            <span className="font-semibold text-gray-700">Expert Skills</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.success }}>
            {stats.expertSkills}
          </div>
          {hoveredSkill === 'expert' && (
            <div className="text-xs text-gray-600 mt-2">
              Skills rated 4.0+ - demonstrates professional mastery
            </div>
          )}
        </div>
        
        <div 
          className="p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all duration-300" 
          style={{ backgroundColor: `${theme.accent}10`, borderColor: `${theme.accent}30` }}
          onMouseEnter={() => setHoveredSkill('advanced')}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" style={{ color: theme.accent }} />
            <span className="font-semibold text-gray-700">Advanced</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.accent }}>
            {stats.advancedSkills}
          </div>
          {hoveredSkill === 'advanced' && (
            <div className="text-xs text-gray-600 mt-2">
              Skills rated 3.0-4.0 - solid professional competency
            </div>
          )}
        </div>
        
        <div 
          className="p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all duration-300" 
          style={{ backgroundColor: `${theme.warning}10`, borderColor: `${theme.warning}30` }}
          onMouseEnter={() => setHoveredSkill('top')}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" style={{ color: theme.warning }} />
            <span className="font-semibold text-gray-700">Top Skill</span>
          </div>
          <div className="text-sm font-bold" style={{ color: theme.warning }}>
            {stats.topSkill?.label}
          </div>
          <div className="text-xs text-gray-500">
            {stats.topSkill?.score.toFixed(1)}/5.0
          </div>
          {hoveredSkill === 'top' && (
            <div className="text-xs text-gray-600 mt-2">
              Your strongest area - leverage this in job applications
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Radar Chart and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border bg-white hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Skills Radar - Top 6</h3>
            <div className="text-xs text-gray-500">
              Click any skill below for details
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar 
                  name="Current Level" 
                  dataKey="score" 
                  stroke={theme.primary} 
                  fill={theme.primary} 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Progress by Category */}
        <div className="p-6 rounded-lg border bg-white hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Progress by Category</h3>
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
              const avgScore = categorySkills.reduce((sum, skill) => sum + skill.score, 0) / categorySkills.length;
              const level = getSkillLevel(avgScore);
              
              return (
                <div 
                  key={category} 
                  className="space-y-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all duration-200"
                  onMouseEnter={() => setHoveredSkill(category)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <span className="font-medium text-gray-700">{category}</span>
                      {hoveredSkill === category && (
                        <Info className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: level.bg, color: level.color }}
                      >
                        {level.label}
                      </span>
                      <span className="text-sm font-bold" style={{ color: theme.primary }}>
                        {avgScore.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: level.color,
                        width: `${(avgScore / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                  {hoveredSkill === category && (
                    <div className="text-xs text-gray-600">
                      {categorySkills.length} skills in this category • {categorySkills.filter(s => s.score >= 3.0).length} at proficient level or higher
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Detailed Skills Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-gray-800">All Skills Breakdown</h3>
        
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="mb-8">
            <h4 className="text-md font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <span className="text-xl">{getCategoryIcon(category)}</span>
              {category} Skills ({categorySkills.length})
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => {
                const level = getSkillLevel(skill.score);
                
                return (
                  <div 
                    key={skill.id} 
                    className="p-4 rounded-lg border bg-white hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onMouseEnter={() => setHoveredSkill(skill.id)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{skill.icon}</span>
                        <h5 className="font-semibold text-gray-800">{skill.label}</h5>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: level.color }}>
                          {skill.score.toFixed(1)}/5.0
                        </div>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: level.bg, color: level.color }}
                        >
                          {level.label}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: level.color,
                          width: `${(skill.score / skill.maxScore) * 100}%`
                        }}
                      ></div>
                    </div>

                    {hoveredSkill === skill.id && (
                      <div className="text-xs text-gray-500 animate-in fade-in duration-200">
                        💡 Complete modules to improve this skill automatically
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Skills Development Roadmap */}
      <div className="p-6 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🚀 Next Level Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills
            .filter(skill => skill.score < 4.0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((skill) => (
              <div 
                key={skill.id} 
                className="p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSkill(`roadmap-${skill.id}`)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{skill.icon}</span>
                  <span className="font-medium text-gray-700">{skill.label}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Current: {skill.score.toFixed(1)}/5.0
                </div>
                <div className="text-sm text-blue-600 mb-2">
                  Next: Complete more {skill.category.toLowerCase()} modules to advance
                </div>
                {hoveredSkill === `roadmap-${skill.id}` && (
                  <div className="text-xs text-gray-500 border-t pt-2">
                    🎯 Reaching 3.0+ would move you to "Proficient" level
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}