import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-formality-secondary animate-enter p-4">
      <Logo className="mb-10" />
      <h1 className="text-8xl font-bold text-formality-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        La page que vous recherchez n'existe pas
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 text-formality-primary hover:text-formality-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour à l'accueil</span>
      </Link>
    </div>
  );
};

export default NotFound;
