
import { Book } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <Book className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
