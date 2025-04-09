import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the signin page
  // This is beneficial to implement the logic here rather than relying
  // solely on middleware to avoid potential redirect loops
  redirect('/auth/signin');
  
  // This won't be rendered as redirect will take effect
  return null;
}
