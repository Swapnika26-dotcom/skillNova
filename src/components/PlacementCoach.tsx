import React, { useState } from 'react';
import { FileText, Upload, Building2, CheckCircle2, AlertCircle, Loader2, BarChart3, Sparkles } from 'lucide-react';
import { analyzeResume } from '../services/geminiService';
import { motion } from 'framer-motion';

const COMPANIES = ['Amazon', 'Google', 'TCS', 'Microsoft', 'Meta', 'Infosys'];

export default function PlacementCoach() {
  const [resumeText, setResumeText] = useState('');
  const [company, setCompany] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText || !company) return;
    setIsLoading(true);
    try {
      const analysis = await analyzeResume(resumeText, company);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Placement Coach</h2>
            <p className="text-sm text-muted-foreground">ATS Resume Analyzer & Career Guide</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Target Company</label>
            <div className="grid grid-cols-3 gap-2">
              {COMPANIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCompany(c)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    company === c 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Paste Resume Content</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-48 bg-muted/50 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!resumeText || !company || isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Analyze Compatibility
          </button>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{result.company} Compatibility Report</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{result.score}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">ATS Score</span>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Matched Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] rounded-md border border-green-200 dark:border-green-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium text-sm">
                <AlertCircle className="w-4 h-4" />
                Missing Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] rounded-md border border-amber-200 dark:border-amber-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border-t">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Suggestion
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{result.suggestion}"
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
