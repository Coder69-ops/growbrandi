import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../lib/firestore-audit';
import { Save, Globe, Settings, Loader2, Play, Trash2, Bot } from 'lucide-react';
import { callOpenRouter } from '../../../services/openRouterService';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';

const AdminAIConfig = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testingModel, setTestingModel] = useState(false);

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'site_settings', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                setSettings({});
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_settings', 'main'), {
                ...settings,
                updatedAt: serverTimestamp(),
            });
            showSuccess('AI Config Saved', 'AI settings have been updated.');
        } catch (error) {
            console.error("Error saving settings:", error);
            showError('Save Failed', 'Failed to save AI settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleTestModel = async () => {
        if (!settings.aiConfig?.openRouterModel) return;

        setTestingModel(true);
        try {
            const modelId = settings.aiConfig.openRouterModel;
            await callOpenRouter(
                "Test connection. Reply with 'OK' if you receive this.",
                undefined,
                { model: modelId, maxTokens: 50 }
            );
            showSuccess('Connection Successful', `Successfully connected to ${modelId}`);
        } catch (error) {
            console.error('Test failed:', error);
            showError('Connection Failed', 'Could not connect to the selected model. Check configuration or try another model.');
        } finally {
            setTestingModel(false);
        }
    };

    return (
        <AdminPageLayout
            title="AI Configuration"
            description="Manage AI models and system instruction settings."
            actions={
                !loading && (
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-105 active:scale-95"
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Config'}
                    </button>
                )
            }
        >
            {loading ? (
                <AdminLoader message="Loading AI config..." />
            ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                    {/* AI Configuration */}
                    <div className="glass-panel p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                                <Bot size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Model Settings</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                                    OpenRouter Fallback Model
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    Select which AI model to use when the primary system encounters errors.
                                </p>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                    value={settings.aiConfig?.openRouterModel || 'openai/gpt-oss-20b:free'}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        aiConfig: { ...settings.aiConfig, openRouterModel: e.target.value }
                                    })}
                                >
                                    <option value="openai/gpt-oss-20b:free">openai/gpt-oss-20b:free (Default)</option>
                                    {settings.aiConfig?.customModels?.map((model: string) => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleTestModel}
                                        disabled={testingModel || !settings.aiConfig?.openRouterModel}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {testingModel ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                        Test Model Connection
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 opacity-75">
                                    <Settings size={12} /> Manage Custom Models
                                </label>

                                {/* Add New Model */}
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Enter Model ID (e.g. mistralai/mistral-7b-instruct:free)"
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono placeholder:font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                                        id="newModelInput"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.currentTarget;
                                                const value = input.value.trim();
                                                if (value) {
                                                    const currentModels = settings.aiConfig?.customModels || [];
                                                    if (!currentModels.includes(value)) {
                                                        setSettings({
                                                            ...settings,
                                                            aiConfig: {
                                                                ...settings.aiConfig,
                                                                customModels: [...currentModels, value]
                                                            }
                                                        });
                                                        input.value = '';
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('newModelInput') as HTMLInputElement;
                                            const value = input.value.trim();
                                            if (value) {
                                                const currentModels = settings.aiConfig?.customModels || [];
                                                if (!currentModels.includes(value)) {
                                                    setSettings({
                                                        ...settings,
                                                        aiConfig: {
                                                            ...settings.aiConfig,
                                                            customModels: [...currentModels, value]
                                                        }
                                                    });
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* List Custom Models */}
                                {settings.aiConfig?.customModels?.length > 0 && (
                                    <div className="space-y-2">
                                        {settings.aiConfig.customModels.map((model: string) => (
                                            <div key={model} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 group">
                                                <code className="text-xs text-slate-600 dark:text-slate-400 font-mono">{model}</code>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newModels = settings.aiConfig.customModels.filter((m: string) => m !== model);
                                                        // If deleting active model, reset to default
                                                        const isOpenRouterActive = settings.aiConfig.openRouterModel === model;

                                                        setSettings({
                                                            ...settings,
                                                            aiConfig: {
                                                                ...settings.aiConfig,
                                                                customModels: newModels,
                                                                openRouterModel: isOpenRouterActive ? 'openai/gpt-oss-20b:free' : settings.aiConfig.openRouterModel
                                                            }
                                                        });
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove model"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminAIConfig;
