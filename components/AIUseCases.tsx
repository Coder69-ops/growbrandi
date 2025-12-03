import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaLightbulb, FaChartBar, FaCalendarAlt, FaCheck, FaArrowRight, FaSpinner, FaChevronLeft, FaChartLine, FaRocket, FaBullseye, FaChartPie } from 'react-icons/fa';
import {
  estimateProject,
  recommendServices,
  analyzeBusinessGrowth,
  generateConsultationPlan
} from '../services/geminiService';
import AILoader from './AILoader';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

// --- Shared UI Components ---

const InputField = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      {...props}
      className="w-full bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
    />
  </div>
);

const SelectField = ({ label, options, ...props }: any) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <select
        {...props}
        className="w-full bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-zinc-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);

const OptionButton = ({ selected, onClick, children, colorClass = 'bg-blue-600' }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 border ${selected
      ? `${colorClass} text-white border-transparent shadow-lg shadow-blue-500/20`
      : 'bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white'
      }`}
  >
    {children}
  </button>
);

const ResultCard = ({ title, children, color = "blue" }: any) => (
  <GlassCard
    className={`p-6 md:p-8 border-t-4 border-t-${color}-500`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className={`text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3`}>
      <span className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500 dark:text-${color}-400`}>
        <FaRocket className="w-5 h-5" />
      </span>
      {title}
    </h3>
    {children}
  </GlassCard>
);

// --- Project Estimator Component ---

const ProjectEstimator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    timeline: '',
    budget: '',
    industry: '',
    name: '',
    email: ''
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
    'E-commerce', 'Auth', 'Payments', 'Chat', 'Analytics',
    'Mobile App', 'API', 'CMS', 'SEO', 'Social'
  ];

  return (
    <div className="space-y-8">
      <GlassCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Project Type"
              value={formData.projectType}
              onChange={(e: any) => setFormData({ ...formData, projectType: e.target.value })}
              options={[
                { value: "", label: "Select Type" },
                { value: "Website", label: "Website" },
                { value: "Web App", label: "Web Application" },
                { value: "Mobile App", label: "Mobile App" },
                { value: "E-commerce", label: "E-commerce" },
                { value: "Branding", label: "Branding" }
              ]}
              required
            />
            <InputField
              label="Industry"
              value={formData.industry}
              onChange={(e: any) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g. Healthcare"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1 mb-3">Features</label>
            <div className="flex flex-wrap gap-2">
              {featuresOptions.map(feature => (
                <OptionButton
                  key={feature}
                  selected={formData.features.includes(feature)}
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Timeline"
              value={formData.timeline}
              onChange={(e: any) => setFormData({ ...formData, timeline: e.target.value })}
              options={[
                { value: "", label: "Select Timeline" },
                { value: "1-2 weeks", label: "1-2 weeks" },
                { value: "1 month", label: "1 month" },
                { value: "2-3 months", label: "2-3 months" },
                { value: "3-6 months", label: "3-6 months" },
                { value: "6+ months", label: "6+ months" }
              ]}
              required
            />
            <SelectField
              label="Budget"
              value={formData.budget}
              onChange={(e: any) => setFormData({ ...formData, budget: e.target.value })}
              options={[
                { value: "", label: "Select Budget" },
                { value: "$300-$1K", label: "$300 - $1K" },
                { value: "$1K-$5K", label: "$1K - $5K" },
                { value: "$5K-$15K", label: "$5K - $15K" },
                { value: "$15K+", label: "$15K+" }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? 'Processing...' : 'Get Estimation'}
          </button>
        </form>
      </GlassCard>

      <AnimatePresence>
        {loading && <AILoader />}
        {estimation && (
          <ResultCard title="Project Estimation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{estimation.estimatedCost}</p>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Timeline</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{estimation.estimatedTimeline}</p>
              </div>
            </div>

            {estimation.costBreakdown && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Cost Breakdown</h4>
                <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                  {estimation.costBreakdown.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.service}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500">{item.description}</p>
                      </div>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {estimation.potentialChallenges && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Potential Challenges & Solutions</h4>
                <ul className="space-y-2">
                  {estimation.potentialChallenges.map((challenge: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {estimation.recommendations && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {estimation.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                      <FaCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {estimation.nextSteps && (
              <div className="mb-6 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h4 className="font-bold text-blue-400 mb-2 text-sm uppercase tracking-wider">Recommended Next Steps</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-zinc-300">
                  {estimation.nextSteps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'estimator',
                  data: estimation,
                  userInfo: { name: formData.name, email: formData.email }
                }
              })}
              className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
              Book Consultation <FaArrowRight className="w-4 h-4" />
            </button>
          </ResultCard>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Service Recommender Component ---

const ServiceRecommender = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    industry: '',
    currentChallenges: [] as string[],
    goals: [] as string[],
    budget: '',
    timeline: '',
    name: '',
    email: ''
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-8">
      <GlassCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Industry"
            value={formData.industry}
            onChange={(e: any) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g. SaaS, Retail"
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1 mb-3">Challenges</label>
            <div className="flex flex-wrap gap-2">
              {['Low Traffic', 'Low Conversion', 'Brand Identity', 'Tech Issues', 'Mobile UX', 'SEO'].map(opt => (
                <OptionButton
                  key={opt}
                  selected={formData.currentChallenges.includes(opt)}
                  onClick={() => toggleOption(opt, 'currentChallenges')}
                  colorClass="bg-red-500"
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1 mb-3">Goals</label>
            <div className="flex flex-wrap gap-2">
              {['More Sales', 'Awareness', 'Leads', 'Engagement', 'New Market', 'Better UX'].map(opt => (
                <OptionButton
                  key={opt}
                  selected={formData.goals.includes(opt)}
                  onClick={() => toggleOption(opt, 'goals')}
                  colorClass="bg-green-500"
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Budget"
              value={formData.budget}
              onChange={(e: any) => setFormData({ ...formData, budget: e.target.value })}
              options={[
                { value: "", label: "Select Budget" },
                { value: "$300-$1K", label: "$300 - $1K" },
                { value: "$1K-$5K", label: "$1K - $5K" },
                { value: "$5K-$15K", label: "$5K - $15K" },
                { value: "$15K+", label: "$15K+" }
              ]}
              required
            />
            <SelectField
              label="Timeline"
              value={formData.timeline}
              onChange={(e: any) => setFormData({ ...formData, timeline: e.target.value })}
              options={[
                { value: "", label: "Select Timeline" },
                { value: "Immediate", label: "Immediate" },
                { value: "Short-term", label: "Short-term" },
                { value: "Medium-term", label: "Medium-term" },
                { value: "Long-term", label: "Long-term" }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transform hover:scale-[1.02]"
          >
            {loading ? 'Processing...' : 'Get Recommendations'}
          </button>
        </form>
      </GlassCard>

      <AnimatePresence>
        {loading && <AILoader />}
        {recommendations && (
          <ResultCard title="Recommended Services" color="indigo">
            <div className="space-y-4 mb-6">
              {recommendations.priorityServices?.map((service: any, idx: number) => (
                <div key={idx} className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">{service.service}</h4>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                      {service.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 mb-3">{service.reason}</p>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500 border-t border-slate-200 dark:border-white/5 pt-3">
                    <span>{service.expectedOutcome}</span>
                    <span>{service.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>

            {recommendations.strategicPlan && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Strategic Implementation Plan</h4>
                <div className="space-y-4">
                  {recommendations.strategicPlan.map((phase: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-indigo-500/30">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500" />
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-bold text-indigo-400 text-sm">{phase.phase}</h5>
                        <span className="text-xs text-slate-500 dark:text-zinc-500">{phase.duration}</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                        {phase.activities.map((activity: string, aIdx: number) => (
                          <li key={aIdx}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.expectedResults && (
              <div className="mb-6 bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
                <h4 className="font-bold text-indigo-400 mb-2 text-sm uppercase tracking-wider">Expected Outcomes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendations.expectedResults.map((result: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
                      <FaChartLine className="w-3 h-3 text-indigo-400" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'recommender',
                  data: recommendations,
                  userInfo: { name: formData.name, email: formData.email }
                }
              })}
              className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
              Start Projects <FaArrowRight className="w-4 h-4" />
            </button>
          </ResultCard>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Business Growth Analyzer Component ---

const BusinessGrowthAnalyzer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentRevenue: '',
    industry: '',
    marketPosition: '',
    digitalPresence: '',
    competitorsLevel: '',
    name: '',
    email: ''
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
    <div className="space-y-8 relative">
      {/* Priority 3: Brand Growth Visual Artifact (Floating Charts) */}
      <div className="hidden lg:block absolute -right-32 top-10 w-64 h-64 pointer-events-none z-0 opacity-50">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-xl transform rotate-12"
        >
          <div className="flex items-end justify-between h-full gap-2">
            <motion.div animate={{ height: ['30%', '60%', '30%'] }} transition={{ duration: 3, repeat: Infinity }} className="w-full bg-purple-400/50 rounded-t-sm" />
            <motion.div animate={{ height: ['50%', '80%', '50%'] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="w-full bg-pink-400/50 rounded-t-sm" />
            <motion.div animate={{ height: ['40%', '90%', '40%'] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="w-full bg-blue-400/50 rounded-t-sm" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-6 shadow-xl flex items-center justify-center"
        >
          <FaChartPie className="w-full h-full text-purple-300/50" />
        </motion.div>
      </div>

      <GlassCard className="p-6 md:p-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Revenue"
              value={formData.currentRevenue}
              onChange={(e: any) => setFormData({ ...formData, currentRevenue: e.target.value })}
              options={[
                { value: "", label: "Select Revenue" },
                { value: "$0-$10K", label: "$0 - $10K" },
                { value: "$10K-$100K", label: "$10K - $100K" },
                { value: "$100K-$1M", label: "$100K - $1M" },
                { value: "$1M+", label: "$1M+" }
              ]}
              required
            />
            <InputField
              label="Industry"
              value={formData.industry}
              onChange={(e: any) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g. SaaS"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField
              label="Position"
              value={formData.marketPosition}
              onChange={(e: any) => setFormData({ ...formData, marketPosition: e.target.value })}
              options={[
                { value: "", label: "Select" },
                { value: "Leader", label: "Leader" },
                { value: "Established", label: "Established" },
                { value: "Startup", label: "Startup" },
                { value: "New", label: "New" }
              ]}
              required
            />
            <SelectField
              label="Presence"
              value={formData.digitalPresence}
              onChange={(e: any) => setFormData({ ...formData, digitalPresence: e.target.value })}
              options={[
                { value: "", label: "Select" },
                { value: "Strong", label: "Strong" },
                { value: "Moderate", label: "Moderate" },
                { value: "Weak", label: "Weak" },
                { value: "None", label: "None" }
              ]}
              required
            />
            <SelectField
              label="Competition"
              value={formData.competitorsLevel}
              onChange={(e: any) => setFormData({ ...formData, competitorsLevel: e.target.value })}
              options={[
                { value: "", label: "Select" },
                { value: "High", label: "High" },
                { value: "Moderate", label: "Moderate" },
                { value: "Low", label: "Low" }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transform hover:scale-[1.02]"
          >
            {loading ? 'Processing...' : 'Analyze Growth'}
          </button>
        </form>
      </GlassCard>

      <AnimatePresence>
        {loading && <AILoader />}
        {analysis && (
          <ResultCard title="Growth Analysis" color="purple">
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-200 dark:border-white/5 mb-6 text-center">
              <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Growth Potential</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {analysis.growthPotential}
              </p>
            </div>

            {analysis.predictions && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['sixMonths', 'oneYear', 'threeYears'].map((period, idx) => (
                  <div key={period} className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      {period === 'sixMonths' ? '6 Mo' : period === 'oneYear' ? '1 Yr' : '3 Yrs'}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {analysis.predictions[period]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {analysis.marketOpportunities && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Market Opportunities</h4>
                <div className="grid grid-cols-1 gap-3">
                  {analysis.marketOpportunities.map((opp: string, idx: number) => (
                    <div key={idx} className="bg-slate-100 dark:bg-zinc-800/30 rounded-lg p-3 border border-slate-200 dark:border-white/5 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <FaLightbulb className="w-3 h-3" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-zinc-300">{opp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.digitalGaps && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Digital Gaps to Address</h4>
                <ul className="space-y-2">
                  {analysis.digitalGaps.map((gap: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-500 dark:text-zinc-400">
                      <span className="text-red-400 mt-0.5">⚠</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendedActions && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Strategic Action Plan</h4>
                <div className="space-y-3">
                  {analysis.recommendedActions.map((action: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{action.action}</h5>
                        <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded-full">{action.timeframe}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">Impact: <span className="text-slate-700 dark:text-white">{action.impact}</span></p>
                      <p className="text-xs text-zinc-500">Est. Investment: {action.investment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'analyzer',
                  data: analysis,
                  userInfo: { name: formData.name, email: formData.email }
                }
              })}
              className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
              Discuss Strategy <FaArrowRight className="w-4 h-4" />
            </button>
          </ResultCard>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Consultation Planner Component ---

const ConsultationPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessType: '',
    specificNeeds: [] as string[],
    urgency: '',
    experience: '',
    name: '',
    email: ''
  });
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-8">
      <GlassCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Business Type"
            value={formData.businessType}
            onChange={(e: any) => setFormData({ ...formData, businessType: e.target.value })}
            placeholder="e.g. Startup"
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider ml-1 mb-3">Needs</label>
            <div className="flex flex-wrap gap-2">
              {['Web Dev', 'Strategy', 'Marketing', 'SEO', 'Social', 'E-commerce', 'Content'].map(opt => (
                <OptionButton
                  key={opt}
                  selected={formData.specificNeeds.includes(opt)}
                  onClick={() => toggleNeed(opt)}
                  colorClass="bg-cyan-500"
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Urgency"
              value={formData.urgency}
              onChange={(e: any) => setFormData({ ...formData, urgency: e.target.value })}
              options={[
                { value: "", label: "Select" },
                { value: "ASAP", label: "ASAP" },
                { value: "This Month", label: "This Month" },
                { value: "Next Month", label: "Next Month" },
                { value: "Flexible", label: "Flexible" }
              ]}
              required
            />
            <SelectField
              label="Experience"
              value={formData.experience}
              onChange={(e: any) => setFormData({ ...formData, experience: e.target.value })}
              options={[
                { value: "", label: "Select" },
                { value: "New to Digital", label: "New to Digital" },
                { value: "Some Experience", label: "Some Experience" },
                { value: "Experienced", label: "Experienced" }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 transform hover:scale-[1.02]"
          >
            {loading ? 'Processing...' : 'Generate Plan'}
          </button>
        </form>
      </GlassCard>

      <AnimatePresence>
        {loading && <AILoader />}
        {plan && (
          <ResultCard title="Consultation Plan" color="cyan">
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3">Recommended Agenda</h4>
              <div className="space-y-4">
                {plan.agenda?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{item.topic}</h5>
                      <p className="text-sm text-slate-600 dark:text-zinc-400">{item.description}</p>
                      <span className="text-xs text-cyan-500 font-medium">{item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {plan.preparation && (
              <div className="mb-6 bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200 dark:border-white/5">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Preparation Checklist</h4>
                <ul className="space-y-2">
                  {plan.preparation.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'planner',
                  data: plan,
                  userInfo: { name: formData.name, email: formData.email }
                }
              })}
              className="w-full py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
              Schedule Call <FaArrowRight className="w-4 h-4" />
            </button>
          </ResultCard>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main AI Use Cases Component ---

const AIUseCases: React.FC = () => {
  const [activeTab, setActiveTab] = useState('estimator');

  const tabs = [
    { id: 'estimator', label: 'Project Estimator', icon: <FaCalculator /> },
    { id: 'recommender', label: 'Service Recommender', icon: <FaLightbulb /> },
    { id: 'analyzer', label: 'Growth Analyzer', icon: <FaChartBar /> },
    { id: 'planner', label: 'Consultation Planner', icon: <FaCalendarAlt /> }
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      <BackgroundEffects />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="AI-Powered Tools"
          title="Intelligent Business"
          highlight="Insights"
          description="Leverage our advanced AI tools to get instant estimates, strategic recommendations, and growth analysis for your business."
        />

        {/* Tabs */}
        <div className="flex justify-center mb-12 overflow-x-auto px-4 pb-4">
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-2 inline-flex gap-2 border border-slate-200 dark:border-white/5 shadow-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                    ? 'text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'estimator' && <ProjectEstimator />}
              {activeTab === 'recommender' && <ServiceRecommender />}
              {activeTab === 'analyzer' && <BusinessGrowthAnalyzer />}
              {activeTab === 'planner' && <ConsultationPlanner />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AIUseCases;