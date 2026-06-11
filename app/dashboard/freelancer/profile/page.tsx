'use client';

import { useState, useRef } from 'react';
import { User, Mail, MapPin, Globe, Award, DollarSign, Camera, Save, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { uploadFile } from '@/lib/supabase/storage';

export default function FreelancerProfilePage() {
  const { profile } = useUser();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    hourly_rate: profile?.hourly_rate || 0,
    skills: profile?.skills?.join(', ') || '',
    avatar_url: profile?.avatar_url || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}-${Math.random()}.${fileExt}`;
      
      const publicUrl = await uploadFile('avatars', filePath, file);
      
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Also update the profile in the database immediately for better UX
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast.success('Profile picture updated!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.message?.includes('Bucket not found')) {
        toast.error('Storage Error: The "avatars" bucket does not exist. Please create it in your Supabase Dashboard.', { duration: 6000 });
      } else {
        toast.error(error.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          hourly_rate: formData.hourly_rate,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          avatar_url: formData.avatar_url
        })
        .eq('id', profile?.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      // In a real app, we'd want to refresh the profile in context
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Public Profile</h1>
          <p className="text-muted-foreground mt-1 font-medium">How clients see you on the platform.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Avatar and Quick Stats */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] text-center space-y-4">
            <div className="relative group mx-auto w-40 h-40">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary text-5xl font-black border-4 border-background shadow-xl overflow-hidden relative ring-4 ring-primary/5">
                {uploading ? (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                    <Loader2 className="text-primary animate-spin" size={32} />
                  </div>
                ) : formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  formData.full_name?.charAt(0) || 'U'
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 p-3 bg-primary text-primary-foreground border-4 border-background rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all disabled:opacity-50 z-10"
              >
                <Camera size={20} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{formData.full_name || 'Your Name'}</h2>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{profile?.role}</p>
            </div>
            <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Rating</p>
                <p className="font-black">4.9</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Jobs</p>
                <p className="font-black">12</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Award size={18} className="text-primary" />
              Verified Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.split(',').map((skill, i) => skill.trim() && (
                <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-black uppercase rounded-full border border-border/50">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Main Form */}
        <div className="md:col-span-8 space-y-6">
          <form className="glass-card p-8 rounded-[2.5rem] space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <DollarSign size={16} /> Hourly Rate ($)
                </label>
                <input 
                  type="number" 
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">About You (Bio)</label>
              <textarea 
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
                placeholder="Write a brief professional summary..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <Globe size={16} /> Website
                </label>
                <input 
                  type="url" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Skills (Comma separated)</label>
              <input 
                type="text" 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                placeholder="React, Next.js, TypeScript..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
