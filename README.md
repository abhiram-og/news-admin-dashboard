# News Admin Dashboard

A production-ready React admin dashboard for managing news articles.

## Features

- **Authentication**: JWT-based login with auto token refresh
- **Article Management**: Create, edit, publish, archive articles
- **Rich Text Editor**: TipTap editor for article content
- **Category Management**: Organize articles by categories
- **User Management**: Admin-only user controls
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (API calls)
- Zustand (state management)
- TipTap (rich text editor)
- Sonner (toast notifications)

## Project Structure

```
src/
├── api/              # API layer (axios, endpoints)
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (Sidebar, Header)
│   └── ui/           # UI components (Button, Input, etc.)
├── contexts/         # React contexts (Auth)
├── pages/            # Page components
│   ├── articles/     # Article list & form
│   ├── categories/   # Category management
│   └── users/        # User management
├── router/           # Route configuration
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API URL

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## API Integration

The dashboard expects these backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login/` | POST | Login |
| `/auth/refresh/` | POST | Refresh token |
| `/auth/logout/` | POST | Logout |
| `/auth/profile/` | GET | User profile |
| `/admin/articles/` | GET/POST | List/Create articles |
| `/admin/articles/{id}/` | PATCH/DELETE | Update/Delete article |
| `/admin/articles/{id}/status/` | PATCH | Change status |
| `/admin/categories/` | GET/POST | List/Create categories |
| `/admin/categories/{id}/` | PATCH/DELETE | Update/Delete category |

## Authentication Flow

1. User logs in with email/password
2. Backend returns access token + refresh token + user data
3. Access token stored in memory (Zustand)
4. Refresh token stored in localStorage
5. Axios interceptor adds token to requests
6. On 401, interceptor refreshes token automatically
7. On refresh failure, user is logged out

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Login page | Public |
| `/dashboard` | Dashboard with stats | Authenticated |
| `/articles` | Article list | Authenticated |
| `/articles/new` | Create article | Authenticated |
| `/articles/:id/edit` | Edit article | Authenticated |
| `/categories` | Category management | Authenticated |
| `/users` | User management | Admin only |
| `/profile` | User profile | Authenticated |

## Role-Based Access

- **Admin**: Full access (can delete articles, manage users)
- **Editor**: Can create/edit/publish articles, manage categories

## Deployment

### Build
```bash
npm run build
```

### Docker
```bash
docker build -t news-admin .
docker run -p 80:80 news-admin
```

### Nginx Config
```nginx
server {
    listen 80;
    root /var/www/news-admin/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
