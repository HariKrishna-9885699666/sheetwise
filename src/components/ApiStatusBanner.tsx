import { AlertCircle, CheckCircle2, LogIn, LogOut } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isApiConfigured, isSignedIn, signIn, signOut, getUserEmail, initializeGapi, initializeGis } from "@/lib/google-sheets";
import { useState, useEffect } from "react";

export function ApiStatusBanner() {
  const [signedIn, setSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isApiConfigured) {
        setLoading(false);
        return;
      }

      try {
        await initializeGapi();
        initializeGis();
        
        // Check if already signed in
        setTimeout(() => {
          const signedIn = isSignedIn();
          setSignedIn(signedIn);
          if (signedIn) {
            getUserEmail().then(setUserEmail);
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Initialization failed:', error);
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSignIn = async () => {
    if (signingIn) return;
    
    setSigningIn(true);
    try {
      await signIn();
      // Token is now set, reload to fetch data
      window.location.reload();
    } catch (error) {
      console.error('Sign in failed:', error);
      setSigningIn(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setSignedIn(false);
    setUserEmail(null);
    window.location.reload(); // Refresh to clear data
  };

  // Loading
  if (loading) {
    return null;
  }

  // Not configured
  if (!isApiConfigured) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google Sheets Not Configured</AlertTitle>
        <AlertDescription>
          Please configure your Google OAuth Client ID and Spreadsheet ID in the <code className="bg-muted px-1 py-0.5 rounded">.env</code> file.
        </AlertDescription>
      </Alert>
    );
  }

  // Configured but not signed in
  if (!signedIn) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sign in Required</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Sign in with your Google account to access your private spreadsheet.</span>
          <Button onClick={handleSignIn} size="sm" className="ml-4" disabled={signingIn}>
            <LogIn className="mr-2 h-4 w-4" />
            {signingIn ? 'Signing in...' : 'Sign In with Google'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Signed in - show success banner with user email and sign-out
  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-900">Connected to Google Sheets</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-green-800">
          Signed in as <strong>{userEmail || 'User'}</strong>
        </span>
        <Button onClick={handleSignOut} variant="outline" size="sm" className="ml-4">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function ApiStatusIndicator() {
  const [signedIn, setSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!isApiConfigured) {
        setLoading(false);
        return;
      }

      try {
        await initializeGapi();
        initializeGis();
        
        // Check if already signed in
        setTimeout(() => {
          const signedIn = isSignedIn();
          setSignedIn(signedIn);
          if (signedIn) {
            getUserEmail().then(setUserEmail);
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Initialization failed:', error);
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSignOut = () => {
    signOut();
    setSignedIn(false);
    setUserEmail(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isApiConfigured) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <span>Not Configured</span>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <span>Not Signed In</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span>{userEmail || 'Connected'}</span>
      </div>
      <Button onClick={handleSignOut} variant="ghost" size="sm">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

