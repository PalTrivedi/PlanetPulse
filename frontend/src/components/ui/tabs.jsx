import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

const Tabs = React.forwardRef(({ defaultValue, value, onValueChange, className = "", children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || value);
  
  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };
  
  return (
    <TabsContext.Provider value={{ selectedValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ value, className = "", children, ...props }, ref) => {
  const context = useContext(TabsContext);
  const isSelected = context.selectedValue === value;
  
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected 
          ? "bg-background text-foreground shadow-sm" 
          : "hover:bg-background/50 hover:text-foreground"
      } ${className}`}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ value, className = "", children, ...props }, ref) => {
  const context = useContext(TabsContext);
  const isSelected = context.selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent }; 