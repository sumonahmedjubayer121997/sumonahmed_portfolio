
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Plus, Check, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as simpleIcons from "simple-icons";
import { 
  getAllIconCategories, 
  createIconCategory, 
  updateIconCategory, 
  deleteIconCategory,
  addIconToCategory,
  getIconsByCategory,
  removeIconFromCategory,
  initializeDefaultCategories
} from "@/services/iconCategoryService";
import { IconCategory, CategoryIcon } from "@/types/iconCategories";
import TechIcon from "./TechIcon";

interface CategoryIconSelectorProps {
  selectedIcons: string[];
  onIconsChange: (icons: string[]) => void;
}

const CategoryIconSelector = ({ selectedIcons, onIconsChange }: CategoryIconSelectorProps) => {
  const [categories, setCategories] = useState<IconCategory[]>([]);
  const [categoryIcons, setCategoryIcons] = useState<Record<string, CategoryIcon[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6B7280");
  const [editingCategory, setEditingCategory] = useState<IconCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load categories and icons
  useEffect(() => {
    loadCategories();
    initializeDefaultCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getAllIconCategories();
      setCategories(categoriesData);
      
      // Load icons for each category
      const iconsData: Record<string, CategoryIcon[]> = {};
      for (const category of categoriesData) {
        const icons = await getIconsByCategory(category.id);
        iconsData[category.id] = icons;
      }
      setCategoryIcons(iconsData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    const { error } = await createIconCategory({
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      color: newCategoryColor
    });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Category created successfully"
      });
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryColor("#6B7280");
      loadCategories();
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const { error } = await updateIconCategory(editingCategory.id, {
      name: editingCategory.name,
      description: editingCategory.description,
      color: editingCategory.color
    });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
      setEditingCategory(null);
      loadCategories();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const { error } = await deleteIconCategory(categoryId);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      loadCategories();
    }
  };

  const handleAddIconToCategory = async () => {
    if (!selectedCategory || !inputValue.trim()) return;

    const iconName = inputValue.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const { error } = await addIconToCategory({
      categoryId: selectedCategory,
      iconName: iconName,
      displayName: inputValue.trim()
    });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Icon added to category"
      });
      setInputValue("");
      loadCategories();
    }
  };

  const handleRemoveIconFromCategory = async (iconId: string) => {
    const { error } = await removeIconFromCategory(iconId);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Icon removed from category"
      });
      loadCategories();
    }
  };

  const addToSelected = (iconName: string) => {
    if (!selectedIcons.includes(iconName)) {
      onIconsChange([...selectedIcons, iconName]);
    }
  };

  const removeFromSelected = (iconName: string) => {
    onIconsChange(selectedIcons.filter(icon => icon !== iconName));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Icons */}
      {selectedIcons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Icons ({selectedIcons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedIcons.map((icon) => (
                <Badge key={icon} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  <TechIcon techName={icon} className="w-4 h-4" />
                  <span className="text-sm">{icon}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFromSelected(icon)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse by Category</TabsTrigger>
          <TabsTrigger value="manage">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Add Icon to Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add Icon to Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter icon name (e.g., react, python)..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddIconToCategory}
                  disabled={!selectedCategory || !inputValue.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browse Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <CardTitle className="text-sm">{category.name}</CardTitle>
                    </div>
                    <span className="text-xs text-gray-500">
                      {categoryIcons[category.id]?.length || 0} icons
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-gray-600">{category.description}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categoryIcons[category.id]?.map((icon) => (
                      <div key={icon.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <TechIcon techName={icon.iconName} className="w-4 h-4" />
                          <span className="text-sm">{icon.displayName || icon.iconName}</span>
                        </div>
                        <div className="flex gap-1">
                          {selectedIcons.includes(icon.iconName) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromSelected(icon.iconName)}
                              className="h-6 px-2"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToSelected(icon.iconName)}
                              className="h-6 px-2"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveIconFromCategory(icon.id)}
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {/* Create New Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Create New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                />
                <Input
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Description (optional)"
                />
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-16"
                  />
                  <Button onClick={handleCreateCategory} className="flex-1">
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            name: e.target.value
                          })}
                          className="flex-1"
                        />
                        <Input
                          value={editingCategory.description || ""}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            description: e.target.value
                          })}
                          placeholder="Description"
                          className="flex-1"
                        />
                        <Input
                          type="color"
                          value={editingCategory.color}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            color: e.target.value
                          })}
                          className="w-16"
                        />
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleUpdateCategory}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <span className="font-medium">{category.name}</span>
                            {category.description && (
                              <p className="text-sm text-gray-600">{category.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryIconSelector;
