
import React from "react";
import { AlertCircle } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon || <AlertCircle className="h-6 w-6 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;
