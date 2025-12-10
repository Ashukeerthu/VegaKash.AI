import React from 'react';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import styles from './blog.module.css';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
}

const BlogPage: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      slug: 'future-of-travel-2026',
      title: 'Future of Travel 2026: How AI Will Redefine Trip Planning Forever',
      description: 'Discover how AI is transforming travel with smart planning, predictive budgeting, real-time updates, and personalized itineraries.',
      date: '2025-12-10',
      image: '/images/ai-travel-2026-banner-en.jpg',
      category: 'Travel & AI',
    },
  ];

  return (
    <MainLayout
      title="Blog - VegakTools"
      description="Read the latest articles about AI tools, financial planning, travel, and technology."
      url="http://localhost:3000/blog"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'VegakTools Blog',
        description: 'Read the latest articles about AI tools, financial planning, travel, and technology.',
      }}
    >
      <div className={styles.blogContainer}>
        <h1>VegakTools Blog</h1>
        <p className={styles.subtitle}>Insights on AI, Finance, Travel & More</p>

        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article key={post.slug} className={styles.blogCard}>
              <img src={post.image} alt={post.title} className={styles.blogImage} />
              <div className={styles.blogContent}>
                <span className={styles.category}>{post.category}</span>
                <h2>
                  <Link href={`/blog/${post.slug}`}>
                    <a>{post.title}</a>
                  </Link>
                </h2>
                <p className={styles.description}>{post.description}</p>
                <div className={styles.blogMeta}>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <Link href={`/blog/${post.slug}`}>
                    <a className={styles.readMore}>Read More →</a>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;