import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const PageContainer = ({ children, className }: PageContainerProps) => (
  <div
    className={cn(
      "mx-auto w-full max-w-[1760px] px-6 md:px-10 xl:px-20",
      className,
    )}
  >
    {children}
  </div>
);

export default PageContainer;
