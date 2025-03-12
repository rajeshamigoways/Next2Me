"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

// Debounce function to improve performance on typing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
        "dark:bg-black dark:text-white dark:border-gray-700", 
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, children, position = "popper", ...props }, ref) => {
    const [search, setSearch] = React.useState("")
    const debouncedSearch = useDebounce(search, 300) // Debounced value to prevent excessive re-renders
    const itemsRef = React.useRef<(HTMLDivElement | null)[]>([])
    const inputRef = React.useRef<HTMLInputElement | null>(null) // Reference for the input element

    // Filter children based on the debounced search query
    const filteredChildren = React.Children.toArray(children).filter(
      (child: any) => {
        const childText = child?.props?.children
        return typeof childText === 'string' && childText.toLowerCase().includes(debouncedSearch.toLowerCase())
      }
    )

    React.useEffect(() => {
      const matchedIndex = filteredChildren.findIndex((child: any) => {
        const childText = child?.props?.children
        return typeof childText === 'string' && childText.toLowerCase().includes(debouncedSearch.toLowerCase())
      })

      if (matchedIndex !== -1 && itemsRef.current[matchedIndex]) {
        itemsRef.current[matchedIndex]?.scrollIntoView({ block: "nearest" })
      }
    }, [debouncedSearch, filteredChildren])

    React.useEffect(() => {
      // Ensure focus is maintained on input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [debouncedSearch]) // Focus should stay even after search debounce

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-50 max-h-[200px] overflow-auto rounded-md border bg-white text-black shadow-md", 
            "dark:bg-black dark:text-white dark:border-gray-700", 
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          {...props}
        >
          {/* Search input field */}
          <div className="px-2 py-1">
            <input
              ref={inputRef} // Keep reference to ensure focus is not lost
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border p-2 text-sm"
            />
          </div>

          <SelectPrimitive.Viewport className="p-1">
            {React.Children.map(filteredChildren, (child, index) =>
              React.cloneElement(child as React.ReactElement, {
                ref: (el: HTMLDivElement) => (itemsRef.current[index] = el),
              })
            )}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  }
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", "dark:text-gray-300", className)}
      {...props}
    />
  )
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "dark:focus:bg-gray-700 dark:focus:text-white", 
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", "dark:bg-gray-700", className)}
      {...props}
    />
  )
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator }
