import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading portal resources..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className="w-8 h-8 text-portal-primary animate-spin" />
      <p className="text-sm text-portal-text-muted font-medium animate-pulse">{message}</p>
    </div>
  );
}
