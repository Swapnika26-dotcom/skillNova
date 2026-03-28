import React, { useState } from 'react';
import { GraduationCap, BookOpen, Lightbulb, Briefcase, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyBuddy from './components/StudyBuddy';
import IdeaGenerator from './components/IdeaGenerator';
import PlacementCoach from './components/PlacementCoach';
import { cn } from './lib/utils';

type Tab = 'home' | 'study' | 'ideas' | 'placement';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize dark mode
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'study', label: 'Study Buddy', icon: BookOpen },
    { id: 'ideas', label: 'Innovation', icon: Lightbulb },
    { id: 'placement', label: 'Placement', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="p-1.5 bg-primary rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">AI Campus Copilot</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="ml-4 pl-4 border-l">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all",
                      activeTab === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                  Empowering <span className="text-primary">BTech Students</span> with AI
                </h1>
                <p className="text-lg text-muted-foreground">
                  A unified ecosystem designed to accelerate your learning, spark innovation, and boost your career prospects.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'study',
                    title: 'AI Study Buddy',
                    desc: 'Get instant academic help and subject-specific tutoring 24/7.',
                    icon: BookOpen,
                    color: 'bg-blue-500/10 text-blue-500',
                  },
                  {
                    id: 'ideas',
                    title: 'Innovation Hub',
                    desc: 'Generate cutting-edge project ideas across 12+ technical domains.',
                    icon: Lightbulb,
                    color: 'bg-amber-500/10 text-amber-500',
                  },
                  {
                    id: 'placement',
                    title: 'Placement Coach',
                    desc: 'Analyze your resume against top companies and bridge skill gaps.',
                    icon: Briefcase,
                    color: 'bg-emerald-500/10 text-emerald-500',
                  },
                ].map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id as Tab)}
                    className="group p-8 bg-card border rounded-2xl text-left hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </button>
                ))}
              </div>

              <div className="bg-muted/30 border rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-display font-bold">Ready to excel in your engineering journey?</h2>
                  <p className="text-muted-foreground">Join thousands of students using AI Campus Copilot to stay ahead in their academics and career.</p>
                  <button 
                    onClick={() => setActiveTab('study')}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                  >
                    Get Started Now
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-card border rounded-2xl text-center space-y-1">
                     <div className="text-2xl font-bold text-primary">24/7</div>
                     <div className="text-xs text-muted-foreground uppercase tracking-wider">Availability</div>
                   </div>
                   <div className="p-4 bg-card border rounded-2xl text-center space-y-1">
                     <div className="text-2xl font-bold text-primary">12+</div>
                     <div className="text-xs text-muted-foreground uppercase tracking-wider">Domains</div>
                   </div>
                   <div className="p-4 bg-card border rounded-2xl text-center space-y-1">
                     <div className="text-2xl font-bold text-primary">100%</div>
                     <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Powered</div>
                   </div>
                   <div className="p-4 bg-card border rounded-2xl text-center space-y-1">
                     <div className="text-2xl font-bold text-primary">Free</div>
                     <div className="text-xs text-muted-foreground uppercase tracking-wider">For Students</div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'study' && (
            <motion.div
              key="study"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <StudyBuddy />
            </motion.div>
          )}

          {activeTab === 'ideas' && (
            <motion.div
              key="ideas"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <IdeaGenerator />
            </motion.div>
          )}

          {activeTab === 'placement' && (
            <motion.div
              key="placement"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PlacementCoach />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm font-medium">AI Campus Copilot</p>
          <p className="text-xs text-muted-foreground">© 2026 Development Team. Built for BTech Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
