import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  estimateProject, 
  recommendServices, 
  analyzeBusinessGrowth, 
  generateConsultationPlan 
} from '../services/geminiService';

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  demo: React.ComponentType<any>;
}

// Project Estimator Component
const ProjectEstimator = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    timeline: '',
    budget: '',
    industry: ''
  });
  const [estimation, setEstimation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await estimateProject(formData);
      setEstimation(result);
    } catch (error) {
      console.error('Estimation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const featuresOptions = [
    'E-commerce Integration', 'User Authentication', 'Payment Gateway',
    'Real-time Chat', 'Analytics Dashboard', 'Mobile App', 'API Integration',
    'Content Management', 'SEO Optimization', 'Social Media Integration'
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Project Type</label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select project type</option>
            <option value="Website">Website</option>
            <option value="Web App">Web Application</option>
            <option value="Mobile App">Mobile App</option>
            <option value="E-commerce">E-commerce Platform</option>
            <option value="Branding">Branding & Design</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Required Features</label>
          <div className="grid grid-cols-2 gap-2">
            {featuresOptions.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`text-xs px-3 py-2 rounded-full transition-all ${
                  formData.features.includes(feature)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select timeline</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Budget Range</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select budget</option>
              <option value="$1K-$5K">$1K - $5K</option>
              <option value="$5K-$15K">$5K - $15K</option>
              <option value="$15K-$50K">$15K - $50K</option>
              <option value="$50K+">$50K+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            placeholder="e.g., Healthcare, E-commerce, Education"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get AI Estimation'}
        </button>
      </form>

      {estimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-emerald-400">AI Project Estimation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">Estimated Cost</p>
              <p className="text-xl font-bold text-white">{estimation.estimatedCost}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400">Timeline</p>
              <p className="text-xl font-bold text-white">{estimation.estimatedTimeline}</p>
            </div>
          </div>

          {estimation.recommendations && (
            <div>
              <h4 className="font-semibold text-white mb-2">AI Recommendations</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {estimation.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Service Recommender Component
const ServiceRecommender = () => {
  const [formData, setFormData] = useState({
    industry: '',
    currentChallenges: [] as string[],
    goals: [] as string[],
    budget: '',
    timeline: ''
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const challengesOptions = [
    'Low website traffic', 'Poor conversion rates', 'Weak brand identity',
    'Lack of online presence', 'Ineffective marketing', 'Technical issues',
    'Mobile responsiveness', 'Slow loading speed', 'Poor user experience'
  ];

  const goalsOptions = [
    'Increase sales', 'Build brand awareness', 'Generate more leads',
    'Improve user engagement', 'Expand market reach', 'Enhance customer experience',
    'Launch new products', 'Enter new markets', 'Improve SEO rankings'
  ];

  const toggleOption = (option: string, field: 'currentChallenges' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await recommendServices(formData);
      setRecommendations(result);
    } catch (error) {
      console.error('Service recommendation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            placeholder="e.g., Healthcare, E-commerce, SaaS"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Current Challenges</label>
          <div className="grid grid-cols-2 gap-2">
            {challengesOptions.map(challenge => (
              <button
                key={challenge}
                type="button"
                onClick={() => toggleOption(challenge, 'currentChallenges')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${
                  formData.currentChallenges.includes(challenge)
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Business Goals</label>
          <div className="grid grid-cols-2 gap-2">
            {goalsOptions.map(goal => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleOption(goal, 'goals')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${
                  formData.goals.includes(goal)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Budget</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select budget</option>
              <option value="$1K-$5K">$1K - $5K</option>
              <option value="$5K-$15K">$5K - $15K</option>
              <option value="$15K-$50K">$15K - $50K</option>
              <option value="$50K+">$50K+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select timeline</option>
              <option value="Immediate">Immediate (1-2 weeks)</option>
              <option value="Short-term">Short-term (1-2 months)</option>
              <option value="Medium-term">Medium-term (3-6 months)</option>
              <option value="Long-term">Long-term (6+ months)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get Service Recommendations'}
        </button>
      </form>

      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-blue-400">AI Service Recommendations</h3>
          
          {recommendations.priorityServices && (
            <div className="space-y-3">
              {recommendations.priorityServices.map((service: any, idx: number) => (
                <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{service.service}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.priority === 'High' ? 'bg-red-600' :
                      service.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                    } text-white`}>
                      {service.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{service.reason}</p>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Expected: {service.expectedOutcome}</span>
                    <span>{service.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Business Growth Analyzer Component
const BusinessGrowthAnalyzer = () => {
  const [formData, setFormData] = useState({
    currentRevenue: '',
    industry: '',
    marketPosition: '',
    digitalPresence: '',
    competitorsLevel: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await analyzeBusinessGrowth(formData);
      setAnalysis(result);
    } catch (error) {
      console.error('Business analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Revenue</label>
            <select
              value={formData.currentRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, currentRevenue: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select revenue range</option>
              <option value="$0-$10K">$0 - $10K</option>
              <option value="$10K-$100K">$10K - $100K</option>
              <option value="$100K-$1M">$100K - $1M</option>
              <option value="$1M+">$1M+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., SaaS, E-commerce"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Market Position</label>
          <select
            value={formData.marketPosition}
            onChange={(e) => setFormData(prev => ({ ...prev, marketPosition: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select position</option>
            <option value="Market Leader">Market Leader</option>
            <option value="Established Player">Established Player</option>
            <option value="Growing Startup">Growing Startup</option>
            <option value="New Entrant">New Entrant</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Digital Presence</label>
          <select
            value={formData.digitalPresence}
            onChange={(e) => setFormData(prev => ({ ...prev, digitalPresence: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select digital presence</option>
            <option value="Strong">Strong (SEO optimized, active social media)</option>
            <option value="Moderate">Moderate (Basic website, some social presence)</option>
            <option value="Weak">Weak (Minimal online presence)</option>
            <option value="None">None (Just starting)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Competitors Level</label>
          <select
            value={formData.competitorsLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, competitorsLevel: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select competition level</option>
            <option value="Highly Competitive">Highly Competitive</option>
            <option value="Moderately Competitive">Moderately Competitive</option>
            <option value="Low Competition">Low Competition</option>
            <option value="Blue Ocean">Blue Ocean (New Market)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Growth Potential'}
        </button>
      </form>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-purple-400">AI Growth Analysis</h3>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Growth Potential</h4>
            <p className="text-slate-300">{analysis.growthPotential}</p>
          </div>

          {analysis.predictions && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">6 Months</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.sixMonths}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">1 Year</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.oneYear}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">3 Years</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.threeYears}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Consultation Planner Component
const ConsultationPlanner = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    specificNeeds: [] as string[],
    urgency: '',
    experience: ''
  });
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const needsOptions = [
    'Website Development', 'Brand Strategy', 'Digital Marketing',
    'SEO Optimization', 'Social Media', 'E-commerce Setup',
    'Content Creation', 'Analytics Setup', 'Technical Consulting'
  ];

  const toggleNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      specificNeeds: prev.specificNeeds.includes(need)
        ? prev.specificNeeds.filter(n => n !== need)
        : [...prev.specificNeeds, need]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateConsultationPlan(formData);
      setPlan(result);
    } catch (error) {
      console.error('Consultation planning failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
          <input
            type="text"
            value={formData.businessType}
            onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
            placeholder="e.g., Tech Startup, Restaurant, Consulting"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Specific Needs</label>
          <div className="grid grid-cols-2 gap-2">
            {needsOptions.map(need => (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className={`text-xs px-3 py-2 rounded-full transition-all ${
                  formData.specificNeeds.includes(need)
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Urgency</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select urgency</option>
              <option value="Immediate">Immediate (ASAP)</option>
              <option value="High">High (This week)</option>
              <option value="Medium">Medium (This month)</option>
              <option value="Low">Low (Planning ahead)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">Select experience</option>
              <option value="Beginner">Beginner (New to digital)</option>
              <option value="Intermediate">Intermediate (Some experience)</option>
              <option value="Advanced">Advanced (Tech-savvy)</option>
              <option value="Expert">Expert (Industry professional)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Planning...' : 'Create Consultation Plan'}
        </button>
      </form>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-cyan-400">Your Personalized Consultation Plan</h3>
          
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-4 border border-cyan-500/30">
            <p className="text-white font-medium mb-2">Recommended Session</p>
            <p className="text-slate-300 text-sm">{plan.consultationType} - {plan.recommendedDuration}</p>
          </div>

          {plan.personalizedMessage && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-300 italic">"{plan.personalizedMessage}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.keyTopics && (
              <div>
                <h4 className="font-semibold text-white mb-2">Discussion Topics</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {plan.keyTopics.map((topic: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-cyan-400">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.expectedOutcomes && (
              <div>
                <h4 className="font-semibold text-white mb-2">Expected Outcomes</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {plan.expectedOutcomes.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all">
            Book This Consultation
          </button>
        </motion.div>
      )}
    </div>
  );
};

const AIUseCases: React.FC = () => {
  const [activeUseCase, setActiveUseCase] = useState<string>('estimator');

  const useCases: UseCase[] = [
    {
      id: 'estimator',
      title: 'AI Project Estimator',
      description: 'Get instant project cost and timeline estimates powered by AI analysis',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
      demo: ProjectEstimator
    },
    {
      id: 'recommender',
      title: 'Service Recommender',
      description: 'Discover the perfect services for your business goals with AI guidance',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-500',
      demo: ServiceRecommender
    },
    {
      id: 'analyzer',
      title: 'Growth Analyzer',
      description: 'Analyze your business growth potential with AI-powered insights',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      demo: BusinessGrowthAnalyzer
    },
    {
      id: 'planner',
      title: 'Consultation Planner',
      description: 'Plan your perfect consultation session with personalized AI recommendations',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-cyan-500 to-blue-500',
      demo: ConsultationPlanner
    }
  ];

  const ActiveDemo = useCases.find(uc => uc.id === activeUseCase)?.demo || ProjectEstimator;

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              AI-Powered Business{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the future of business consulting with our interactive AI tools that provide 
              instant insights, recommendations, and actionable strategies tailored to your unique needs.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Use Case Selector */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {useCases.map((useCase) => (
                <motion.button
                  key={useCase.id}
                  onClick={() => setActiveUseCase(useCase.id)}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
                    activeUseCase === useCase.id
                      ? 'bg-gradient-to-r ' + useCase.color + ' text-white shadow-2xl scale-105'
                      : 'bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-700/50 hover:scale-102'
                  }`}
                  whileHover={{ scale: activeUseCase === useCase.id ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 ${
                      activeUseCase === useCase.id ? 'text-white' : 'text-slate-400'
                    }`}>
                      {useCase.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                      <p className={`text-sm ${
                        activeUseCase === useCase.id ? 'text-white/90' : 'text-slate-400'
                      }`}>
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active Demo */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeUseCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {useCases.find(uc => uc.id === activeUseCase)?.title}
                </h3>
                <p className="text-slate-300">
                  {useCases.find(uc => uc.id === activeUseCase)?.description}
                </p>
              </div>
              
              <ActiveDemo />
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-slate-300 mb-6">
              Get personalized recommendations and start your journey with AI-powered business intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all">
                Schedule Free Consultation
              </button>
              <button className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all">
                Start Live Chat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIUseCases;