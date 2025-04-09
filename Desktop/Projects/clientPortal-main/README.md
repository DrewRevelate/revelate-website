# RevelateOps Client Portal

A secure, industry-leading client portal for RevelateOps built with Next.js, Supabase, and modern web technologies.

## Features

- **Authentication & User Management**: Secure login and user role management
- **Client Dashboard**: Centralized overview of projects, tasks, and activities
- **Project Management**: Track project status, milestones, and completion
- **Task Management**: Manage deliverables and prioritize work
- **Meeting Scheduling**: Calendly integration for seamless scheduling
- **Document Management**: Secure file storage and sharing
- **Time Tracking**: Monitor time spent on projects and tasks
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Performance Optimizations

- **Web Vitals Monitoring**: Built-in performance tracking for Core Web Vitals
- **Progressive Image Loading**: Optimized image loading with blur placeholders
- **Lazy Loading & Code Splitting**: Components load only when needed
- **Server Components**: Leveraging Next.js App Router architecture
- **Optimized Font Loading**: Preloaded critical fonts with proper font display
- **Improved caching strategies**: Enhanced TTL and cache policies

## Accessibility Enhancements

- **WCAG 2.1 AA Compliance**: Following accessibility best practices
- **Keyboard Navigation**: Improved focus management and keyboard shortcuts
- **Screen Reader Support**: ARIA attributes and announcements
- **Skip Navigation**: Quick access to main content
- **Semantic HTML**: Proper heading structure and landmark regions
- **Focus Trapping**: Accessible modals and pop-ups

## SEO Improvements

- **Structured Data**: Schema.org markup for rich search results
- **Metadata Optimization**: Enhanced meta tags and descriptions
- **Canonical URLs**: Proper URL structure and handling
- **Breadcrumbs**: Improved navigation and site structure

## Recent Updates

- Added comprehensive performance monitoring for Core Web Vitals
- Implemented accessibility features for WCAG 2.1 AA compliance
- Enhanced component architecture with modular, reusable components
- Improved SEO with structured data and optimized metadata
- Added Calendly integration for meeting scheduling
- Implemented error boundaries for better error handling
- Created responsive layout system for consistent UI across devices

## Setup

1. Clone the repository:
```bash
git clone https://github.com/DrewRevelate/clientPortal.git
cd clientPortal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase and other credentials

5. Run database migrations:
```bash
npm run migrate
# OR directly with Supabase CLI
supabase db push
```

6. Start the development server:
```bash
npm run dev
```

7. Build for production:
```bash
npm run build
```

8. Deploy to production:
```bash
./deploy.sh
```

## Development Guidelines

- **Component Structure**: Use server components for static content and client components for interactive elements
- **Styling**: Use Tailwind CSS for all styling, following the project's design system
- **State Management**: Use React hooks for local state and context for global state
- **TypeScript**: All code should be properly typed with TypeScript
- **Testing**: Write tests for critical functionality
- **Accessibility**: Follow WCAG 2.1 AA guidelines for all components
- **Performance**: Monitor performance impact of changes with built-in Web Vitals tracking
