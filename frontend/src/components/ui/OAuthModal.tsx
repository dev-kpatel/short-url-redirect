import { useState } from "react";
import { useAuth } from "@shared/context/AuthContext";
import { Chrome, Github, Shield, User as UserIcon, Lock, Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const OAuthModal = ({ isOpen, onClose }: Props) => {
  const { loginSimulated } = useAuth();
  const [provider, setProvider] = useState<"google" | "github" | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  if (!isOpen) return null;

  const handleProviderSelect = (p: "google" | "github") => {
    setProvider(p);
    setEmailInput(p === "google" ? "admin@myportfolio.dev" : "git-architect@github.com");
  };

  const handleAuthorize = async () => {
    if (!provider) return;
    setLoading(true);
    // Simulate authorization phase
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setAuthorized(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    await loginSimulated(provider, emailInput);
    
    // reset states
    setProvider(null);
    setAuthorized(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={() => { if (!loading) onClose(); }}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl transition-all duration-300 transform scale-100">
        
        {/* Progress Bar during simulated sign-in */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
            <div className="h-full bg-lime-brand animate-shimmer w-1/3 rounded-full" style={{
              backgroundImage: 'linear-gradient(90deg, transparent, var(--lime-brand), transparent)'
            }}/>
          </div>
        )}

        {/* Step 1: Select Provider */}
        {!provider && (
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-brand/10 text-lime-brand mb-3">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">Secure Sign In</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Access your personalized Short URL control panel using OAuth.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleProviderSelect("google")}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium hover:border-lime-brand hover:bg-muted/60 transition-all glow-on-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                    <Chrome className="h-4 w-4 text-red-500" />
                  </div>
                  <span>Continue with Google</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Simulated</span>
              </button>

              <button
                onClick={() => handleProviderSelect("github")}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium hover:border-lime-brand hover:bg-muted/60 transition-all glow-on-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-white">
                    <Github className="h-4 w-4" />
                  </div>
                  <span>Continue with GitHub</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Simulated</span>
              </button>
            </div>

            <div className="mt-6 border-t border-border/60 pt-4 flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>Isolated sandbox mode</span>
              </div>
              <button 
                onClick={onClose}
                className="hover:text-foreground underline transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Simulated oAuth Consent Screen */}
        {provider && (
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-brand/10 text-lime-brand">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OAuth Consent Simulation</span>
              </div>
              <button 
                onClick={() => setProvider(null)}
                disabled={loading}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline disabled:opacity-50"
              >
                Change Provider
              </button>
            </div>

            {authorized ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-float">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-brand/20 text-lime-brand mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold font-display">Authentication Successful!</h4>
                <p className="text-sm text-muted-foreground mt-1">Redirecting you to the dashboard...</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-brand text-primary-foreground font-bold font-display">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Short URL Platform</h4>
                    <p className="text-xs text-muted-foreground">wants to access your {provider === "google" ? "Google" : "GitHub"} account</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Permissions requested
                    </label>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-lime-brand mt-0.5" />
                        <span>View your email address and profile details</span>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-lime-brand mt-0.5" />
                        <span>Manage and configure your shortened redirection URLs</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="authEmail" className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      Choose Profile Account Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="authEmail"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full pl-9 pr-4 py-2 border border-border bg-muted/30 rounded-lg text-sm focus:outline-none focus:border-lime-brand focus:ring-1 focus:ring-lime-brand/30"
                      />
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setProvider(null)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-transparent hover:bg-muted/50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAuthorize}
                    disabled={loading || !emailInput}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-lime-brand text-primary-foreground hover:bg-lime-brand/90 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {loading ? "Authorizing..." : "Allow Access"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
