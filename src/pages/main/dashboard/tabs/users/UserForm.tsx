import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateUserDto } from "@/api-swagger/models/CreateUserDto";

const roleOptions = ["ADMIN", "JURIST", "OPERATOR"] as const;

interface UserFormProps {
  newUser: {
    firstName: string;
    role: CreateUserDto.role;
    login: string;
    password: string;
  };
  setNewUser: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      role: CreateUserDto.role;
      login: string;
      password: string;
    }>
  >;
  onCreateUser: () => void;
  isCreating: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  newUser,
  setNewUser,
  onCreateUser,
  isCreating,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-lg font-medium text-gray-700 mb-4">
      Ajouter un utilisateur
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Prénom
        </label>
        <Input
          className="border-gray-700"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
          disabled={isCreating}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Rôle
        </label>
        <select
          className="w-full border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-formality-primary/20 focus:border-formality-primary transition-all"
          value={newUser.role}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              role: e.target.value as CreateUserDto.role,
            })
          }
          disabled={isCreating}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Email
        </label>
        <Input
          className="border-gray-700"
          value={newUser.login}
          onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
          disabled={isCreating}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Mot de passe
        </label>
        <Input
          type="password"
          className="border-gray-700"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          disabled={isCreating}
        />
      </div>
      <div>
        <Button
          className="w-full bg-formality-primary hover:bg-formality-primary/90 text-white"
          onClick={onCreateUser}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Création...
            </>
          ) : (
            "Créer"
          )}
        </Button>
      </div>
    </div>
  </div>
);
