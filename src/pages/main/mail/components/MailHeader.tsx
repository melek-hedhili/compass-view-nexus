
import { Button } from "@/components/ui/button";
import { Search, Plus, MailIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MailHeaderProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onNewMessage: () => void;
}

const MailHeader = ({
  searchValue,
  onSearch,
  onNewMessage,
}: MailHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div className="flex items-center mb-4 md:mb-0">
      <MailIcon className="h-6 w-6 mr-2 text-formality-primary" />
      <h1 className="text-2xl font-bold text-formality-accent">Boîte mail</h1>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Recherche..."
          className="pl-10 border-gray-200"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button
        className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
        onClick={onNewMessage}
      >
        <Plus className="h-4 w-4" />
        <span>Nouveau message</span>
      </Button>
    </div>
  </div>
);

export default MailHeader;
