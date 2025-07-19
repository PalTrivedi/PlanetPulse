import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(({ children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(child => child.type === SelectTrigger);
  const content = childrenArray.find(child => child.type === SelectContent);

  return (
    <div ref={selectRef} className="relative" {...props}>
      {React.cloneElement(trigger, {
        onClick: () => setIsOpen(!isOpen),
        isOpen,
        selectedValue
      })}
      {isOpen && React.cloneElement(content, {
        onSelect: handleSelect,
        selectedValue
      })}
    </div>
  );
});

Select.displayName = "Select";

const SelectTrigger = React.forwardRef(({ className = "", children, isOpen, selectedValue, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ placeholder, ...props }, ref) => {
  return <span ref={ref} {...props}>{placeholder}</span>;
});

SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className = "", children, onSelect, selectedValue, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div
      ref={ref}
      className={`absolute top-full left-0 right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md mt-1 ${className}`}
      {...props}
    >
      {childrenArray.map((child, index) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            key: index,
            onClick: () => onSelect(child.props.value),
            isSelected: child.props.value === selectedValue
          });
        }
        return child;
      })}
    </div>
  );
});

SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className = "", children, value, isSelected, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-accent text-accent-foreground' : ''} ${className}`}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  );
});

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }; 