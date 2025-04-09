"use client";

/**
 * SchemaOrg component for adding structured data to pages
 * Use this component to add JSON-LD structured data to your pages
 */
export default function SchemaOrg({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Commonly used schema.org templates
export const schemaTemplates = {
  // Organization schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RevelateOps",
    "url": "https://client-portal.revelateops.com",
    "logo": "https://client-portal.revelateops.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "support@revelateops.com"
    }
  },
  
  // Project schema (for project pages)
  project: (project: any) => ({
    "@context": "https://schema.org",
    "@type": "Project",
    "name": project.name,
    "description": project.description,
    "startDate": project.start_date,
    "endDate": project.target_end_date,
    "status": project.status,
    "provider": {
      "@type": "Organization",
      "name": "RevelateOps"
    }
  }),
  
  // Task schema (for task pages)
  task: (task: any) => ({
    "@context": "https://schema.org",
    "@type": "Action",
    "name": task.title,
    "description": task.description,
    "startTime": task.created_date,
    "endTime": task.completed_date,
    "actionStatus": task.status === "Completed" ? "CompletedActionStatus" : 
                  task.status === "In Progress" ? "ActiveActionStatus" : 
                  "PotentialActionStatus"
  }),
  
  // Meeting schema (for meeting pages)
  meeting: (meeting: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": meeting.title,
    "description": meeting.description,
    "startDate": meeting.start_time,
    "endDate": meeting.end_time,
    "location": meeting.meeting_link ? {
      "@type": "VirtualLocation",
      "url": meeting.meeting_link
    } : undefined
  }),
  
  // Breadcrumbs schema
  breadcrumbs: (items: {name: string, url: string}[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};
