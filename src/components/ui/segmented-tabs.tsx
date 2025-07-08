import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface SegmentedTab {
  name: string;
  value: string;
  icon: React.ElementType;
  component?: React.ReactNode;
  badge?: React.ReactNode;
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
        "flex gap-0 sm:gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto flex-nowrap h-12 scrollbar-thin scrollbar-thumb-formality-primary/60 scrollbar-thumb-rounded " +
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
            px-2 py-1
            data-[state=active]:bg-white
            data-[state=active]:text-formality-primary
            rounded-lg font-semibold transition-colors
            min-w-[50px] max-w-none
            h-10
          "
        >
          <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
          <span className="hidden sm:block truncate max-w-[60px] text-[11px] lg:max-w-none lg:truncate-none lg:text-xs xl:text-xs">
            {tab.name}
          </span>
          {tab.badge}
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
