import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Calendar, Info, CheckCircle2, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

export default function GuidelinesSection() {
  const guidelines = [
    "Each student can represent only their own house.",
    "It is mandatory to fill out the Google Form and complete the registration process.",
    "A student may participate in a maximum of three events (including both sports and culture events).",
    "For culture events, registration and audition submissions will close on 8th April 2026.",
    "All submissions must be made online through the link shared by the school."
  ];

  const sportsTrials = [
    "Kindly fill out the registration form to participate in the trials.",
    "The Sports Trials will be conducted on 6th, 7th, and 8th April 2026."
  ];

  const cultureEvents = [
    "Participants interested in culture events are required to fill out the registration form by 8th April 2026.",
    "Submit videos and photographs showcasing their talent.",
    "These submissions will be reviewed as part of the selection process."
  ];

  return (
    <div id="guidelines" className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <div className="mb-20">
        <p className="sec-label">Rules & Instructions</p>
        <h2 className="text-6xl md:text-8xl">Guide Book</h2>
        <p className="text-muted mt-4 text-lg">Essential information for all UCSF 2026 participants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* General Guidelines */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-border p-10 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 text-maple/10 group-hover:text-maple/20 transition-colors">
            <ClipboardList size={120} />
          </div>
          <h3 className="text-3xl font-display uppercase tracking-widest mb-8 flex items-center gap-4">
            <Info className="text-maple" />
            General Guidelines
          </h3>
          <ul className="space-y-6">
            {guidelines.map((item, i) => (
              <li key={i} className="flex gap-4 text-text/80 leading-relaxed">
                <CheckCircle2 className="text-maple shrink-0 mt-1" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Instructions for Participants */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="bg-white/5 border border-border p-10 rounded-3xl">
            <h3 className="text-2xl font-display uppercase tracking-widest mb-6 flex items-center gap-4">
              <Calendar className="text-maple" />
              Sports Trials
            </h3>
            <ul className="space-y-4">
              {sportsTrials.map((item, i) => (
                <li key={i} className="flex gap-4 text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-maple mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-border p-10 rounded-3xl">
            <h3 className="text-2xl font-display uppercase tracking-widest mb-6 flex items-center gap-4">
              <FileText className="text-maple" />
              Culture Events
            </h3>
            <ul className="space-y-4">
              {cultureEvents.map((item, i) => (
                <li key={i} className="flex gap-4 text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-maple mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Registration & Submission Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-maple/20 to-transparent border border-maple/30 p-12 rounded-[40px] text-center space-y-6"
        >
          <h3 className="text-4xl font-display uppercase tracking-tighter">Register Today</h3>
          <p className="text-muted max-w-md mx-auto">
            Unleash your potential and be a part of UCSF 2026—click below to register now!
          </p>
          <a 
            href="#" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-maple text-bg font-ui text-xs font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-maple/20"
          >
            Click Here to Register
            <ExternalLink size={18} />
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-border p-12 rounded-[40px] text-center space-y-6"
        >
          <h3 className="text-4xl font-display uppercase tracking-tighter">Submissions</h3>
          <p className="text-muted max-w-md mx-auto">
            Submit your work here for screening (Videos, Photographs, Concept Notes).
          </p>
          <a 
            href="#" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-ui text-xs font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-transform"
          >
            Click Here to Submit
            <ExternalLink size={18} />
          </a>
        </motion.div>
      </div>

      <div className="text-center py-12 border-t border-border">
        <p className="text-3xl font-display italic text-muted/40">
          “It’s not just about winning, but about showing up, trying, and growing.”
        </p>
      </div>
    </div>
  );
}
