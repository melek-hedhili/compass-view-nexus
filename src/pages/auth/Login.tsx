
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { SignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    SignIn({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 animate-enter">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center mb-10">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-formality-accent">
            Connexion
          </h1>
          <p className="mt-2 text-gray-600">Document Management System</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@formality.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-elegant w-full"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-elegant w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
