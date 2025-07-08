import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api-swagger/services/UserService";
import type { UserDto } from "@/api-swagger/models/UserDto";
import LoadingSpinner from "@/components/LoadingSpinner";
import { User as UserIcon, Mail, Shield } from "lucide-react";

interface UserDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export const UserDetailsSheet: React.FC<UserDetailsSheetProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const { data: user, isLoading } = useQuery<UserDto>({
    queryKey: ["user", userId, isOpen],
    queryFn: () => UserService.userControllerFindOne({ id: userId }),
    enabled: !!userId && isOpen,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails de l'utilisateur
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées de l'utilisateur
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100 mb-2 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-purple-700" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.username || "-"}
                </h3>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-formality-primary" />
                    <span className="text-sm font-semibold text-gray-700">
                      Email
                    </span>
                  </div>
                  <div className="text-sm font-normal">
                    {user?.email || "-"}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-formality-primary" />
                    <span className="text-sm font-semibold text-gray-700">
                      Rôle
                    </span>
                  </div>
                  <div className="text-sm font-normal">{user?.role || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
