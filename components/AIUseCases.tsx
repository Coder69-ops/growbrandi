import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalculator, FaLightbulb, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
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
  const navigate = useNavigate();
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Project Type</label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Required Features</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {featuresOptions.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`text-xs px-3 py-2 rounded-full transition-all ${formData.features.includes(feature)
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-zinc-300 mb-2">Budget Range</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select budget</option>
              <option value="$300-$1K">$300 - $1K</option>
              <option value="$1K-$5K">$1K - $5K</option>
              <option value="$5K-$15K">$5K - $15K</option>
              <option value="$15K+">$15K+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            placeholder="e.g., Healthcare, E-commerce, Education"
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get GrowBrandi Estimation'}
        </button>
      </form>

      {estimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-blue-400">GrowBrandi Project Estimation</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-700/50 rounded-lg p-4">
              <p className="text-sm text-zinc-400">Estimated Cost</p>
              <p className="text-lg sm:text-xl font-bold text-white">{estimation.estimatedCost}</p>
            </div>
            <div className="bg-zinc-700/50 rounded-lg p-4">
              <p className="text-sm text-zinc-400">Timeline</p>
              <p className="text-lg sm:text-xl font-bold text-white">{estimation.estimatedTimeline}</p>
            </div>
          </div>

          {estimation.recommendations && (
            <div>
              <h4 className="font-semibold text-white mb-2">GrowBrandi Recommendations</h4>
              <ul className="space-y-1 text-sm text-zinc-300">
                {estimation.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate('/contact')}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Book Free Consultation
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Service Recommender Component
const ServiceRecommender = () => {
  const navigate = useNavigate();
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            placeholder="e.g., Healthcare, E-commerce, SaaS"
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Current Challenges</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {challengesOptions.map(challenge => (
              <button
                key={challenge}
                type="button"
                onClick={() => toggleOption(challenge, 'currentChallenges')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${formData.currentChallenges.includes(challenge)
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Business Goals</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {goalsOptions.map(goal => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleOption(goal, 'goals')}
                className={`text-xs px-3 py-2 rounded-full transition-all ${formData.goals.includes(goal)
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Budget</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select budget</option>
              <option value="$300-$1K">$300 - $1K</option>
              <option value="$1K-$5K">$1K - $5K</option>
              <option value="$5K-$15K">$5K - $15K</option>
              <option value="$15K+">$15K+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
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
          {loading ? 'Analyzing...' : 'Get GrowBrandi Recommendations'}
        </button>
      </form>

      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-blue-400">GrowBrandi Service Recommendations</h3>

          {recommendations.priorityServices && (
            <div className="space-y-3">
              {recommendations.priorityServices.map((service: any, idx: number) => (
                <div key={idx} className="bg-zinc-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{service.service}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-600' :
                      service.priority === 'Medium' ? 'bg-yellow-600' : 'bg-cyan-600'
                      } text-white`}>
                      {service.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{service.reason}</p>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Expected: {service.expectedOutcome}</span>
                    <span>{service.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/contact')}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Get Started with These Services
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Business Growth Analyzer Component
const BusinessGrowthAnalyzer = () => {
  const navigate = useNavigate();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Current Revenue</label>
            <select
              value={formData.currentRevenue}
              onChange={(e) => setFormData(prev => ({ ...prev, currentRevenue: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
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
            <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., SaaS, E-commerce"
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Market Position</label>
          <select
            value={formData.marketPosition}
            onChange={(e) => setFormData(prev => ({ ...prev, marketPosition: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Digital Presence</label>
          <select
            value={formData.digitalPresence}
            onChange={(e) => setFormData(prev => ({ ...prev, digitalPresence: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Competitors Level</label>
          <select
            value={formData.competitorsLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, competitorsLevel: e.target.value }))}
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
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
          {loading ? 'Analyzing...' : 'Get GrowBrandi Growth Analysis'}
        </button>
      </form>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-purple-400">GrowBrandi Growth Analysis</h3>

          <div className="bg-zinc-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Growth Potential</h4>
            <p className="text-zinc-300">{analysis.growthPotential}</p>
          </div>

          {analysis.predictions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-400">6 Months</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.sixMonths}</p>
              </div>
              <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-400">1 Year</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.oneYear}</p>
              </div>
              <div className="bg-zinc-700/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-400">3 Years</p>
                <p className="text-sm font-semibold text-white">{analysis.predictions.threeYears}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/contact')}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/20"
          >
            Discuss Growth Strategy
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Consultation Planner Component
const ConsultationPlanner = () => {
  const navigate = useNavigate();
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
          <label className="block text-sm font-medium text-zinc-300 mb-2">Business Type</label>
          <input
            type="text"
            value={formData.businessType}
            onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
            placeholder="e.g., Tech Startup, Restaurant, Consulting"
            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Specific Needs</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {needsOptions.map(need => (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className={`text-xs px-3 py-2 rounded-full transition-all ${formData.specificNeeds.includes(need)
                  ? 'bg-cyan-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Urgency</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
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
            <label className="block text-sm font-medium text-zinc-300 mb-2">Experience Level</label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500"
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
          {loading ? 'Planning...' : 'Create GrowBrandi Plan'}
        </button>
      </form>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-cyan-400">Your Personalized GrowBrandi Plan</h3>

          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-4 border border-cyan-500/30">
            <p className="text-white font-medium mb-2">Recommended Session</p>
            <p className="text-zinc-300 text-sm">{plan.consultationType} - {plan.recommendedDuration}</p>
          </div>

          {plan.personalizedMessage && (
            <div className="bg-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300 italic">"{plan.personalizedMessage}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.keyTopics && (
              <div>
                <h4 className="font-semibold text-white mb-2">Discussion Topics</h4>
                <ul className="space-y-1 text-sm text-zinc-300">
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
                <ul className="space-y-1 text-sm text-zinc-300">
                  {plan.expectedOutcomes.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-cyan-400">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
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
      title: 'GrowBrandi Project Estimator',
      description: 'Get instant project cost and timeline estimates powered by GrowBrandi intelligence',
      icon: <FaCalculator className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-cyan-500',
      demo: ProjectEstimator
    },
    {
      id: 'recommender',
      title: 'GrowBrandi Service Recommender',
      description: 'Discover the perfect growth services for your business with GrowBrandi guidance',
      icon: <FaLightbulb className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-indigo-500',
      demo: ServiceRecommender
    },
    {
      id: 'analyzer',
      title: 'Business Growth Analyzer',
      description: 'Analyze your market position and get data-driven growth predictions',
      icon: <FaChartBar className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-purple-500 to-pink-500',
      demo: BusinessGrowthAnalyzer
    },
    {
      id: 'planner',
      title: 'Strategic Consultation Planner',
      description: 'Create a personalized consultation agenda tailored to your business needs',
      icon: <FaCalendarAlt className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-cyan-500 to-blue-500',
      demo: ConsultationPlanner
    }
  ];

  const ActiveDemo = useCases.find(u => u.id === activeUseCase)?.demo || ProjectEstimator;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            AI-Powered Growth Tools
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Leverage our advanced AI tools to estimate projects, discover services, and analyze your business growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-4">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveUseCase(useCase.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${activeUseCase === useCase.id
                  ? `bg-zinc-900 border-zinc-700 shadow-lg shadow-${useCase.color.split('-')[1]}-500/10`
                  : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${useCase.color} text-white`}>
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${activeUseCase === useCase.id ? 'text-white' : 'text-zinc-300'
                      }`}>
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeUseCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {useCases.find(u => u.id === activeUseCase)?.title}
                </h2>
                <p className="text-zinc-400">
                  {useCases.find(u => u.id === activeUseCase)?.description}
                </p>
              </div>

              <ActiveDemo />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIUseCases;