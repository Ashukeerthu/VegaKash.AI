import React from 'react';
import { Card } from '../../core/ui';
import { PageLayout } from '../../core/layout';
import { useSEO } from '../../core/seo';
import ScrollToTop from '../../core/ui/ScrollToTop';

/**
 * Home Renovation Budget Planner - Coming Soon
 * 
 * @component
 * @description Plan home renovation with room-wise budget tracking
 * Features: Material costs, labor, timeline planning
 */
function RenovationBudget() {
  useSEO({
    title: 'Home Renovation Budget Planner - Coming Soon | VegaKash.AI',
    description: 'Plan your home renovation with our comprehensive budget calculator',
    keywords: 'renovation budget, home improvement, remodeling cost calculator',
    canonical: '/budgets/renovation'
  });

  return (
    <>
      <ScrollToTop threshold={300} />
      <PageLayout maxWidth="lg" spacing="large" background="gradient">
        <Card variant="elevated" padding="large">
        <Card.Header 
          title="🏠 Renovation Budget Planner"
          subtitle="Coming Soon"
        />
        <Card.Body>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
            <h2>Under Development</h2>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>
              Complete home renovation budget planner is coming soon!
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
                <li>✓ Room-Wise Budget Breakdown</li>
                <li>✓ Material vs Labor Costs</li>
                <li>✓ Contractor Management</li>
                <li>✓ Timeline Planning</li>
                <li>✓ Progress Tracking</li>
                <li>✓ Before/After Photos</li>
                <li>✓ Cost Comparison</li>
              </ul>
            </div>
          </div>
        </Card.Body>
        </Card>
      </PageLayout>
    </>
  );
}

export default RenovationBudget;
