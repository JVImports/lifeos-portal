import React from "react";

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-[#424754]/25 rounded-2xl bg-[#191b23]/10">
      {icon && <div className="mb-3 opacity-60 text-primary">{icon}</div>}
      <p className="text-sm font-semibold text-on-surface">{message}</p>
      {description && <p className="text-xs text-on-surface-variant opacity-60 mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
