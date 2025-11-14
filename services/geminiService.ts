import OpenAI from 'openai';

// OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": "https://growbrandi.com",
    "X-Title": "GrowBrandi AI",
  },
});

// Chat interface adapter to maintain compatibility
export class ChatAdapter {
  private messages: Array<{ role: string; content: string }> = [];
  private systemInstruction: string;

  constructor(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
    this.messages.push({ role: 'system', content: systemInstruction });
  }

  async *sendMessageStream({ message }: { message: string }): AsyncGenerator<{ text: string }, void, unknown> {
    this.messages.push({ role: 'user', content: message });

    try {
      const stream = await openai.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: this.messages as any,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          yield { text: content };
        }
      }

      // Add assistant response to message history
      this.messages.push({ role: 'assistant', content: fullResponse });
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }
}

export const initializeChat = (systemInstruction: string): ChatAdapter | null => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("OPENROUTER_API_KEY environment variable not set.");
    return null;
  }

  try {
    return new ChatAdapter(systemInstruction);
  } catch (error) {
    console.error("Failed to initialize OpenRouter AI:", error);
    return null;
  }
};



export const generateSlogan = async (keywords: string): Promise<string[]> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable not set.");
    }

    try {
        const workingOpenai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://growbrandi.com",
                "X-Title": "GrowBrandi AI",
            },
        });

        const response = await workingOpenai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: `Generate 3 creative, witty, and memorable brand slogans based on these keywords: "${keywords}". 
                    
                    IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
                    {"slogans": ["slogan1", "slogan2", "slogan3"]}`
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Try to parse as JSON first
                const result = JSON.parse(content);
                if (result.slogans && Array.isArray(result.slogans)) {
                    return result.slogans;
                }
            } catch (jsonError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    if (result.slogans && Array.isArray(result.slogans)) {
                        return result.slogans;
                    }
                }
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to generate slogan:", error);
        throw new Error("Could not generate slogans at this time.");
    }
};

// Project Estimation Service
export const estimateProject = async (requirements: {
    projectType: string;
    features: string[];
    timeline: string;
    budget: string;
    industry: string;
}) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable not set.");
    }

    try {
        const workingOpenai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://growbrandi.com",
                "X-Title": "GrowBrandi AI",
            },
        });

        const response = await workingOpenai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: `As a digital agency expert, provide a detailed project estimation for:
            Project Type: ${requirements.projectType}
            Features: ${requirements.features.join(', ')}
            Timeline: ${requirements.timeline}
            Budget: ${requirements.budget}
            Industry: ${requirements.industry}
            
            Provide estimation with cost breakdown, timeline, recommendations, and potential challenges.
            
            IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
            {
                "estimatedCost": "string",
                "estimatedTimeline": "string", 
                "recommendedServices": ["service1", "service2"],
                "costBreakdown": [{"service": "name", "cost": "amount", "description": "desc"}],
                "recommendations": ["rec1", "rec2"],
                "potentialChallenges": ["challenge1", "challenge2"],
                "nextSteps": ["step1", "step2"]
            }`
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Try to parse as JSON first
                return JSON.parse(content);
            } catch (jsonError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Invalid JSON response format");
            }
        }
        throw new Error("No response received");
    } catch (error) {
        console.error("Failed to estimate project:", error);
        throw new Error("Could not generate project estimation at this time.");
    }
};

// Service Recommendation Service
export const recommendServices = async (businessInfo: {
    industry: string;
    currentChallenges: string[];
    goals: string[];
    budget: string;
    timeline: string;
}) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable not set.");
    }

    try {
        const workingOpenai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://growbrandi.com",
                "X-Title": "GrowBrandi AI",
            },
        });

        const response = await workingOpenai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: `Recommend digital services for: Industry: ${businessInfo.industry}, Challenges: ${businessInfo.currentChallenges.join(', ')}, Goals: ${businessInfo.goals.join(', ')}, Budget: ${businessInfo.budget}, Timeline: ${businessInfo.timeline}

Respond with ONLY valid JSON:
{
  "priorityServices": [{"service": "name", "priority": "high", "reason": "why", "expectedOutcome": "result", "estimatedCost": "cost"}],
  "strategicPlan": [{"phase": "name", "duration": "time", "activities": ["activity1", "activity2"]}],
  "expectedResults": ["result1", "result2"],
  "additionalTips": ["tip1", "tip2"]
}`
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Try to parse as JSON first
                return JSON.parse(content);
            } catch (jsonError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Invalid JSON response format");
            }
        }
        throw new Error("No response received");
    } catch (error) {
        console.error("Failed to recommend services:", error);
        throw new Error("Could not generate service recommendations at this time.");
    }
};

// Business Growth Analysis Service
export const analyzeBusinessGrowth = async (businessData: {
    currentRevenue: string;
    industry: string;
    marketPosition: string;
    digitalPresence: string;
    competitorsLevel: string;
}) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable not set.");
    }

    try {
        const workingOpenai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://growbrandi.com",
                "X-Title": "GrowBrandi AI",
            },
        });

        const response = await workingOpenai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: `Analyze the growth potential for this business:
            Current Revenue: ${businessData.currentRevenue}
            Industry: ${businessData.industry}
            Market Position: ${businessData.marketPosition}
            Digital Presence: ${businessData.digitalPresence}
            Competitors Level: ${businessData.competitorsLevel}
            
            Provide growth analysis with actionable insights and predictions.
            
            IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
            {
                "growthPotential": "description",
                "marketOpportunities": ["opportunity1", "opportunity2"],
                "digitalGaps": ["gap1", "gap2"],
                "recommendedActions": [{"action": "name", "impact": "description", "timeframe": "time", "investment": "cost"}],
                "predictions": {"sixMonths": "prediction", "oneYear": "prediction", "threeYears": "prediction"},
                "keyMetrics": ["metric1", "metric2"]
            }`
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Try to parse as JSON first
                return JSON.parse(content);
            } catch (jsonError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Invalid JSON response format");
            }
        }
        throw new Error("No response received");
    } catch (error) {
        console.error("Failed to analyze business growth:", error);
        throw new Error("Could not generate business analysis at this time.");
    }
};

// Consultation Planning Service
export const generateConsultationPlan = async (clientInfo: {
    businessType: string;
    specificNeeds: string[];
    urgency: string;
    experience: string;
}) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable not set.");
    }

    try {
        const workingOpenai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": "https://growbrandi.com",
                "X-Title": "GrowBrandi AI",
            },
        });

        const response = await workingOpenai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "user",
                    content: `Create a personalized consultation plan for:
            Business Type: ${clientInfo.businessType}
            Specific Needs: ${clientInfo.specificNeeds.join(', ')}
            Urgency: ${clientInfo.urgency}
            Experience Level: ${clientInfo.experience}
            
            Design a consultation structure that maximizes value and addresses their needs.
            
            IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
            {
                "consultationType": "type description",
                "recommendedDuration": "duration",
                "keyTopics": ["topic1", "topic2"],
                "preparationItems": ["item1", "item2"],
                "expectedOutcomes": ["outcome1", "outcome2"],
                "followUpActions": ["action1", "action2"],
                "personalizedMessage": "personalized message"
            }`
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
            try {
                // Try to parse as JSON first
                return JSON.parse(content);
            } catch (jsonError) {
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error("Invalid JSON response format");
            }
        }
        throw new Error("No response received");
    } catch (error) {
        console.error("Failed to generate consultation plan:", error);
        throw new Error("Could not generate consultation plan at this time.");
    }
};