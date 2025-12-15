import React from 'react';
import { Card } from '../../core/ui';
import { PageLayout } from '../../core/layout';
import { useSEO } from '../../core/seo';
import ScrollToTop from '../../core/ui/ScrollToTop';

/**
 * Trip/Vacation Budget Planner - Coming Soon
 * 
 * @component
 * @description Plan your dream vacation with budget tracking
 * Features: Flights, hotels, activities, per-day expenses
 */
function TripBudget() {
  useSEO({
    title: 'Trip Budget Planner - Coming Soon | VegaKash.AI',
    description: 'Plan your perfect vacation with our comprehensive trip budget calculator',
    keywords: 'trip budget, vacation planner, travel budget calculator',
    canonical: '/budgets/trip'
  });

  return (
    <>
      <ScrollToTop threshold={300} />
      <PageLayout maxWidth="lg" spacing="large" background="gradient">
        <Card variant="elevated" padding="large">
        <Card.Header 
          title="✈️ Trip Budget Planner"
          subtitle="Coming Soon"
        />
        <Card.Body>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
            <h2>Under Development</h2>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>
              Smart vacation budget planner is coming soon!
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
                <li>✓ Flight & Transportation</li>
                <li>✓ Accommodation Booking</li>
                <li>✓ Activities & Sightseeing</li>
                <li>✓ Food & Dining Budget</li>
                <li>✓ Per-Day Expense Tracking</li>
                <li>✓ Currency Conversion</li>
                <li>✓ Group Expense Splitting</li>
              </ul>
            </div>
          </div>
        </Card.Body>
        </Card>
      </PageLayout>
    </>
  );
}

export default TripBudget;
