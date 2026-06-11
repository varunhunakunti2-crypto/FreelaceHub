'use client';

import { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Eye, 
  Smartphone, 
  Mail, 
  ShieldCheck, 
  ChevronRight,
  UserCog,
  Globe,
  X,
  Loader2
} from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function FreelancerSettingsPage() {
  const { profile } = useUser();
  const supabase = createClientComponentClient();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    projectUpdates: true,
    messages: true,
    marketing: false
  });

  const [isPublic, setIsPublic] = useState(true); // Mocking visibility state
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English (US)');

  const languages = [
    { name: 'English (US)', code: 'en-US' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Hindi', code: 'hi' },
  ];

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setIsLanguageModalOpen(false);
    toast.success(`Language changed to ${lang}`);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (error) throw error;
      toast.success('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const toggleVisibility = () => {
    const newStatus = !isPublic;
    setIsPublic(newStatus);
    toast.success(`Profile visibility set to ${newStatus ? 'Public' : 'Private'}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 py-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">Manage your security and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <ShieldCheck size={22} className="text-primary" />
            Security & Privacy
          </h2>
          <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="divide-y divide-border/50">
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Lock size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Change Password</p>
                    <p className="text-xs text-muted-foreground font-medium">Update your account password</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
              </button>

              <button className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground font-medium">Currently: <span className="text-rose-500 font-bold">DISABLED</span></p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
              </button>

              <div className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
                    <Eye size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground font-medium">Currently: <span className={isPublic ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>{isPublic ? 'PUBLIC' : 'PRIVATE'}</span></p>
                  </div>
                </div>
                <button 
                  onClick={toggleVisibility}
                  className={`w-12 h-6 rounded-full transition-all relative ${isPublic ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPublic ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <Bell size={22} className="text-primary" />
            Notification Preferences
          </h2>
          <div className="glass-card p-8 rounded-[2rem] space-y-6">
            <div className="space-y-6">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'messages', label: 'New Messages', desc: 'Notify me when I get a message' },
                { key: 'projectUpdates', label: 'Project Milestones', desc: 'Notify me of status changes' },
                { key: 'push', label: 'Push Notifications', desc: 'Show desktop notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                    className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-secondary'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <Globe size={22} className="text-primary" />
            General
          </h2>
          <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="divide-y divide-border/50">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-secondary text-muted-foreground">
                    <UserCog size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Language</p>
                    <p className="text-xs text-muted-foreground font-medium">System language: {currentLanguage}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-6 flex justify-end gap-3 border-t">
        <button className="px-6 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:bg-secondary transition-all">
          Cancel
        </button>
        <button className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
          Update Settings
        </button>
      </div>

      {/* Language Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setIsLanguageModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black">Select Language</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred system language.</p>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all font-bold text-sm ${
                    currentLanguage === lang.name 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:bg-secondary"
                  }`}
                >
                  {lang.name}
                  {currentLanguage === lang.name && <ShieldCheck size={18} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black">Change Password</h3>
              <p className="text-sm text-muted-foreground">Choose a strong, secure password.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                  className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
