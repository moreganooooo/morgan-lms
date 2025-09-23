import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen, 
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Filter
} from 'lucide-react';
import { INK } from './utils';

// Import our new components and data
import {
  CertificationCard,
  RecommendationsWidget,
  MarketIntelligenceWidget,
  SkillTreeVisualization
} from './career-components';

import {
  CERTIFICATIONS,
  SKILL_TREES,
  CAREER_PATHS,
  type Certification
} from './enhanced-skills-system';

interface EnhancedSkillsViewProps {
  theme: any;
}

const EnhancedSkillsView: React.FC<EnhancedSkillsViewProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'certifications' | 'paths'>('overview');
  const [selectedSkillTree, setSelectedSkillTree] = useState('emailMarketing');
  const [certificationFilter, setCertificationFilter] = useState<'all' | 'urgent' | 'free' | 'completed'>('all');
  const [completedCerts, setCompletedCerts] = useState<string[]>([]);

  // Filter certifications based on selected filter
  const filteredCertifications = useMemo(() => {
    let certs = Object.values(CERTIFICATIONS);
    
    switch (certificationFilter) {
      case 'urgent':
        return certs.filter(c => c.priority === 'urgent');
      case 'free':
        return certs.filter(c => c.cost === 'FREE');
      case 'completed':
        return certs.filter(c => completedCerts.includes(c.id));
      default:
        return certs;
    }
  }, [certificationFilter, completedCerts]);

  const handleCertificationComplete = (certId: string) => {
    setCompletedCerts(prev => [...prev, certId]);
    // In real app, this would update the certification in your data
  };

  const handleSkillClick = (skillId: string) => {
    // Find related certifications for this skill
    const relatedCerts = Object.values(CERTIFICATIONS).filter(cert => 
      cert.skills.some(skill => skill.toLowerCase().includes(skillId.toLowerCase()))
    );
    if (relatedCerts.length > 0) {
      setActiveTab('certifications');
      setCertificationFilter('all');
    }
  };

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalSkills = Object.values(SKILL_TREES).reduce((acc, tree) => 
      acc + Object.values(tree.branches).reduce((branchAcc, branch) => 
        branchAcc + Object.keys(branch.skills).length, 0), 0);
    
    const completedSkills = Object.values(SKILL_TREES).reduce((acc, tree) => 
      acc + Object.values(tree.branches).reduce((branchAcc, branch) => 
        branchAcc + Object.values(branch.skills).filter(skill => skill.level >= skill.target).length, 0), 0);
    
    return Math.round((completedSkills / totalSkills) * 100);
  }, []);

  const careerPath = CAREER_PATHS.emailSpecialist; // Default to email specialist path

  return (
    <div className="space-y-6">
      {/* Header Section - Keep gradient for good contrast */}
      <div 
        className="p-6 rounded-xl text-white relative overflow-hidden"
        style={{ background: theme.accentGradient }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Career Development Hub</h1>
              <p className="text-white opacity-90">
                Your strategic roadmap to marketing mastery and career growth
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{overallProgress}%</div>
              <div className="text-sm opacity-75">Overall Progress</div>
            </div>
          </div>
          
          {/* Fixed Quick Stats with solid white backgrounds */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="text-center p-3 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Award className="w-6 h-6 mx-auto mb-1" style={{ color: theme.accent }} />
              <div className="font-bold" style={{ color: INK }}>{completedCerts.length}</div>
              <div className="text-xs" style={{ color: theme.gray }}>Certifications</div>
            </div>
            <div 
              className="text-center p-3 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Target className="w-6 h-6 mx-auto mb-1" style={{ color: theme.primary }} />
              <div className="font-bold" style={{ color: INK }}>{Object.keys(SKILL_TREES).length}</div>
              <div className="text-xs" style={{ color: theme.gray }}>Skill Trees</div>
            </div>
            <div 
              className="text-center p-3 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-1" style={{ color: theme.success }} />
              <div className="font-bold" style={{ color: INK }}>$85K+</div>
              <div className="text-xs" style={{ color: theme.gray }}>Target Salary</div>
            </div>
            <div 
              className="text-center p-3 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Calendar className="w-6 h-6 mx-auto mb-1" style={{ color: theme.warning }} />
              <div className="font-bold" style={{ color: INK }}>6 Mo</div>
              <div className="text-xs" style={{ color: theme.gray }}>Target Timeline</div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Navigation Tabs - Fixed contrast */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'skills', label: 'Skill Trees', icon: Target },
          { id: 'certifications', label: 'Certifications', icon: Award },
          { id: 'paths', label: 'Career Paths', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(id as any)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300`}
            style={{
              background: activeTab === id ? theme.accentGradient : 'rgba(255,255,255,0.95)',
              color: activeTab === id ? 'white' : INK,
              border: `1px solid ${activeTab === id ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: activeTab === id ? theme.glowEffect : '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <RecommendationsWidget 
                  theme={theme} 
                  onStartCertification={handleCertificationComplete}
                />
                
                {/* Fixed Current Career Stage */}
                <div 
                  className="p-6 rounded-xl shadow-lg"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: INK }}>
                    <Briefcase className="w-5 h-5" style={{ color: theme.primary }} />
                    Current Career Stage
                  </h3>
                  
                  <div className="space-y-4">
                    {careerPath.stages.map((stage, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          index === careerPath.currentStage ? 'bg-blue-50' : 'bg-gray-50'
                        }`}
                        style={{ 
                          borderLeftColor: index === careerPath.currentStage ? theme.primary : '#e5e7eb'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold" style={{ color: INK }}>{stage.title}</h4>
                          <span className="text-sm font-medium" style={{ color: theme.success }}>
                            {stage.salaryRange}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: theme.gray }}>{stage.description}</p>
                        <div className="text-xs" style={{ color: theme.gray }}>
                          Timeline: {stage.timeFrame} • {stage.marketOutlook}
                        </div>
                        {index === careerPath.currentStage && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="text-sm font-medium mb-1" style={{ color: theme.primary }}>Required Skills:</div>
                            <div className="flex flex-wrap gap-1">
                              {stage.requiredSkills.map(skill => (
                                <span 
                                  key={skill} 
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ 
                                    backgroundColor: `${theme.primary}20`,
                                    color: theme.primary
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <MarketIntelligenceWidget theme={theme} />
                
                {/* Fixed Quick Skill Overview */}
                <div 
                  className="p-6 rounded-xl shadow-lg"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: INK }}>
                    <Target className="w-5 h-5" style={{ color: theme.accent }} />
                    Skill Overview
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(SKILL_TREES).map(([key, tree]) => (
                      <div 
                        key={key} 
                        className="p-4 rounded-lg border hover:shadow-md transition-all"
                        style={{
                          borderColor: 'rgba(0,0,0,0.1)',
                          backgroundColor: 'rgba(255,255,255,0.8)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold" style={{ color: INK }}>{tree.name}</h4>
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${theme.primary}20`,
                              color: theme.primary
                            }}
                          >
                            {tree.marketDemand}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(tree.currentLevel / tree.targetLevel) * 100}%`,
                              backgroundColor: theme.success
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span style={{ color: theme.gray }}>
                            {tree.currentLevel}/{tree.targetLevel}
                          </span>
                          <span style={{ color: theme.success }} className="font-medium">
                            {tree.salaryImpact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Fixed Skill Tree Selector */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(SKILL_TREES).map(([key, tree]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSkillTree(key)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300`}
                    style={{
                      borderColor: selectedSkillTree === key ? theme.primary : 'rgba(0,0,0,0.2)',
                      backgroundColor: selectedSkillTree === key ? `${theme.primary}10` : 'rgba(255,255,255,0.95)',
                      color: selectedSkillTree === key ? theme.primary : INK,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {tree.name}
                  </button>
                ))}
              </div>
              
              <SkillTreeVisualization
                skillTree={SKILL_TREES[selectedSkillTree]}
                theme={theme}
                onSkillClick={handleSkillClick}
              />
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-6">
              {/* Fixed Certification Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <Filter className="w-5 h-5" style={{ color: theme.gray }} />
                {[
                  { id: 'all', label: 'All Certifications' },
                  { id: 'urgent', label: 'Urgent Priority', icon: Zap },
                  { id: 'free', label: 'Free Certs', icon: Star },
                  { id: 'completed', label: 'Completed', icon: Award }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setCertificationFilter(id as any)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center gap-2`}
                    style={{
                      borderColor: certificationFilter === id ? theme.primary : 'rgba(0,0,0,0.2)',
                      backgroundColor: certificationFilter === id ? `${theme.primary}10` : 'rgba(255,255,255,0.95)',
                      color: certificationFilter === id ? theme.primary : INK,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </button>
                ))}
              </div>

              {/* Certifications Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredCertifications.map((cert) => (
                  <CertificationCard
                    key={cert.id}
                    certification={{
                      ...cert,
                      completed: completedCerts.includes(cert.id)
                    }}
                    onComplete={handleCertificationComplete}
                    theme={theme}
                  />
                ))}
              </div>

              {filteredCertifications.length === 0 && (
                <div 
                  className="text-center py-12 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
                >
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: theme.gray }} />
                  <p style={{ color: INK }}>No certifications match your current filter.</p>
                  <button
                    onClick={() => setCertificationFilter('all')}
                    className="mt-2 hover:underline"
                    style={{ color: theme.primary }}
                  >
                    View all certifications
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'paths' && (
            <div className="space-y-6">
              {/* Fixed Career Path Cards */}
              {Object.entries(CAREER_PATHS).map(([key, path]) => (
                <div 
                  key={key} 
                  className="p-6 rounded-xl shadow-lg"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: INK }}>{path.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: theme.gray }}>
                        <span>💰 {path.totalEarningPotential}</span>
                        <span>📈 {path.marketGrowth}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: theme.gray }}>Current Stage</div>
                      <div className="text-2xl font-bold" style={{ color: theme.primary }}>
                        {path.currentStage + 1}/{path.stages.length}
                      </div>
                    </div>
                  </div>

                  {/* Path Timeline */}
                  <div className="relative">
                    {path.stages.map((stage, index) => (
                      <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                        {/* Timeline Dot */}
                        <div className="relative flex-shrink-0">
                          <div 
                            className={`w-4 h-4 rounded-full border-2 ${
                              index <= path.currentStage 
                                ? 'bg-green-500 border-green-500' 
                                : index === path.currentStage + 1
                                ? 'bg-blue-500 border-blue-500'
                                : 'bg-gray-200 border-gray-300'
                            }`}
                          />
                          {index < path.stages.length - 1 && (
                            <div 
                              className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 ${
                                index < path.currentStage ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        {/* Stage Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold" style={{ color: INK }}>{stage.title}</h4>
                            <span className="text-sm font-medium" style={{ color: theme.success }}>
                              {stage.salaryRange}
                            </span>
                          </div>
                          <p className="text-sm mb-3" style={{ color: theme.gray }}>{stage.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium mb-1" style={{ color: INK }}>Timeline:</div>
                              <div style={{ color: theme.gray }}>{stage.timeFrame}</div>
                            </div>
                            <div>
                              <div className="font-medium mb-1" style={{ color: INK }}>Market Outlook:</div>
                              <div style={{ color: theme.gray }}>{stage.marketOutlook}</div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="font-medium mb-2" style={{ color: INK }}>Required Certifications:</div>
                            <div className="flex flex-wrap gap-2">
                              {stage.certifications.map(certId => {
                                const cert = Object.values(CERTIFICATIONS).find(c => c.id === certId);
                                return cert ? (
                                  <span 
                                    key={certId}
                                    className={`text-xs px-2 py-1 rounded ${
                                      completedCerts.includes(certId)
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100'
                                    }`}
                                    style={{
                                      color: completedCerts.includes(certId) ? '#15803d' : INK
                                    }}
                                  >
                                    {completedCerts.includes(certId) ? '✅' : '📜'} {cert.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSkillsView;