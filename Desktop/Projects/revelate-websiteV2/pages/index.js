// This is a placeholder file to satisfy Next.js requirements
// The actual website is served from the static HTML files and Express.js

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the main index.html
    window.location.href = '/index.html';
  }, []);

  return <div>Redirecting to main website...</div>;
}
