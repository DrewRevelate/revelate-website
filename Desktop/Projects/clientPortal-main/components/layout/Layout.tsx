import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 bg-gray-50 dark:bg-gray-950">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
