import type { ClientDto } from "@/api-swagger/models/ClientDto";
import type { FileDto } from "@/api-swagger/models/FileDto";
import type { EmailDto } from "@/api-swagger/models/EmailDto";
// Extended types from Dossiers.tsx
interface ExtendedClientDto extends ClientDto {
  _id: string;
  clientName: string;
}
interface ExtendedFileDto extends FileDto {
  _id: string;
  name: string;
  fileName: string;
}

interface MailTabProps {
  showArchives: boolean;
  setShowArchives: (show: boolean) => void;
  isEmailsLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  paginatedEmails: EmailDto[];
  selectedEmailId: string | null;
  handleEmailClick: (emailId: string, e: React.MouseEvent) => void;
  selectedEmail: EmailDto | null;
  clientsData: ClientDto[];
  provisionsData: string[];
  legalFormsData: string[];
  filesData: FileDto[];
}

import EmailList from "./components/EmailList";
import EmailDetail from "./components/EmailDetail";

const MailTab = ({
  showArchives,
  setShowArchives,
  isEmailsLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  paginatedEmails,
  selectedEmailId,
  handleEmailClick,
  selectedEmail,
  clientsData,
  provisionsData,
  legalFormsData,
  filesData,
}: MailTabProps) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Email List */}
      <EmailList
        showArchives={showArchives}
        setShowArchives={setShowArchives}
        isEmailsLoading={isEmailsLoading}
        paginatedEmails={paginatedEmails}
        selectedEmailId={selectedEmailId}
        handleEmailClick={handleEmailClick}
        threshold={300}
        onBottomReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
      />
      {/* Email Detail */}
      <EmailDetail
        loading={isEmailsLoading}
        selectedEmail={selectedEmail}
        clientsData={clientsData}
        filesData={filesData}
        provisionsData={provisionsData}
        legalFormsData={legalFormsData}
        selectedEmailId={selectedEmailId}
      />
    </div>
  </div>
);

export default MailTab;
