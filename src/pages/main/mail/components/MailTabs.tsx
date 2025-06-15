
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/data-table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MailDetail from "../MailDetail";
import ReplyModal from "../ReplyModal";
import NewMessageModal from "../NewMessageModal";
import { getTableColumns, sortData } from "../utils";
import { ExtendedEmailDto } from "../utils";
import { ReactNode } from "react";

interface MailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  inboxData: any;
  archivedData: any;
  sentData: any;
  isLoading: boolean;
  error: any;
  selectedMail: string | null;
  onSelectMail: (mailId: string) => void;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  selectedMailData: ExtendedEmailDto | null;
  onCloseDrawer: () => void;
  onReply: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  isArchiving: boolean;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (perPage: number) => void;
  handleSort: (field: string, order: "asc" | "desc") => void;
  paginationParams: {
    page: number;
    perPage: number;
    sortField: string;
    sortOrder: "asc" | "desc";
  };
  replyToEmail: ExtendedEmailDto | null;
  isReplyOpen: boolean;
  setIsReplyOpen: (open: boolean) => void;
  setReplyToEmail: (email: ExtendedEmailDto | null) => void;
  isNewMessageOpen: boolean;
  onCloseNewMessageModal: () => void;
}

const MailTabs = ({
  activeTab,
  onTabChange,
  inboxData,
  archivedData,
  sentData,
  isLoading,
  error,
  selectedMail,
  onSelectMail,
  isDrawerOpen,
  onDrawerOpenChange,
  selectedMailData,
  onCloseDrawer,
  onReply,
  onArchive,
  onUnarchive,
  isArchiving,
  handlePageChange,
  handlePerPageChange,
  handleSort,
  paginationParams,
  replyToEmail,
  isReplyOpen,
  setIsReplyOpen,
  setReplyToEmail,
  isNewMessageOpen,
  onCloseNewMessageModal,
}: MailTabsProps) => {
  // Get sorted data for each tab
  const sortedInboxData = sortData(inboxData?.data, paginationParams);
  const sortedArchivedData = sortData(archivedData?.data, paginationParams);
  const sortedSentData = sortData(sentData?.data, paginationParams);

  const columns: Column<Record<string, unknown>>[] = getTableColumns(activeTab);

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <Tabs
        defaultValue="boite-mail"
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <TabsList className="bg-transparent p-0 h-auto w-full rounded-none">
            {/* Inbox Tab */}
            <TabsContent
              value="boite-mail"
              className="py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  <DataTable
                    data={sortedInboxData || []}
                    count={inboxData?.count}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={(row) => onSelectMail(row._id as string)}
                    page={paginationParams.page}
                    perPage={paginationParams.perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    sortField={paginationParams.sortField}
                    sortOrder={paginationParams.sortOrder}
                    onSort={handleSort}
                    renderListEmpty={() => (
                      <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                        Aucun mail trouvé
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            {/* Archives */}
            <TabsContent
              value="archives"
              className="py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  <DataTable
                    data={sortedArchivedData || []}
                    count={archivedData?.count}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={(row) => onSelectMail(row._id as string)}
                    page={paginationParams.page}
                    perPage={paginationParams.perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    sortField={paginationParams.sortField}
                    sortOrder={paginationParams.sortOrder}
                    onSort={handleSort}
                    renderListEmpty={() => (
                      <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                        Aucun mail trouvé
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            {/* Sent */}
            <TabsContent
              value="envoye"
              className="mt-0 h-[calc(100%-49px)]"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  <DataTable
                    data={sortedSentData || []}
                    count={sentData?.count}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={(row) => onSelectMail(row._id as string)}
                    page={paginationParams.page}
                    perPage={paginationParams.perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    sortField={paginationParams.sortField}
                    sortOrder={paginationParams.sortOrder}
                    onSort={handleSort}
                    renderListEmpty={() => (
                      <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                        Aucun mail trouvé
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </TabsList>
        </div>
      </Tabs>

      {/* Mail Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
        >
          <div className="py-4">
            <MailDetail
              mail={selectedMailData}
              onClose={onCloseDrawer}
              onReply={onReply}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              isArchiving={isArchiving}
              activeTab={activeTab}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Reply Drawer */}
      <Sheet open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
        >
          <div className="py-4">
            {replyToEmail && (
              <ReplyModal
                onClose={() => {
                  setIsReplyOpen(false);
                  setReplyToEmail && setReplyToEmail(null);
                }}
                originalEmail={replyToEmail}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* New Message Modal */}
      {isNewMessageOpen && (
        <NewMessageModal onClose={onCloseNewMessageModal} />
      )}
    </Card>
  );
};

export default MailTabs;
