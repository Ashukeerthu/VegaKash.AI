import React from 'react';
import SeoMeta from '../components/SeoMeta';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  url: string;
  image?: string;
  schema?: object;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, description, url, image, schema }) => {
  return (
    <>
      <SeoMeta title={title} description={description} url={url} image={image} schema={schema} />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;