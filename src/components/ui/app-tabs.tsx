
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const AppTabs = TabsPrimitive.Root

const AppTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-auto items-center justify-start bg-white border-b border-gray-200 w-full overflow-x-auto scrollbar-none",
      className
    )}
    {...props}
  />
))
AppTabsList.displayName = TabsPrimitive.List.displayName

const AppTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    badge?: string | number
  }
>(({ className, children, badge, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-600 transition-all border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-formality-primary data-[state=active]:border-formality-primary min-w-0 flex-shrink-0",
      className
    )}
    {...props}
  >
    <span className="flex items-center gap-2">
      {children}
      {badge && (
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
          {badge}
        </span>
      )}
    </span>
  </TabsPrimitive.Trigger>
))
AppTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const AppTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
AppTabsContent.displayName = TabsPrimitive.Content.displayName

export { AppTabs, AppTabsList, AppTabsTrigger, AppTabsContent }
