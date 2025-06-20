import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";
import type { UserDto } from "@/api-swagger/models/UserDto";

const roleOptions = ["ADMIN", "JURIST", "OPERATOR"] as const;

interface User extends UserDto {
  id: string;
}

interface UsersListProps {
  users: UserDto[];
  editingUserId: string | null;
  editUserData: Partial<User>;
  setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  onStartEdit: (user: UserDto) => void;
  onCancelEdit: () => void;
  onUpdateUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  updateLoading: boolean;
  deleteLoading: boolean;
}

export const UsersList: React.FC<UsersListProps> = ({
  users,
  editingUserId,
  editUserData,
  setEditUserData,
  onStartEdit,
  onCancelEdit,
  onUpdateUser,
  onDeleteUser,
  updateLoading,
  deleteLoading,
}) => (
  <div className="space-y-4">
    {users.map((user) => (
      <div
        key={user._id}
        className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center p-4 rounded-md bg-gray-50"
      >
        {editingUserId === user._id ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Prénom
              </label>
              <Input
                className="border-gray-700 bg-white"
                value={editUserData.username || ""}
                onChange={(e) =>
                  setEditUserData({
                    ...editUserData,
                    username: e.target.value,
                  })
                }
                disabled={updateLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Rôle
              </label>
              <select
                className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white"
                value={editUserData.role || ""}
                onChange={(e) =>
                  setEditUserData({
                    ...editUserData,
                    role: e.target.value as UserDto["role"],
                  })
                }
                disabled={updateLoading}
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
                className="border-gray-700 bg-white"
                value={editUserData.email || ""}
                onChange={(e) =>
                  setEditUserData({
                    ...editUserData,
                    email: e.target.value,
                  })
                }
                disabled={updateLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mot de passe
              </label>
              <Input
                type="password"
                className="border-gray-700 bg-white"
                value="••••••••••"
                readOnly
                disabled={updateLoading}
              />
            </div>
            <div className="flex space-x-2 col-span-2 lg:col-span-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateUser(user._id)}
                disabled={updateLoading}
                className="flex-1"
              >
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                    Mise à jour...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={updateLoading}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Prénom
              </label>
              <Input
                className="border-gray-700 bg-white"
                value={user.username}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Rôle
              </label>
              <select
                className="w-full border border-gray-700 rounded-md px-3 py-2 bg-white"
                value={user.role}
                disabled
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
                className="border-gray-700 bg-white"
                value={user.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mot de passe
              </label>
              <Input
                type="password"
                className="border-gray-700 bg-white"
                value="••••••••••"
                readOnly
              />
            </div>
            <div className="flex space-x-2 col-span-2 lg:col-span-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEdit(user)}
                className="text-formality-primary hover:text-formality-primary/80"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteUser(user._id)}
                disabled={deleteLoading}
                className="text-red-600 hover:text-red-600/80"
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    ))}
  </div>
);
