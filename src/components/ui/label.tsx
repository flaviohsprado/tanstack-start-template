import { cn } from "@/lib/utils";
import * as React from "react";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
   ({ className, ...props }, ref) => (
      // biome-ignore lint/a11y/noLabelWithoutControl: This is a reusable label component that will be associated with inputs when used
      <label
         ref={ref}
         className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className,
         )}
         {...props}
      />
   ),
);
Label.displayName = "Label";

export { Label };
