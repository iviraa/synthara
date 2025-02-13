import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const WidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
    return (
        <div className={cn(className, "mx-auto w-full max-w-screen-xl px-2.5 m:px-20")}>
            {children}
        </div>
    )
};

export default WidthWrapper;
