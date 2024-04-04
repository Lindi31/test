import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingSkeleton = () => {
  // Ein Array mit fünf Elementen erstellen, der Inhalt ist hier unwichtig, daher null
  const skeletonCount = Array(5).fill(null);
  return (
    <div>
      {skeletonCount.map((_, index) => (
        <div key={index} className="flex items-center space-x-5 mb-5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-[980px]" />
            <Skeleton className="h-4 w-[530px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
