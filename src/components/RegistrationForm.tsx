import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ScheduleItem } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Upload, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface RegistrationFormProps {
  events: ScheduleItem[];
}

export default function RegistrationForm({ events }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    event_id: '',
    student_name: '',
    student_class: '',
    student_section: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let file_url = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `registrations/${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from('brochures') // Reusing the same bucket for simplicity, or I could create a new one if I had permissions
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase!.storage
          .from('brochures')
          .getPublicUrl(filePath);
        
        file_url = publicUrl;
      }

      const selectedEvent = events.find(ev => ev.id.toString() === formData.event_id);

      const { error: insertError } = await supabase!
        .from('registrations')
        .insert([
          {
            event_id: parseInt(formData.event_id),
            event_name: selectedEvent?.title || 'Unknown Event',
            student_name: formData.student_name,
            student_class: formData.student_class,
            student_section: formData.student_section,
            file_url: file_url,
          },
        ]);

      if (insertError) throw insertError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-glass p-12 text-center"
      >
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-4xl font-display mb-4">Registration Successful!</h3>
        <p className="text-white/60 mb-8">Your entry for UCSF 2026 has been recorded. Good luck!</p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setFormData({ event_id: '', student_name: '', student_class: '', student_section: '' });
            setFile(null);
          }}
          className="btn-primary"
        >
          Register Another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="form-group">
          <label className="form-label">Select Event</label>
          <select
            required
            className="form-input"
            value={formData.event_id}
            onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
          >
            <option value="">Choose an event...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.day_label})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Student Name</label>
          <input
            required
            type="text"
            className="form-input"
            placeholder="Enter full name"
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Class</label>
          <input
            required
            type="text"
            className="form-input"
            placeholder="e.g. 10"
            value={formData.student_class}
            onChange={(e) => setFormData({ ...formData, student_class: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Section</label>
          <input
            required
            type="text"
            className="form-input"
            placeholder="e.g. E"
            value={formData.student_section}
            onChange={(e) => setFormData({ ...formData, student_section: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Supporting Document / Media (Optional)</label>
        <div className="relative">
          <input
            type="file"
            className="hidden"
            id="reg-file"
            accept="image/*,video/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="reg-file"
            className={cn(
              "flex items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
              file ? "border-maple bg-maple/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
            )}
          >
            <Upload className={file ? "text-maple" : "text-white/20"} />
            <span className={cn(
              "font-ui text-sm font-bold uppercase tracking-widest",
              file ? "text-white" : "text-white/40"
            )}>
              {file ? file.name : "Upload Photo, Video, or PDF"}
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger font-ui text-xs font-bold tracking-wider">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-6 text-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Processing...
          </>
        ) : (
          "Submit Registration"
        )}
      </button>
    </form>
  );
}
