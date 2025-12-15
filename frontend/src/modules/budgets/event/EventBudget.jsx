import React from 'react';
import { Card } from '../../core/ui';
import { PageLayout } from '../../core/layout';
import { useSEO } from '../../core/seo';
import ScrollToTop from '../../core/ui/ScrollToTop';

/**
 * Event Budget Planner - Coming Soon
 * 
 * @component
 * @description Plan any event with comprehensive budget tracking
 * Features: Birthday, anniversary, corporate events
 */
function EventBudget() {
  useSEO({
    title: 'Event Budget Planner - Coming Soon | VegaKash.AI',
    description: 'Plan your events with our comprehensive budget calculator',
    keywords: 'event budget, party planner, event cost calculator',
    canonical: '/budgets/event'
  });

  return (
    <>
      <ScrollToTop threshold={300} />
      <PageLayout maxWidth="lg" spacing="large" background="gradient">
        <Card variant="elevated" padding="large">
        <Card.Header 
          title="🎉 Event Budget Planner"
          subtitle="Coming Soon"
        />
        <Card.Body>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
            <h2>Under Development</h2>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>
              Complete event budget planner is coming soon!
            </p>
            <div style={{ 
              marginTop: '2rem', 
              padding: '2rem', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              color: 'white'
            }}>
              <h3>Planned Features:</h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '1rem',
                textAlign: 'left',
                maxWidth: '400px',
                margin: '1rem auto'
              }}>
                <li>✓ Venue & Decoration</li>
                <li>✓ Catering & Beverages</li>
                <li>✓ Entertainment & Music</li>
                <li>✓ Guest List Management</li>
                <li>✓ Vendor Coordination</li>
                <li>✓ Budget vs Actual Tracking</li>
                <li>✓ Payment Reminders</li>
              </ul>
            </div>
          </div>
        </Card.Body>
        </Card>
      </PageLayout>
    </>
  );
}

export default EventBudget;
