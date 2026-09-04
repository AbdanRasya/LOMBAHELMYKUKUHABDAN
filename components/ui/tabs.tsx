"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-6",
        orientation === "horizontal" ? "flex-col" : "flex-col md:flex-row",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex rounded-2xl p-1.5 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-slate-100/80 border border-slate-200/60",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        tabsListVariants({ variant }),
        "group-data-[orientation=horizontal]/tabs:flex-row group-data-[orientation=horizontal]/tabs:flex-wrap group-data-[orientation=horizontal]/tabs:w-fit",
        "group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:md:w-64 group-data-[orientation=vertical]/tabs:shrink-0 group-data-[orientation=vertical]/tabs:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50",
        "text-slate-600 hover:text-slate-900 hover:bg-white/60",
        "data-[active]:bg-white data-[active]:text-slate-900 data-[active]:shadow-sm data-[active]:font-bold",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:text-left",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 min-w-0 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
