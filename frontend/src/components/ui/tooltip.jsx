import React, { createContext, useContext, useState } from 'react';

const TooltipContext = createContext();

export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState(null);

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-sm bg-popover text-popover-foreground rounded-md shadow-md border border-border"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
}; 