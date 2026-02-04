import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { articlesApi } from '@/api/articles';
import { categoriesApi } from '@/api/categories';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { toast } from 'sonner';
import type { Category, PublishStatus } from '@/types';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function ArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category_id: '',
    publish_status: 'draft' as PublishStatus,
    is_featured: false,
    meta_title: '',
    meta_description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const article = await articlesApi.get(Number(id));
      setFormData({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || '',
        category_id: article.category?.id ? String(article.category.id) : '',
        publish_status: article.publish_status,
        is_featured: article.is_featured,
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
      });
      if (article.featured_image) {
        setFeaturedImagePreview(article.featured_image);
      }
      editor?.commands.setContent(article.content);
    } catch (error) {
      toast.error('Failed to fetch article');
      navigate('/articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const data = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        featured_image: featuredImage,
      };

      if (isEditing) {
        await articlesApi.update(Number(id), data);
        toast.success('Article updated successfully');
      } else {
        await articlesApi.create(data);
        toast.success('Article created successfully');
      }

      navigate('/articles');
    } catch (error: any) {
      const apiErrors = error.response?.data?.error?.details;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        toast.error(error.response?.data?.error?.message || 'Failed to save article');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/articles')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title"
                error={errors.title}
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="article-url-slug"
                helperText="Leave empty to auto-generate from title"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Content
                </label>
                {/* TipTap Toolbar */}
                <div className="mb-2 flex flex-wrap gap-1 rounded-t-lg border border-gray-300 bg-gray-50 p-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`rounded px-2 py-1 text-sm ${
                      editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`rounded px-2 py-1 text-sm ${
                      editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'
                    }`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`rounded px-2 py-1 text-sm ${
                      editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'
                    }`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`rounded px-2 py-1 text-sm ${
                      editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'
                    }`}
                  >
                    List
                  </button>
                </div>
                {/* Editor */}
                <div
                  className={`min-h-[300px] rounded-b-lg border border-t-0 border-gray-300 p-4 ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                >
                  <EditorContent editor={editor} className="prose max-w-none" />
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the article"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to auto-generate from content
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meta Title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title"
                helperText="Leave empty to use article title"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="SEO description for search engines"
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Status"
                value={formData.publish_status}
                onChange={(e) =>
                  setFormData({ ...formData, publish_status: e.target.value as PublishStatus })
                }
                options={statusOptions}
              />

              <Select
                label="Category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                options={categoryOptions}
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                  Featured Article
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {featuredImagePreview ? (
                <div className="relative">
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null);
                      setFeaturedImagePreview(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/articles')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSaving}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
