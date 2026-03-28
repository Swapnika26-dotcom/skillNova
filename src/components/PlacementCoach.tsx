import React, { useState, useRef } from 'react';
import { FileText, Building2, CheckCircle2, AlertCircle, Loader2, BarChart3, Sparkles, FileUp, X, ChevronRight, TrendingUp, Map, Plus } from 'lucide-react';
import { analyzeResumePDF, generateCareerRoadmap } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface PlacementCoachProps {
  onUploadSuccess: (analysis: any) => void;
}

export default function PlacementCoach({ onUploadSuccess }: PlacementCoachProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [extraTargetCompanies, setExtraTargetCompanies] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setRoadmap(null);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeResumePDF(base64);
        setResult(analysis);
        setIsLoading(false);
        if (analysis) {
          onUploadSuccess(analysis);
        }
      };
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!result || isGeneratingRoadmap) return;
    setIsGeneratingRoadmap(true);
    try {
      const roadmapText = await generateCareerRoadmap(result);
      setRoadmap(roadmapText);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const addTargetCompany = () => {
    const name = companyInput.trim();
    if (!name) return;
    const lower = name.toLowerCase();
    const suggested = (result?.targetCompanies as string[] | undefined) ?? [];
    if (
      suggested.some((c) => c.toLowerCase() === lower) ||
      extraTargetCompanies.some((c) => c.toLowerCase() === lower)
    ) {
      setCompanyInput('');
      return;
    }
    setExtraTargetCompanies((prev) => [...prev, name]);
    setCompanyInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Placement Coach</h2>
            <p className="text-muted-foreground">AI-Powered ATS Analysis & Career Strategy</p>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              file ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-primary/10 rounded-full">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{file.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1.5 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-muted rounded-full">
                  <FileUp className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">Upload Your Resume</p>
                  <p className="text-sm text-muted-foreground">Drag and drop your PDF here or click to browse</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PDF Support</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> ATS Scanning</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Skill Gap Analysis</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <TrendingUp className="w-6 h-6" />}
            {isLoading ? "Analyzing Your Profile..." : "Start AI Analysis"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-card border rounded-2xl overflow-hidden shadow-md">
              <div className="p-8 border-b bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
                    {result.score}%
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">ATS Compatibility Score</h3>
                    <p className="text-sm text-muted-foreground">Based on industry standards for {result.experienceLevel} roles</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const event = new CustomEvent('changeTab', { detail: 'jobs' });
                      window.dispatchEvent(event);
                    }}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    Find Jobs
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Core Strengths
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {result.matchedSkills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                    <AlertCircle className="w-4 h-4" />
                    Growth Opportunities
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {result.missingSkills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-lg border border-amber-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 border-t bg-muted/20">
                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                    <Building2 className="w-4 h-4" />
                    Target companies
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Suggested employers to research and track for applications; add your own dream companies below.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {(result.targetCompanies as string[] | undefined)?.map((company: string, i: number) => (
                      <span
                        key={`s-${i}`}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/25"
                      >
                        {company}
                      </span>
                    ))}
                    {extraTargetCompanies.map((company, i) => (
                      <span
                        key={`e-${i}`}
                        className="px-3 py-1.5 bg-background text-foreground text-xs font-medium rounded-lg border border-border flex items-center gap-1.5"
                      >
                        {company}
                        <button
                          type="button"
                          onClick={() =>
                            setExtraTargetCompanies((prev) => prev.filter((_, j) => j !== i))
                          }
                          className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${company}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <input
                      type="text"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetCompany())}
                      placeholder="e.g. NVIDIA, Stripe, your campus recruiter list…"
                      className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={addTargetCompany}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-background border font-medium text-sm hover:bg-muted/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add company
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-primary/5 border-t">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 space-y-4">
                    <h4 className="font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Strategic Advice
                    </h4>
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{result.suggestion}"
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={handleGenerateRoadmap}
                      disabled={isGeneratingRoadmap}
                      className="px-8 py-3 bg-background border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                    >
                      {isGeneratingRoadmap ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
                      {roadmap ? "Roadmap Generated" : "Generate 12-Month Roadmap"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {roadmap && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-8 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Map className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Map className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Your Personalized Career Roadmap</h3>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-8 first:prose-headings:mt-0">
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
