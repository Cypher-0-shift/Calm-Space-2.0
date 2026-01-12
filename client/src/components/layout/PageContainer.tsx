import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  size?: "normal" | "wide";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  size = "normal",
}) => {
  const maxWidth = size === "wide" ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className={`${maxWidth} mx-auto w-full px-6`}>
      {children}
    </div>
  );
};
