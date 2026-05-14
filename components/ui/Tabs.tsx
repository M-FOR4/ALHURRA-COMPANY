import * as React from "react";
import { cn } from "./Button";

interface TabsProps {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}

const TabsContext = React.createContext<{
    value: string;
    setValue: (value: string) => void;
} | null>(null);

export function Tabs({ defaultValue, className, children }: TabsProps) {
    const [value, setValue] = React.useState(defaultValue);
    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("inline-flex items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
        <button
            onClick={() => context.setValue(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-alhurra-blue shadow-sm"
                    : "hover:bg-white/50 text-slate-500",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
        <div className={cn("mt-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
}
