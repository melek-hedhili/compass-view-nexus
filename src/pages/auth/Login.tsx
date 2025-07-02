import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { Form } from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";

const Login = () => {
  const methods = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { loginMutation } = useAuth();

  const handleSubmit: SubmitHandler<{
    email: string;
    password: string;
  }> = async (data) => {
    loginMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-formality-secondary animate-enter">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center mb-10">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-formality-accent">
            Connexion
          </h1>
          <p className="mt-2 text-gray-600">Document Management System</p>
        </div>

        <Form onSubmit={handleSubmit} methods={methods} className="space-y-6">
          <div className="space-y-1">
            <ControlledInput
              id="email"
              type="email"
              label="Email"
              placeholder="admin@formality.fr"
              name="email"
              required
              removeAsterisk
            />
          </div>

          <div className="space-y-1">
            <ControlledInput
              id="password"
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              name="password"
              required
              removeAsterisk
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
