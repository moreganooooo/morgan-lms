import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ExternalLink,
  CheckCircle2,
  Circle,
  Star,
  Zap,
  Award,
  BarChart3,
  Users,
  Rocket
} from 'lucide-react';

// Import our new data structures
import { 
  CERTIFICATIONS, 
  SKILL_TREES, 
  CAREER_PATHS, 
  MARKET_DATA,
  getPersonalizedRecommendations,
  type Certification 
} from './enhanced-skills-system';

interface CertificationCardProps {
  certification: Certification;
  onComplete: (certId: string) => void;
  theme: any;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ 
  certification, 
  onComplete, 
  theme 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return theme.warning;
      case 'high': return theme.accent;
      case 'medium': return theme.primary;
      default: return theme.gray;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="w-4 h-4" />;
      case 'high': return <Star className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-6 rounded-xl border transition-all duration-300"
      style={{
        background: certification.completed 
          ? `${theme.success}10` 
          : 'rgba(255,255,255,0.95)',
        borderColor: certification.completed 
          ? theme.success 
          : getPriorityColor(certification.priority),
        boxShadow: `0 4px 20px ${getPriorityColor(certification.priority)}20`
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {certification.completed ? (
              <CheckCircle2 className="w-5 h-5" style={{ color: theme.success }} />
            ) : (
              <div style={{ color: getPriorityColor(certification.priority) }}>
                {getPriorityIcon(certification.priority)}
              </div>
            )}
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${getPriorityColor(certification.priority)}20`,
                color: getPriorityColor(certification.priority)
              }}
            >
              {certification.priority.toUpperCase()}
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {certification.name}
          </h3>
          <p className="text-sm text-gray-600">
            by {certification.provider}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: theme.success }}>
            {certification.cost}
          </div>
          <div className="text-xs text-gray-500">
            {certification.timeToComplete}
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${theme.success}10` }}>
          <DollarSign className="w-5 h-5 mx-auto mb-1" style={{ color: theme.success }} />
          <div className="font-bold" style={{ color: theme.success }}>
            {certification.salaryImpact}
          </div>
          <div className="text-xs text-gray-600">Salary Impact</div>
        </div>
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
          <BarChart3 className="w-5 h-5 mx-auto mb-1" style={{ color: theme.primary }} />
          <div className="font-bold text-xs text-gray-700">
            {certification.difficulty}
          </div>
          <div className="text-xs text-gray-600">Difficulty</div>
        </div>
      </div>

      {/* Market Value */}
      <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.accent}10` }}>
        <div className="text-sm font-medium" style={{ color: theme.accent }}>
          💡 Market Value
        </div>
        <div className="text-xs text-gray-700 mt-1">
          {certification.marketValue}
        </div>
      </div>

      {/* Skills Impact */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Skills Enhanced:</div>
        <div className="flex flex-wrap gap-2">
          {certification.skills.map((skill) => (
            <span 
              key={skill}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!certification.completed ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(certification.directLink, '_blank')}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: getPriorityColor(certification.priority) }}
            >
              <ExternalLink className="w-4 h-4" />
              Start Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(certification.id)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              Mark Complete
            </motion.button>
          </>
        ) : (
          <div className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium text-center">
            ✅ Completed {certification.dateCompleted}
          </div>
        )}
      </div>

      {/* Next Steps */}
      {certification.nextSteps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Next Steps:</div>
          <div className="flex flex-wrap gap-2">
            {certification.nextSteps.slice(0, 2).map((next) => (
              <span key={next} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                {CERTIFICATIONS[next]?.name || next}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface RecommendationsWidgetProps {
  theme: any;
  onStartCertification: (certId: string) => void;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ 
  theme, 
  onStartCertification 
}) => {
  const recommendations = getPersonalizedRecommendations({}, 'emailSpecialist');

  return (
    <div className="p-6 rounded-xl" style={{ 
      background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}10)`,
      border: `1px solid ${theme.primary}30`
    }}>
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-6 h-6" style={{ color: theme.accent }} />
        <h3 className="text-xl font-bold text-gray-800">Your Next Steps</h3>
      </div>

      <div className="space-y-4">
        {/* Immediate Actions */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: theme.warning }} />
            This Week (High Impact!)
          </h4>
          {recommendations.immediate.map((rec, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg border-l-4 bg-white shadow-sm mb-2"
              style={{ borderLeftColor: theme.warning }}
            >
              <div className="font-medium text-gray-800">{rec.action}</div>
              <div className="text-sm text-gray-600 mt-1">{rec.reason}</div>
              <div className="text-sm font-medium mt-2" style={{ color: theme.success }}>
                💰 {rec.impact}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">{rec.timeToComplete}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => window.open(rec.link, '_blank')}
                  className="ml-auto text-xs px-3 py-1 rounded text-white"
                  style={{ backgroundColor: theme.warning }}
                >
                  Start Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* This Month */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" style={{ color: theme.primary }} />
            This Month
          </h4>
          {recommendations.thisMonth.map((rec, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white border border-gray-200"
            >
              <div className="font-medium text-gray-800">{rec.action}</div>
              <div className="text-sm text-gray-600">{rec.reason}</div>
              <div className="text-sm font-medium mt-1" style={{ color: theme.primary }}>
                📈 {rec.impact}
              </div>
            </div>
          ))}
        </div>

        {/* Strategic */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: theme.success }} />
            Strategic (6 months)
          </h4>
          {recommendations.strategic.map((rec, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white border border-gray-200"
            >
              <div className="font-medium text-gray-800">{rec.action}</div>
              <div className="text-sm text-gray-600">{rec.reason}</div>
              <div className="text-sm font-medium mt-1" style={{ color: theme.success }}>
                🚀 {rec.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MarketIntelligenceWidgetProps {
  theme: any;
}

export const MarketIntelligenceWidget: React.FC<MarketIntelligenceWidgetProps> = ({ theme }) => {
  return (
    <div className="p-6 rounded-xl" style={{ 
      background: `linear-gradient(135deg, ${theme.success}10, ${theme.primary}10)`,
      border: `1px solid ${theme.success}30`
    }}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6" style={{ color: theme.success }} />
        <h3 className="text-xl font-bold text-gray-800">Live Market Intel</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          Updated Today
        </span>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-white shadow-sm">
          <div className="text-2xl font-bold" style={{ color: theme.success }}>
            {MARKET_DATA.avgSalary}
          </div>
          <div className="text-xs text-gray-600">Avg Salary</div>
          <div className="text-xs font-medium" style={{ color: theme.success }}>
            {MARKET_DATA.salaryGrowth}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white shadow-sm">
          <div className="text-2xl font-bold" style={{ color: theme.primary }}>
            {MARKET_DATA.industryGrowth}
          </div>
          <div className="text-xs text-gray-600">Job Growth</div>
          <div className="text-xs text-gray-500">Above average</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white shadow-sm">
          <div className="text-2xl font-bold" style={{ color: theme.accent }}>
            {MARKET_DATA.remoteOpportunities}
          </div>
          <div className="text-xs text-gray-600">Remote Jobs</div>
          <div className="text-xs text-gray-500">Flexible work</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white shadow-sm">
          <div className="text-2xl font-bold" style={{ color: theme.warning }}>
            {MARKET_DATA.entryLevelJobs}
          </div>
          <div className="text-xs text-gray-600">Entry Level</div>
          <div className="text-xs text-gray-500">Great timing!</div>
        </div>
      </div>

      {/* Hot Skills */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          🔥 Skills in Highest Demand
        </h4>
        <div className="space-y-2">
          {MARKET_DATA.topSkillsInDemand.map((skill, index) => (
            <div key={skill.skill} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold" style={{ color: theme.gray }}>
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{skill.skill}</div>
                  <div className="text-xs text-gray-600">
                    {skill.demand}% of job postings
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: theme.success }}>
                  {skill.growth}
                </div>
                <div className="text-xs text-gray-500">growth</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SkillTreeVisualizationProps {
  skillTree: typeof SKILL_TREES.emailMarketing;
  theme: any;
  onSkillClick: (skillId: string) => void;
}

export const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({ 
  skillTree, 
  theme, 
  onSkillClick 
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  return (
    <div className="p-6 rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{skillTree.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-600">
              Current: {skillTree.currentLevel}/5.0
            </span>
            <span className="text-sm font-medium" style={{ color: theme.success }}>
              Target: {skillTree.targetLevel}/5.0
            </span>
            <span className="text-sm font-medium" style={{ color: theme.primary }}>
              {skillTree.salaryImpact} potential
            </span>
          </div>
        </div>
        <div className="text-right">
          <div 
            className="text-xs px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${theme.warning}20`,
              color: theme.warning
            }}
          >
            {skillTree.marketDemand.toUpperCase()} DEMAND
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((skillTree.currentLevel / skillTree.targetLevel) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(skillTree.currentLevel / skillTree.targetLevel) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-3 rounded-full"
            style={{ backgroundColor: theme.success }}
          />
        </div>
      </div>

      {/* Skill Branches */}
      <div className="space-y-4">
        {Object.entries(skillTree.branches).map(([branchKey, branch]) => (
          <motion.div
            key={branchKey}
            className="border rounded-lg overflow-hidden"
            style={{ borderColor: selectedBranch === branchKey ? theme.primary : '#e5e7eb' }}
          >
            <button
              onClick={() => setSelectedBranch(selectedBranch === branchKey ? null : branchKey)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-800">{branch.name}</div>
                <div className="text-sm text-gray-500">
                  {Object.keys(branch.skills).length} skills
                </div>
              </div>
            </button>
            
            <AnimatePresence>
              {selectedBranch === branchKey && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t bg-gray-50"
                >
                  <div className="p-4 space-y-3">
                    {Object.entries(branch.skills).map(([skillKey, skill]) => (
                      <motion.div
                        key={skillKey}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onSkillClick(skillKey)}
                        className="p-3 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800 capitalize">
                            {skillKey.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {skill.level}/{skill.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(skill.level / skill.target) * 100}%`,
                              backgroundColor: skill.level >= skill.target ? theme.success : theme.primary
                            }}
                          />
                        </div>
                        {skill.certification && (
                          <div className="text-xs text-gray-500 mt-1">
                            📜 {CERTIFICATIONS[skill.certification]?.name}
                          </div>
                        )}
                        {skill.timeToComplete && (
                          <div className="text-xs text-gray-500 mt-1">
                            ⏱️ {skill.timeToComplete}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default {
  CertificationCard,
  RecommendationsWidget,
  MarketIntelligenceWidget,
  SkillTreeVisualization
};