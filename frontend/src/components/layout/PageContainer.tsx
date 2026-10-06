import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** `narrow` matches Airbnb's listing page width. */
  width?: "default" | "narrow";
};

const PageContainer = ({ children, className, width = "default" }: PageContainerProps) => (
  <div
    className={cn(
      "mx-auto w-full px-6 md:px-10 xl:px-20",
      width === "narrow" ? "max-w-[1280px]" : "max-w-[1760px]",
      className,
    )}
  >
    {children}
  </div>
);

export default PageContainer;
