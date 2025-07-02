import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { UserDto } from "@/api-swagger/models/UserDto";

interface UserDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDto | null;
}

export const UserDetailsSheet: React.FC<UserDetailsSheetProps> = ({
  isOpen,
  onClose,
  user,
}) => (
  <Sheet
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
      <SheetHeader className="p-6 pb-4 border-b border-gray-100">
        <SheetTitle className="text-2xl font-bold text-formality-accent">
          Détails de l'utilisateur
        </SheetTitle>
        <SheetDescription className="text-gray-600">
          Informations détaillées de l'utilisateur
        </SheetDescription>
      </SheetHeader>
      {user && (
        <div className="p-6 space-y-6">
          <div>
            <span className="block text-base font-semibold text-gray-700 mb-1">
              Prénom
            </span>
            <div className="text-sm font-normal">{user.username}</div>
          </div>
          <div>
            <span className="block text-base font-semibold text-gray-700 mb-1">
              Email
            </span>
            <div className="text-sm font-normal">{user.email}</div>
          </div>
          <div>
            <span className="block text-base font-semibold text-gray-700 mb-1">
              Rôle
            </span>
            <div className="text-sm font-normal">{user.role}</div>
          </div>
          <div>
            <span className="block text-base font-semibold text-gray-700 mb-1">
              ID
            </span>
            <div className="text-xs text-gray-400">{user._id}</div>
          </div>
        </div>
      )}
    </SheetContent>
  </Sheet>
);
