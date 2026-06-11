'use client';

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Calendar,
  Mail,
  Phone,
  LayoutDashboard,
  ArrowUpRight,
  Camera,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import FileUpload from '@/components/ui/FileUpload';
import { updateProfileAvatar } from '@/app/dashboard/client/actions';
import { toast } from 'react-hot-toast';

export default function ClientProfilePage() {
  const { profile, loading } = useUser();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const router = useRouter();

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center">Profile not found.</div>;
  }

  const handleAvatarUpload = async (url: string) => {
    try {
      const result = await updateProfileAvatar(url);
      if (result.success) {
        setIsEditingAvatar(false);
        toast.success('Profile picture updated!');
        router.refresh();
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const clientData = {
    name: profile.full_name || 'Client Name',
    type: 'Professional Client',
    logo_letter: profile.full_name?.charAt(0) || profile.email?.charAt(0).toUpperCase() || 'C',
    avatar_url: profile.avatar_url,
    bio: 'Business owner looking for top talent to help grow our digital presence and streamline operations.',
    location: 'Remote / Global',
    website: 'https://freelance-hub.com',
    industry: 'Technology',
    employees: '1-10',
    joinedDate: 'June 2026',
    verification_status: 'Verified Account',
    activeProjects: [
      { id: 'p1', title: 'Modern E-commerce Website', status: 'Open', budget: '$3,000 - $5,000' },
      { id: 'p2', title: 'iOS/Android Fitness App', status: 'Open', budget: '$4,000 - $7,000' }
    ],
    contacts: [
      { name: profile.full_name, role: 'Owner', email: profile.email }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 py-8 px-4">
      {/* Hero Header */}
      <div className="relative rounded-[3rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12 border border-primary/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-background border-4 border-primary/20 shadow-2xl flex items-center justify-center text-primary text-6xl font-black overflow-hidden">
              {clientData.avatar_url ? (
                <img src={clientData.avatar_url} alt={clientData.name} className="w-full h-full object-cover" />
              ) : (
                clientData.logo_letter
              )}
            </div>
            <button 
              onClick={() => setIsEditingAvatar(true)}
              className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{clientData.name}</h1>
              <span className="px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck size={14} />
                {clientData.verification_status}
              </span>
            </div>
            
            <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {clientData.bio}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <MapPin size={18} className="text-primary" />
                {clientData.location}
              </div>
              <a href={clientData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                <Globe size={18} />
                {clientData.website.replace('https://', '')}
              </a>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Calendar size={18} className="text-primary" />
                Joined {clientData.joinedDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Edit Modal */}
      {isEditingAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-md border border-border shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black">Update Profile Picture</h3>
              <button onClick={() => setIsEditingAvatar(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <FileUpload 
              bucket="avatars" 
              onUploadComplete={handleAvatarUpload}
              accept="image/*"
              maxSize={2}
            />
            <p className="text-xs text-muted-foreground text-center">
              Recommended: Square image, at least 400x400px. Max size 2MB.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business Details */}
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 size={22} className="text-primary" />
              Company Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Industry</span>
                <span className="font-black text-sm">{clientData.industry}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Size</span>
                <span className="font-black text-sm">{clientData.employees}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Type</span>
                <span className="font-black text-sm">{clientData.type}</span>
              </div>
            </div>
          </section>

          <section className="glass-card p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={22} className="text-primary" />
              Key Contacts
            </h2>
            <div className="space-y-4">
              {clientData.contacts.map((contact, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border/50 space-y-2">
                  <p className="font-bold text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{contact.role}</p>
                  <div className="flex gap-3 pt-2">
                    <button className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-all">
                      <Mail size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-all">
                      <Phone size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Active Projects */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Briefcase size={26} className="text-primary" />
                Active Openings
              </h2>
              <Link href="/dashboard/client/projects" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientData.activeProjects.map((project) => (
                <div key={project.id} className="glass-card p-6 rounded-[2rem] hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      {project.status}
                    </span>
                    <span className="text-lg font-black">{project.budget}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-6">
                    {project.title}
                  </h3>
                  <button className="w-full py-3 rounded-xl bg-secondary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all active:scale-95">
                    View Project
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
