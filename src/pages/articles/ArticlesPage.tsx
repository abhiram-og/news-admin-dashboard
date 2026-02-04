import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Archive,
  Send,
  RotateCcw,
  MoreHorizontal,
} from 'lucide-react';
import { articlesApi } from '@/api/articles';
import { categoriesApi } from '@/api/categories';
import { useAuthStore } from '@/contexts/AuthContext';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusBadge,
  EmptyState,
  Pagination,
} from '@/components/ui';
import { toast } from 'sonner';
import type { Article, Category, PublishStatus } from '@/types';

export function ArticlesPage() {
  const navigate = useNavigate();
  const { canDelete } = useAuthStore();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all' as PublishStatus | 'all',
    category: 'all' as string,
    search: '',
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        page_size: pageSize,
      };

      if (filters.status !== 'all') {
        params.publish_status = filters.status;
      }
      if (filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }

      const response = await articlesApi.list(params);
      setArticles(response.results);
      setTotalItems(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
    } catch (error) {
      toast.error('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: PublishStatus) => {
    try {
      await articlesApi.updateStatus(id, status);
      toast.success(
        status === 'published'
          ? 'Article published successfully'
          : status === 'archived'
          ? 'Article archived'
          : 'Article moved to drafts'
      );
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      await articlesApi.delete(id);
      toast.success('Article deleted successfully');
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete article');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as PublishStatus | 'all' })}
            options={statusOptions}
            className="w-40"
          />
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            options={categoryOptions}
            className="w-48"
          />
        </div>
        <Button onClick={() => navigate('/articles/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : articles.length === 0 ? (
            <EmptyState
              title="No articles found"
              description="Get started by creating your first article"
              action={
                <Button onClick={() => navigate('/articles/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.featured_image && (
                            <img
                              src={article.featured_image}
                              alt=""
                              className="mr-3 h-10 w-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {article.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {article.author.full_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {article.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={article.publish_status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {article.view_count.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status Actions */}
                          {article.publish_status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(article.id, 'published')}
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                              title="Publish"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          {article.publish_status === 'published' && (
                            <button
                              onClick={() => handleStatusChange(article.id, 'draft')}
                              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                              title="Unpublish"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                          {article.publish_status !== 'archived' && (
                            <button
                              onClick={() => handleStatusChange(article.id, 'archived')}
                              className="rounded-lg p-2 text-yellow-600 hover:bg-yellow-50"
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}
                          
                          <div className="mx-2 h-4 w-px bg-gray-200" />
                          
                          {/* Edit */}
                          <button
                            onClick={() => navigate(`/articles/${article.id}/edit`)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {/* Delete (Admin only) */}
                          {canDelete() && (
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        
        {/* Pagination */}
        {!isLoading && articles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
}
