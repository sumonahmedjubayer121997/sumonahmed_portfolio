
import React, { useEffect, useState } from 'react';
import { listenDynamicContent } from "@/integrations/firebase/firestore";
import { getAllCategorizedIcons } from "@/services/iconCategoryService";
import { IconWithCategory } from "@/types/iconCategories";
import TechIcon from "../TechIcon";

const TechStack = () => {
  const [homeData, setHomeData] = useState<any | null>(null);
  const [categorizedIcons, setCategorizedIcons] = useState<IconWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;

    const loadData = async () => {
      setIsLoading(true);
      const { icons, error } = await getAllCategorizedIcons();
      if (!error && icons) {
        setCategorizedIcons(icons);
      }

      unsubscribeFn = listenDynamicContent(
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
    };

    loadData();

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  const itemStyle = { opacity: 1, transform: 'none' };
  const selectedIcons = Array.isArray(homeData?.selectedIcons) ? homeData.selectedIcons : [];

  const groupedSelectedIcons = selectedIcons.reduce(
    (acc: Record<string, IconWithCategory[]>, iconName: string) => {
      const categorizedIcon = categorizedIcons.find(icon => icon.iconName === iconName);
      const groupName = categorizedIcon?.categoryName || 'Other';

      if (!acc[groupName]) acc[groupName] = [];

      acc[groupName].push(
        categorizedIcon || {
          id: iconName,
          categoryId: 'other',
          iconName,
          displayName: iconName,
          categoryName: 'Other',
          categoryColor: '#6B7280',
          createdAt: new Date().toISOString(),
        }
      );

      return acc;
    },
    {}
  );

  const hasSelectedIcons = selectedIcons.length > 0;

  return (
    <div>
      <p className="mb-2.5 text-sm text-slate-600 dark:text-slate-400" style={itemStyle}>
        Current favorite tech stack/tools:
      </p>

      {isLoading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading tech stack...</p>
      ) : hasSelectedIcons ? (
        <ul className="flex flex-wrap items-center text-slate-500 dark:text-slate-500">
          {Object.entries(groupedSelectedIcons).flatMap(([categoryName, icons], groupIndex, arr) => {
            const items = icons.map((icon, i) => (
              <li
                key={`${icon.categoryId}-${icon.iconName}-${i}`}
                className="relative group w-10 h-10 flex items-center justify-center"
                style={itemStyle}
              >
                {/* Tooltip */}
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 rounded bg-slate-700 text-white shadow-md z-50 pointer-events-none whitespace-nowrap text-center">
                  {icon.displayName?.charAt(0).toUpperCase() + icon.displayName?.slice(1)} 
                  <span className="mx-1 opacity-60">|</span> 
                  {icon.categoryName?.charAt(0).toUpperCase() + icon.categoryName?.slice(1)}
                </div>

                <TechIcon
                  techName={icon.iconName}
                  className="hover:scale-110 transition-transform duration-200"
                />
              </li>
            ));

            // Add separator except after last group
            if (groupIndex < arr.length - 1) {
              items.push(
                <li key={`separator-${groupIndex}`} className="mx-3">
                  <div className="h-6 w-px bg-slate-400 dark:bg-slate-600 opacity-60" />
                </li>
              );
            }

            return items;
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No tech stack selected yet.
        </p>
      )}
    </div>
  );
};

export default TechStack;
