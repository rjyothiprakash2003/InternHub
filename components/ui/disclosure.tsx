"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn("grid grid-cols-2 rounded-2xl bg-slate-100 p-1", className)}
    {...props}
  />
);
export const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition data-[state=active]:bg-white data-[state=active]:text-[var(--ih-navy)] data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
);
export const TabsContent = TabsPrimitive.Content;

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item className={cn("border-b border-slate-200", className)} {...props} />
);
export const AccordionTrigger = ({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between py-4 text-left text-base font-semibold text-[var(--ih-navy)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
export const AccordionContent = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    className={cn("pb-4 text-sm leading-7 text-slate-600", className)}
    {...props}
  />
);
