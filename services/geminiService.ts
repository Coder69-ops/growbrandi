import { GoogleGenAI, Chat, Type } from "@google/genai";

// AI Configuration for short, conversion-focused responses
const AI_CONFIG = {
  temperature: 0.8,
  maxOutputTokens: 150, // Force short responses
  topP: 0.9,
  topK: 40
};

const CONVERSION_SUFFIX = "\n\nCRITICAL INSTRUCTIONS: Keep response under 3 sentences. Be direct, urgent, conversion-focused. Always end with strong call-to-action. NO long explanations or generic advice.";

// Base AI initialization
export const initializeChat = (systemInstruction: string): Chat | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY environment variable not set.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction + CONVERSION_SUFFIX,
        ...AI_CONFIG,
      },
    });
    return chat;
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    return null;
  }
};

// AI Service Helper for structured queries
const getAIResponse = async (prompt: string, responseSchema: any) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt + CONVERSION_SUFFIX,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        ...AI_CONFIG,
        maxOutputTokens: 300 // Slightly higher for structured responses
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to get AI response:", error);
    throw error;
  }
};

export const generateSlogan = async (keywords: string): Promise<string[]> => {
    try {
        const result = await getAIResponse(
            `Generate 3 creative, witty, and memorable brand slogans based on these keywords: "${keywords}". The output must be only the JSON object.`,
            {
                type: Type.OBJECT,
                properties: {
                    slogans: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    }
                }
            }
        );

        if (result.slogans && Array.isArray(result.slogans)) {
            return result.slogans;
        }
        return [];
    } catch (error) {
        console.error("Failed to generate slogan:", error);
        throw new Error("Could not generate slogans at this time.");
    }
};

// Project Estimation AI
export const estimateProject = async (requirements: {
    projectType: string;
    features: string[];
    timeline: string;
    budget: string;
    industry: string;
}) => {
    try {
        const result = await getAIResponse(
            `As a digital agency expert, provide a detailed project estimation for:
            Project Type: ${requirements.projectType}
            Features: ${requirements.features.join(', ')}
            Timeline: ${requirements.timeline}
            Budget: ${requirements.budget}
            Industry: ${requirements.industry}
            
            Provide estimation with cost breakdown, timeline, recommendations, and potential challenges.`,
            {
                type: Type.OBJECT,
                properties: {
                    estimatedCost: { type: Type.STRING },
                    estimatedTimeline: { type: Type.STRING },
                    recommendedServices: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    costBreakdown: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                service: { type: Type.STRING },
                                cost: { type: Type.STRING },
                                description: { type: Type.STRING }
                            }
                        }
                    },
                    recommendations: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    potentialChallenges: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    nextSteps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        );
        return result;
    } catch (error) {
        console.error("Failed to estimate project:", error);
        throw new Error("Could not generate project estimation at this time.");
    }
};

// Service Recommendation AI
export const recommendServices = async (businessInfo: {
    industry: string;
    currentChallenges: string[];
    goals: string[];
    budget: string;
    timeline: string;
}) => {
    try {
        const result = await getAIResponse(
            `As a digital marketing expert, recommend the best services for this business:
            Industry: ${businessInfo.industry}
            Current Challenges: ${businessInfo.currentChallenges.join(', ')}
            Goals: ${businessInfo.goals.join(', ')}
            Budget: ${businessInfo.budget}
            Timeline: ${businessInfo.timeline}
            
            Provide personalized service recommendations with priorities and expected outcomes.`,
            {
                type: Type.OBJECT,
                properties: {
                    priorityServices: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                service: { type: Type.STRING },
                                priority: { type: Type.STRING },
                                reason: { type: Type.STRING },
                                expectedOutcome: { type: Type.STRING },
                                estimatedCost: { type: Type.STRING }
                            }
                        }
                    },
                    strategicPlan: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                phase: { type: Type.STRING },
                                duration: { type: Type.STRING },
                                activities: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    expectedResults: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    additionalTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        );
        return result;
    } catch (error) {
        console.error("Failed to recommend services:", error);
        throw new Error("Could not generate service recommendations at this time.");
    }
};

// Business Growth Analysis AI
export const analyzeBusinessGrowth = async (businessData: {
    currentRevenue: string;
    industry: string;
    marketPosition: string;
    digitalPresence: string;
    competitorsLevel: string;
}) => {
    try {
        const result = await getAIResponse(
            `Analyze the growth potential for this business:
            Current Revenue: ${businessData.currentRevenue}
            Industry: ${businessData.industry}
            Market Position: ${businessData.marketPosition}
            Digital Presence: ${businessData.digitalPresence}
            Competitors Level: ${businessData.competitorsLevel}
            
            Provide growth analysis with actionable insights and predictions.`,
            {
                type: Type.OBJECT,
                properties: {
                    growthPotential: { type: Type.STRING },
                    marketOpportunities: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    digitalGaps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    recommendedActions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                action: { type: Type.STRING },
                                impact: { type: Type.STRING },
                                timeframe: { type: Type.STRING },
                                investment: { type: Type.STRING }
                            }
                        }
                    },
                    predictions: {
                        type: Type.OBJECT,
                        properties: {
                            sixMonths: { type: Type.STRING },
                            oneYear: { type: Type.STRING },
                            threeYears: { type: Type.STRING }
                        }
                    },
                    keyMetrics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        );
        return result;
    } catch (error) {
        console.error("Failed to analyze business growth:", error);
        throw new Error("Could not generate business analysis at this time.");
    }
};

// Smart Consultation Scheduler AI
export const generateConsultationPlan = async (clientInfo: {
    businessType: string;
    specificNeeds: string[];
    urgency: string;
    experience: string;
}) => {
    try {
        const result = await getAIResponse(
            `Create a personalized consultation plan for:
            Business Type: ${clientInfo.businessType}
            Specific Needs: ${clientInfo.specificNeeds.join(', ')}
            Urgency: ${clientInfo.urgency}
            Experience Level: ${clientInfo.experience}
            
            Design a consultation structure that maximizes value and addresses their needs.`,
            {
                type: Type.OBJECT,
                properties: {
                    consultationType: { type: Type.STRING },
                    recommendedDuration: { type: Type.STRING },
                    keyTopics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    preparationItems: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    expectedOutcomes: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    followUpActions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    personalizedMessage: { type: Type.STRING }
                }
            }
        );
        return result;
    } catch (error) {
        console.error("Failed to generate consultation plan:", error);
        throw new Error("Could not generate consultation plan at this time.");
    }
};