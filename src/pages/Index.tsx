import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 animate-enter">
      <Logo className="mb-8 scale-150" />
      <h1 className="text-3xl font-medium mb-4 text-gray-800">
        Document Management System
      </h1>
      <p className="text-gray-600 mb-8">
        Redirection vers la page de connexion...
      </p>
      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-formality-primary rounded-full animate-pulse"
          style={{ width: "60%" }}
        ></div>
      </div>
    </div>
  );
};

export default Index;
