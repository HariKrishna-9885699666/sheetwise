import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isApiConfigured } from "@/lib/google-sheets";

export function ApiStatusBanner() {
  // Only show if API is not configured
  if (isApiConfigured) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Demo Mode - Google Sheets Not Connected</AlertTitle>
      <AlertDescription>
        You're viewing demo data. To connect your Google Spreadsheet:
        <ol className="list-decimal ml-4 mt-2 space-y-1">
          <li>Follow the setup guide in <code className="bg-muted px-1 py-0.5 rounded">QUICKSTART.md</code></li>
          <li>Get Google API credentials</li>
          <li>Update your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file</li>
          <li>Restart the dev server</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
}

export function ApiStatusIndicator() {
  if (!isApiConfigured) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <span>Demo Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span>Connected to Google Sheets</span>
    </div>
  );
}
