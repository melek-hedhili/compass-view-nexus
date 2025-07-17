import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export interface SegmentedTab {
  name: string;
  value: string;
  icon: React.ElementType;
  component?: React.ReactNode;
  badgeCount?: number | string;
  badgeClassName?: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTab[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  tabListClassName?: string;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  value,
  onValueChange,
  className = "",
  tabListClassName = "",
}) => (
  <Tabs value={value} onValueChange={onValueChange} className={className}>
    <TabsList
      className={
        "flex items-center gap-0 sm:gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto flex-nowrap h-14 scrollbar-thin scrollbar-thumb-formality-primary/60 scrollbar-thumb-rounded overflow-visible " +
        tabListClassName
      }
    >
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="
            flex flex-col lg:flex-row items-center justify-center
            gap-1 lg:gap-2
            px-2 pt-2 pb-1
            data-[state=active]:bg-white
            data-[state=active]:text-formality-primary
            rounded-lg font-semibold transition-colors
            min-w-[50px] max-w-none
            min-h-10
            overflow-visible
          "
        >
          {/* Icon+badge with tooltip on xs, normal on sm+ */}
          <span className="relative flex items-center justify-center">
            {/* Tooltip only on xs (block on xs, hidden on sm+) */}
            <span className="block sm:hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="relative flex items-center justify-center">
                      <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                      {tab.badgeCount != null && tab.badgeCount !== "" && (
                        <span
                          className={`absolute -top-2 -right-2 z-10 h-3 min-w-3 text-[8px] px-0.5 flex items-center justify-center rounded-full font-medium ${
                            tab.badgeClassName || "bg-gray-500 text-white"
                          }`}
                        >
                          {tab.badgeCount}
                        </span>
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tab.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            {/* Normal icon+badge on sm+ */}
            <span className="hidden sm:block relative flex items-center justify-center">
              <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
              {tab.badgeCount != null && tab.badgeCount !== "" && (
                <span
                  className={`absolute -top-2 -right-2 z-10 h-3 min-w-3 text-[8px] px-0.5 flex items-center justify-center rounded-full font-medium ${
                    tab.badgeClassName || "bg-gray-500 text-white"
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </span>
          </span>
          <span className="hidden sm:block truncate max-w-[60px] text-[11px] lg:max-w-none lg:truncate-none lg:text-xs xl:text-xs">
            {tab.name}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
    {tabs.map(
      (tab) =>
        tab.component && (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        )
    )}
  </Tabs>
);

export default SegmentedTabs;
