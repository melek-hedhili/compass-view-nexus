import { Button } from "@/components/ui/button";
import { Mail, Archive } from "lucide-react";
import React, { useRef, useCallback } from "react";
import { type EmailDto } from "@/api-swagger/models/EmailDto";
import { formatDate } from "@/utils/utils";

interface EmailListProps {
  showArchives: boolean;
  setShowArchives: (show: boolean) => void;
  isEmailsLoading: boolean;
  paginatedEmails: EmailDto[];
  selectedEmailId: string | null;
  onBottomReached?: () => void;
  /**
   * Number of pixels from the bottom of the list to trigger onBottomReached.
   * Default: 300
   */
  threshold?: number;
  handleEmailClick: (emailId: string, e: React.MouseEvent) => void;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
}

const EmailList: React.FC<EmailListProps> = ({
  showArchives,
  setShowArchives,
  isEmailsLoading,
  paginatedEmails,
  selectedEmailId,
  onBottomReached,
  threshold = 50,
  handleEmailClick,
  isFetchingNextPage = false,
  hasNextPage = false,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (
      !listRef.current ||
      !onBottomReached ||
      isFetchingNextPage ||
      !hasNextPage
    ) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    // Trigger when within `threshold` pixels from the bottom
    if (scrollHeight - scrollTop - clientHeight <= threshold) {
      onBottomReached();
    }
  }, [onBottomReached, threshold, isFetchingNextPage, hasNextPage]);

  return (
    <div className="lg:col-span-1 border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-2 p-3 bg-blue-50 border-b">
        <Button
          variant="secondary"
          size="sm"
          className={`text-sm px-3 py-1 h-auto ${
            !showArchives ? "bg-white shadow-sm" : ""
          }`}
          onClick={() => setShowArchives(false)}
        >
          <Mail className="h-3 w-3 mr-1" />
          Boîte mail
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`text-sm px-3 py-1 h-auto ${
            showArchives ? "bg-white shadow-sm" : ""
          }`}
          onClick={() => setShowArchives(true)}
        >
          <Archive className="h-3 w-3 mr-1" />
          Archives
        </Button>
      </div>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto divide-y"
        onScroll={handleScroll}
      >
        {isEmailsLoading ? (
          <div className="py-1">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="p-3 mb-2 bg-gray-100 rounded transition-colors w-full"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="h-4 w-1/3 bg-gray-300 rounded" />{" "}
                  {/* client name */}
                  <div className="h-3 w-16 bg-gray-200 rounded ml-2" />{" "}
                  {/* date */}
                </div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mb-1" />{" "}
                {/* from */}
                <div className="h-3 w-2/3 bg-gray-200 rounded mb-1" />{" "}
                {/* subject */}
                <div className="flex justify-between items-center mt-2">
                  <div className="h-5 w-20 bg-gray-200 rounded-full" />{" "}
                  {/* status */}
                  <div className="h-3 w-12 bg-gray-100 rounded" />{" "}
                  {/* selected (invisible) */}
                </div>
              </div>
            ))}
          </div>
        ) : paginatedEmails?.length === 0 ? (
          <div className="p-4 h-full flex flex-col items-center justify-center text-gray-500">
            <Mail className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun email trouvé</p>
          </div>
        ) : (
          <>
            {paginatedEmails?.map((email) => (
              <div
                key={email._id}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEmailId === email._id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={(e) => handleEmailClick(email._id, e)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm truncate">
                      {email.client?.clientName}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(email.date)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {email.from}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {email.subject}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      Non traité
                    </span>
                    {selectedEmailId === email._id && (
                      <span className="text-xs text-blue-600 font-medium">
                        Sélectionné
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator for infinite scroll */}
            {isFetchingNextPage && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-formality-primary mx-auto mb-2" />
                <p className="text-xs">Chargement de plus d'emails...</p>
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && paginatedEmails.length > 0 && (
              <div className="p-4 text-center text-gray-400">
                <p className="text-xs">Fin de la liste</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailList;
