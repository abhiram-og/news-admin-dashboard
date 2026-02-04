import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { categoriesApi } from '@/api/categories';
import { useAuthStore } from '@/contexts/AuthContext';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Modal,
} from '@/components/ui';
import { toast } from 'sonner';
import type { Category } from '@/types';

export function CategoriesPage() {
  const { canDelete } = useAuthStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesApi.list({ search });
      setCategories(response.results);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCategories();
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSaving(true);

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoriesApi.create(formData);
        toast.success('Category created successfully');
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.article_count > 0) {
      toast.error(`Cannot delete category with ${category.article_count} articles. Please reassign or delete articles first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await categoriesApi.delete(category.id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories found"
              description="Create categories to organize your articles"
              action={
                <Button onClick={openCreateModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {category.article_count} articles
                      </p>
                      {category.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(category)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {canDelete() && (
                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Category name"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Category description (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
