import { useEffect, useState } from 'react';
import { FileText, FolderOpen, Eye, TrendingUp } from 'lucide-react';
import { articlesApi } from '@/api/articles';
import { categoriesApi } from '@/api/categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import type { Article, Category } from '@/types';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalViews: number;
  recentArticles: Article[];
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalViews: 0,
    recentArticles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch articles
        const articlesResponse = await articlesApi.list({ page_size: 100 });
        const articles = articlesResponse.results;

        // Fetch categories
        const categoriesResponse = await categoriesApi.list();

        // Calculate stats
        const publishedArticles = articles.filter(
          (a) => a.publish_status === 'published'
        );
        const draftArticles = articles.filter(
          (a) => a.publish_status === 'draft'
        );
        const totalViews = articles.reduce((sum, a) => sum + a.view_count, 0);

        setStats({
          totalArticles: articles.length,
          publishedArticles: publishedArticles.length,
          draftArticles: draftArticles.length,
          totalCategories: categoriesResponse.results.length,
          totalViews,
          recentArticles: articles.slice(0, 5),
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Published',
      value: stats.publishedArticles,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Drafts',
      value: stats.draftArticles,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={cn('rounded-lg p-3', card.bgColor)}>
                  <card.icon className={cn('h-6 w-6', card.color)} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentArticles.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No articles yet. Create your first article to get started.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {stats.recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {article.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      By {article.author.full_name} •{' '}
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="mr-1 h-4 w-4" />
                      {article.view_count}
                    </div>
                    <StatusBadge status={article.publish_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for className merging
import { cn } from '@/utils/cn';
