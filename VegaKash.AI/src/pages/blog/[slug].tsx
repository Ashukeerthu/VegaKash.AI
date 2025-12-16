import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import MainLayout from '../../layouts/MainLayout';
import styles from './[slug].module.css';

interface BlogPostPageProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  schema: object;
  content: React.ReactNode;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  title,
  description,
  date,
  image,
  category,
  schema,
  content,
}) => {
  return (
    <MainLayout
      title={title}
      description={description}
      url={`https://yourwebsite.com/blog/${slug}`}
      image={image}
      schema={schema}
    >
      <article className={styles.blogPostContainer}>
        <Link href="/blog">
          <a className={styles.backButton}>← Back to Blog</a>
        </Link>

        <header className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>{title}</h1>
          <div className={styles.blogMeta}>
            <span className={styles.blogCategory}>{category}</span>
            <time className={styles.blogDate} dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <img src={image} alt={title} className={styles.blogImage} loading="lazy" />

        <div className={styles.blogContent}>{content}</div>

        <nav className={styles.relatedPosts}>
          <h2 className={styles.relatedPostsTitle}>More from Our Blog</h2>
          <div className={styles.relatedPostsGrid}>
            <Link href="/blog/future-of-travel-2026">
              <a className={styles.relatedPostCard}>
                <h4>Future of Travel 2026</h4>
                <p>Explore how AI will revolutionize travel planning.</p>
              </a>
            </Link>
          </div>
        </nav>
      </article>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};

  if (!slug) {
    return { notFound: true };
  }

  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!resolvedSlug) {
    return { notFound: true };
  }

  const blogData = {
    'future-of-travel-2026': {
      title: 'Future of Travel 2026: How AI Will Redefine Trip Planning Forever',
      description: 'Discover how AI is transforming travel with smart planning, predictive budgeting, real-time updates, and personalized itineraries. Experience the future of travel in 2026.',
      date: '2025-12-10',
      image: 'https://yourwebsite.com/images/ai-travel-2026-banner-en.jpg',
      category: 'Travel & AI',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Future of Travel 2026: How AI Will Redefine Trip Planning Forever',
        description: 'Discover how AI is transforming travel with smart planning, predictive budgeting, real-time updates, and personalized itineraries. Experience the future of travel in 2026.',
        image: 'https://yourwebsite.com/images/ai-travel-2026-banner-en.jpg',
        author: { '@type': 'Organization', name: 'VegakTools' },
        publisher: {
          '@type': 'Organization',
          name: 'VegakTools',
          logo: { '@type': 'ImageObject', url: 'https://yourwebsite.com/images/logo.png' },
        },
        datePublished: '2025-12-10',
        dateModified: '2025-12-10',
      },
    },
  };

  const post = blogData[resolvedSlug];

  if (!post) {
    return { notFound: true };
  }

  const content = (
    <>
      <p>
        Travel planning is entering the most transformative era we've seen since the invention of online bookings.
        What used to require endless research — comparing flights, budgets, hotels, visas, weather, reviews — can now be
        generated in seconds through AI-powered tools.
      </p>

      <p>
        Today, travelers already use intelligent systems like the <strong>AI Travel Planner</strong> to generate complete
        itineraries, <strong>AI Budget Planner</strong> to predict real spending, and <strong>Visa Checker</strong> to
        handle documentation with confidence.
      </p>

      <p>
        This shift from manual planning to AI-automated travel design is not a trend — it is a fundamental rewrite of
        how the global travel ecosystem operates.
      </p>

      <h2>1. Before AI: Travel Planning Was Harder Than Traveling Itself</h2>
      <p>
        Planning a trip used to feel like work: hunting through dozens of blogs and videos, comparing flights and hotels
        on multiple tabs, estimating budgets manually, and managing group preferences.
      </p>

      <h2>2. 2025: The Year AI Quietly Rewired the Travel Industry</h2>
      <p>In 2025, AI adoption exploded. Travelers embraced tools that saved time, reduced stress, and improved accuracy.</p>

      <h3>Key Stats from 2025</h3>
      <ul>
        <li>68% of travelers used at least one AI tool during planning</li>
        <li>42% relied on AI for itinerary creation</li>
        <li>Planning time dropped by 40–60%</li>
        <li>AI improved booking satisfaction by 20–30%</li>
      </ul>

      <h2>3. 2026: The Rise of Agentic AI — When Travel Plans Update Themselves</h2>
      <p>2026 introduces the biggest leap yet: Agentic AI — AI that acts, adjusts, and manages your travel automatically.</p>

      <h3>Adaptive, Self-Updating Itineraries</h3>
      <p>Your plans will adjust in real time based on weather, events, delays, and your preferences.</p>

      <h3>Predictive Intelligence</h3>
      <p>AI will forecast price drops, crowd levels, visa delays, and ideal booking windows.</p>

      <h3>Deep Personalization</h3>
      <p>AI will tailor every part of your trip — pace, food, activities, accessibility needs, and more.</p>

      <h2>4. Industry Impact: AI Becomes the New Competitive Advantage</h2>
      <p>Hotels, airlines, travel agencies, and tourism boards will use AI to deliver smarter, more personalized experiences.</p>

      <h2>5. Plan a 2026-Ready Trip Today Using These Tools</h2>
      <p>Start exploring the future today with VegakTools:</p>

      <ul>
        <li>AI Travel Planner</li>
        <li>AI Budget Planner</li>
        <li>Visa Checker</li>
        <li>Loan Calculator</li>
        <li>Group Planner</li>
      </ul>
    </>
  );

  return {
    props: {
      slug,
      title: post.title,
      description: post.description,
      date: post.date,
      image: post.image,
      category: post.category,
      schema: post.schema,
      content,
    },
  };
};

export default BlogPostPage;