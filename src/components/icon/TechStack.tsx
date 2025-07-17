
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
    const loadData = async () => {
      setIsLoading(true);

      // Load categorized icons
      const { icons, error } = await getAllCategorizedIcons();
      if (!error) {
        setCategorizedIcons(icons);
      }

      // Listen to home data
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

      return unsubscribe;
    };

    const unsubscribe = loadData();
    return () => {
      if (unsubscribe instanceof Promise) {
        unsubscribe.then(unsub => unsub());
      }
    };
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

  // Group selected icons by category for better organization
  const groupedSelectedIcons = selectedIcons.reduce((acc: Record<string, IconWithCategory[]>, iconName: string) => {
    const categorizedIcon = categorizedIcons.find(icon => icon.iconName === iconName);
    if (categorizedIcon) {
      const categoryName = categorizedIcon.categoryName;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(categorizedIcon);
    } else {
      // Handle icons that aren't categorized yet
      if (!acc['Other']) {
        acc['Other'] = [];
      }
      acc['Other'].push({
        id: iconName,
        categoryId: 'other',
        iconName: iconName,
        displayName: iconName,
        categoryName: 'Other',
        categoryColor: '#6B7280',
        createdAt: new Date().toISOString()
      });
    }
    return acc;
  }, {});

  const hasSelectedIcons = selectedIcons.length > 0;

  return (
    <div>
      <p
        className="mb-2.5 text-sm text-slate-600 dark:text-slate-400"
        style={itemStyle}
      >
        Current favorite tech stack/tools:
      </p>
      
      {hasSelectedIcons ? (
        <div className="space-y-4">
          {Object.entries(groupedSelectedIcons).map(([categoryName, icons]) => (
            <div key={categoryName}>
              {Object.keys(groupedSelectedIcons).length > 1 && (
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: icons[0]?.categoryColor || '#6B7280' }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {categoryName}
                  </span>
                </div>
              )}
              <ul className="flex flex-wrap items-center gap-3.5 text-slate-500 dark:text-slate-500">
                {icons.map((icon, index) => (
                  <li key={`${icon.categoryId}-${icon.iconName}-${index}`} style={itemStyle}>
                    <TechIcon 
                      techName={icon.iconName} 
                      className="hover:scale-110 transition-transform duration-200"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="flex items-center gap-3.5 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" style={itemStyle}></div>
            <div className="text-xs text-slate-400 dark:text-slate-500" style={itemStyle}>
              Hover to see in color
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400 dark:text-slate-500">
          No tech stack selected yet.
        </div>
      )}
    </div>
  );
};

export default TechStack;
