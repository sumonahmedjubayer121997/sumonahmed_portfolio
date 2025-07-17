
import React, { useEffect, useState } from 'react';
import { listenDynamicContent } from "@/integrations/firebase/firestore";
import TechIcon from "../TechIcon";

const TechStack = () => {
  const [homeData, setHomeData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = listenDynamicContent(
      'home', 
      '7E1fmebGEixv8p2mjJfy',
      (data) => {
        setHomeData(data?.content || null);
        setIsLoading(false);
      },
      (error) => {
        console.error("Realtime error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const itemStyle = { opacity: 1, transform: 'none' };

  if (isLoading) {
    return (
      <div>
        <p className="mb-2.5 text-sm text-slate-600 dark:text-slate-400">
          Loading tech stack...
        </p>
      </div>
    );
  }

  const selectedIcons = homeData?.selectedIcons || [];

  return (
    <div>
      <p
        className="mb-2.5 text-sm text-slate-600 dark:text-slate-400"
        style={itemStyle}
      >
        Current favorite tech stack/tools:
      </p>
      <ul className="flex flex-wrap items-center gap-3.5 text-slate-500 dark:text-slate-500">
        {selectedIcons.map((techName: string, index: number) => (
          <li key={index} style={itemStyle}>
            <TechIcon 
              techName={techName} 
              className="hover:scale-110 transition-transform duration-200"
            />
          </li>
        ))}
        {selectedIcons.length > 0 && (
          <>
            <li style={itemStyle}>
              <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
            </li>
            <li style={itemStyle}>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                Hover to see in color
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default TechStack;
