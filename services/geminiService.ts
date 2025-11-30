import { GoogleGenAI, Chat, Type } from "@google/genai";

// Chat interface adapter to maintain compatibility  
export class ChatAdapter {
    private chat: Chat | null = null;

    constructor(systemInstruction: string) {
        const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            console.error("API_KEY environment variable not set.");
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            this.chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
        }
    }

    async *sendMessageStream({ message }: { message: string }): AsyncGenerator<{ text: string }, void, unknown> {
        if (!this.chat) {
            throw new Error("Chat not initialized");
        }

        try {
            const response = await this.chat.sendMessage({ message });
            // For now, yield the full response as a single chunk
            // The @google/genai package may have different streaming API
            yield { text: response.text };
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }
}

export const initializeChat = (systemInstruction: string): ChatAdapter | null => {
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
        return null;
    }

    try {
        return new ChatAdapter(systemInstruction);
    } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        return null;
    }
};



export const generateSlogan = async (keywords: string): Promise<string[]> => {
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 3 creative, witty, and memorable brand slogans based on these keywords: "${keywords}". The output must be only the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slogans: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text);
        if (result.slogans && Array.isArray(result.slogans)) {
            return result.slogans;
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
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `As a digital agency expert, provide a detailed project estimation for:
            Project Type: ${requirements.projectType}
            Features: ${requirements.features.join(', ')}
            Timeline: ${requirements.timeline}
            Budget: ${requirements.budget}
            Industry: ${requirements.industry}
            
            Provide estimation with cost breakdown, timeline, recommendations, and potential challenges. The output must be only the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
            }
        });

        return JSON.parse(response.text);
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
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Recommend digital services for: Industry: ${businessInfo.industry}, Challenges: ${businessInfo.currentChallenges.join(', ')}, Goals: ${businessInfo.goals.join(', ')}, Budget: ${businessInfo.budget}, Timeline: ${businessInfo.timeline}

            The output must be only the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
            }
        });

        return JSON.parse(response.text);
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
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the growth potential for this business:
            Current Revenue: ${businessData.currentRevenue}
            Industry: ${businessData.industry}
            Market Position: ${businessData.marketPosition}
            Digital Presence: ${businessData.digitalPresence}
            Competitors Level: ${businessData.competitorsLevel}
            
            Provide comprehensive growth analysis with specific insights and recommendations. The output must be only the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
            }
        });

        return JSON.parse(response.text);
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
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a personalized consultation plan for:
            Business Type: ${clientInfo.businessType}
            Specific Needs: ${clientInfo.specificNeeds.join(', ')}
            Urgency: ${clientInfo.urgency}
            Experience Level: ${clientInfo.experience}
            
            Design a consultation structure that maximizes value and addresses their needs. The output must be only the JSON object.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to generate consultation plan:", error);
        throw new Error("Could not generate consultation plan at this time.");
    }
};

// Project Brief Generation Service
export const generateProjectBrief = async (details?: { service: string; subject: string }): Promise<{ brief: string }> => {
    const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        let prompt = `A user wants to contact GrowBrandi. Generate a BRIEF, urgent project brief (max 100 words) that includes project goal, target audience, and key features. Make it sound professional but concise. Focus on conversion.`;

        if (details?.service && details?.subject) {
            prompt = `A user wants to contact GrowBrandi regarding "${details.service}". The subject is "${details.subject}". Generate a professional, concise project brief (max 100 words) tailored to this service and subject. Focus on clear goals, target audience, and desired outcomes.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        brief: { type: Type.STRING }
                    }
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Failed to generate project brief:", error);
        throw new Error("Could not generate project brief at this time.");
    }
};