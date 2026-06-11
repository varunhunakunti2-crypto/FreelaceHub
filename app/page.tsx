import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="max-w-4xl w-full flex flex-col items-center relative z-10 py-12 mt-12 text-center">
        <div className="space-y-8 flex flex-col items-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-7xl">
              Freelance Agency <span className="text-primary">Management</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed mx-auto">
              The all-in-one platform for freelancers and clients to manage projects, 
              contracts, and payments with ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900/50 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-black rounded-2xl shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 text-center"
            >
              Create Account
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
            <div className="group p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors duration-300">Projects</h3>
              <p className="text-sm text-slate-500 font-medium">Post and manage projects with real-time tracking.</p>
            </div>
            <div className="group p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors duration-300">Contracts</h3>
              <p className="text-sm text-slate-500 font-medium">Secure agreements with integrated e-signatures.</p>
            </div>
            <div className="group p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors duration-300">Payments</h3>
              <p className="text-sm text-slate-500 font-medium">Automated invoicing and secure global payouts.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
