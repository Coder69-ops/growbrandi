import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalculator, FaLightbulb, FaChartBar, FaCalendarAlt, FaCheck, FaArrowRight, FaSpinner, FaChevronLeft } from 'react-icons/fa';
import {
  estimateProject,
  recommendServices,
  analyzeBusinessGrowth,
  generateConsultationPlan
} from '../services/geminiService';

// --- Shared UI Components ---

const InputField = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      {...props}
      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
    />
  </div>
);

const SelectField = ({ label, options, ...props }: any) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <select
        {...props}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
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
      : 'bg-zinc-800/50 text-zinc-400 border-white/5 hover:bg-zinc-700 hover:text-white'
      }`}
  >
    {children}
  </button>
);

const ResultCard = ({ title, children, color = "blue" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-zinc-900/80 backdrop-blur-xl border border-${color}-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden`}
  >
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-500 to-transparent`} />
    <h3 className={`text-xl font-bold text-white mb-6 flex items-center gap-2`}>
      <span className={`text-${color}-400`}>AI Analysis:</span> {title}
    </h3>
    {children}
  </motion.div>
);

const AILoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-xl transition-all duration-500">
    <div className="relative flex flex-col items-center z-10">
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30 blur-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
        <div className="relative w-32 h-32 bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          <img
            src="/growbrandi-logo.png"
            alt="GrowBrandi"
            className="w-20 h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
        </div>
      </motion.div>

      <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative mb-4">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '50%' }}
        />
      </div>

      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-zinc-400 text-sm font-medium tracking-[0.2em] uppercase">Analyzing Data</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-blue-400 text-sm"
        >
          ●
        </motion.span>
      </motion.div>
    </div>
  </div>
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
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 mb-3">Features</label>
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
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Get Estimation'}
        </button>
      </form>

      <AnimatePresence>
        {loading && <AILoader />}
        {estimation && (
          <ResultCard title="Project Estimation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold text-white">{estimation.estimatedCost}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Timeline</p>
                <p className="text-2xl font-bold text-white">{estimation.estimatedTimeline}</p>
              </div>
            </div>

            {estimation.recommendations && (
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {estimation.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <FaCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'estimator',
                  data: estimation,
                  userInfo: { name: formData.name, email: formData.email },
                  autoSend: true
                }
              })}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 font-semibold"
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Industry"
          value={formData.industry}
          onChange={(e: any) => setFormData({ ...formData, industry: e.target.value })}
          placeholder="e.g. SaaS, Retail"
          required
        />

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 mb-3">Challenges</label>
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
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 mb-3">Goals</label>
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
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Get Recommendations'}
        </button>
      </form>

      <AnimatePresence>
        {loading && <AILoader />}
        {recommendations && (
          <ResultCard title="Recommended Services" color="indigo">
            <div className="space-y-4 mb-6">
              {recommendations.priorityServices?.map((service: any, idx: number) => (
                <div key={idx} className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{service.service}</h4>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                      {service.priority}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{service.reason}</p>
                  <div className="flex justify-between text-xs text-zinc-500 border-t border-white/5 pt-3">
                    <span>{service.expectedOutcome}</span>
                    <span>{service.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'recommender',
                  data: recommendations,
                  userInfo: { name: formData.name, email: formData.email },
                  autoSend: true
                }
              })}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 font-semibold"
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
    <div className="space-y-8">
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
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Analyze Growth'}
        </button>
      </form>

      <AnimatePresence>
        {loading && <AILoader />}
        {analysis && (
          <ResultCard title="Growth Analysis" color="purple">
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-white/5 mb-6 text-center">
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Growth Potential</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {analysis.growthPotential}
              </p>
            </div>

            {analysis.predictions && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['sixMonths', 'oneYear', 'threeYears'].map((period, idx) => (
                  <div key={period} className="bg-zinc-800/50 rounded-xl p-3 border border-white/5 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">
                      {period === 'sixMonths' ? '6 Mo' : period === 'oneYear' ? '1 Yr' : '3 Yrs'}
                    </p>
                    <p className="text-sm font-bold text-white truncate">
                      {analysis.predictions[period]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'analyzer',
                  data: analysis,
                  userInfo: { name: formData.name, email: formData.email },
                  autoSend: true
                }
              })}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 font-semibold"
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Business Type"
          value={formData.businessType}
          onChange={(e: any) => setFormData({ ...formData, businessType: e.target.value })}
          placeholder="e.g. Startup"
          required
        />

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 mb-3">Needs</label>
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
              { value: "Immediate", label: "Immediate" },
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" }
            ]}
            required
          />
          <SelectField
            label="Experience"
            value={formData.experience}
            onChange={(e: any) => setFormData({ ...formData, experience: e.target.value })}
            options={[
              { value: "", label: "Select" },
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
              { value: "Expert", label: "Expert" }
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
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Plan Consultation'}
        </button>
      </form>

      <AnimatePresence>
        {loading && <AILoader />}
        {plan && (
          <ResultCard title="Consultation Plan" color="cyan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Session Type</p>
                <p className="text-lg font-bold text-white">{plan.consultationType}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-lg font-bold text-white">{plan.recommendedDuration}</p>
              </div>
            </div>

            {plan.keyTopics && (
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3">Key Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.keyTopics.map((topic: string, idx: number) => (
                    <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-white/5">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/contact', {
                state: {
                  source: 'planner',
                  data: plan,
                  userInfo: { name: formData.name, email: formData.email },
                  autoSend: true
                }
              })}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
              Book This Session <FaArrowRight className="w-4 h-4" />
            </button>
          </ResultCard>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main AIUseCases Component (Menu) ---

const AIUseCases = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'estimator',
      title: 'GrowBrandi Project Estimator',
      description: 'Get instant project cost and timeline estimates powered by GrowBrandi AI.',
      icon: <FaCalculator className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'recommender',
      title: 'GrowBrandi Service Recommender',
      description: 'Discover the perfect growth services for your business with GrowBrandi guidance.',
      icon: <FaLightbulb className="w-6 h-6" />,
      color: 'indigo'
    },
    {
      id: 'analyzer',
      title: 'Business Growth Analyzer',
      description: 'Analyze your market position and get data-driven growth predictions.',
      icon: <FaChartBar className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 'planner',
      title: 'Strategic Consultation Planner',
      description: 'Create a personalized consultation agenda tailored to your business needs.',
      icon: <FaCalendarAlt className="w-6 h-6" />,
      color: 'cyan'
    }
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'estimator': return <ProjectEstimator />;
      case 'recommender': return <ServiceRecommender />;
      case 'analyzer': return <BusinessGrowthAnalyzer />;
      case 'planner': return <ConsultationPlanner />;
      default: return null;
    }
  };

  return (
    <section className="py-24 bg-[#09090b] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#09090b] to-[#09090b]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">AI-Powered Tools</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Accelerate Your Growth with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Intelligent Tools
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            Leverage our suite of AI tools to estimate projects, find services, and analyze your business potential instantly.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {tools.map((tool, index) => (
                <motion.button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 text-left transition-all overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${tool.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${tool.color}-500 to-${tool.color}-600 flex items-center justify-center text-white shadow-lg shadow-${tool.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-${tool.color}-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <FaArrowRight className={`text-${tool.color}-400 w-5 h-5`} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tool"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <FaChevronLeft className="w-3 h-3" />
                </div>
                <span className="font-medium">Back to Tools</span>
              </button>

              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {renderActiveTool()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIUseCases;
export { ProjectEstimator, ServiceRecommender, BusinessGrowthAnalyzer, ConsultationPlanner };