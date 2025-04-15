
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-blue-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CourseCompass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
