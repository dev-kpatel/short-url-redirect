import React from "react";

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-between animate-pulse p-4 rounded-xl border border-border bg-card/40 backdrop-blur-md h-60">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-3 bg-muted rounded w-1/12"></div>
      </div>
      <div className="w-full flex-grow flex items-end gap-2 my-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-muted rounded-md flex-grow"
            style={{ height: `${20 + Math.random() * 60}%` }}
          ></div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs">
        <div className="h-3 bg-muted rounded w-12"></div>
        <div className="h-3 bg-muted rounded w-12"></div>
        <div className="h-3 bg-muted rounded w-12"></div>
      </div>
    </div>
  );
};
