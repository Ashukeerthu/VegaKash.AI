import React from 'react';
import { Card } from '../../core/ui';
import { PageLayout } from '../../core/layout';
import { useSEO } from '../../core/seo';

/**
 * Wedding Budget Planner - Coming Soon
 * 
 * @component
 * @description Comprehensive wedding budget calculator
 * Features: Venue, catering, photography, guest management
 */
function WeddingBudget() {
  useSEO({
    title: 'Wedding Budget Planner - Coming Soon | VegaKash.AI',
    description: 'Plan your perfect wedding with our comprehensive budget calculator',
    keywords: 'wedding budget, wedding planner, wedding cost calculator',
    canonical: '/budgets/wedding'
  });

  return (
    <PageLayout maxWidth="lg" spacing="large" background="gradient">
      <Card variant="elevated" padding="large">
        <Card.Header 
          title="💒 Wedding Budget Planner"
          subtitle="Coming Soon"
        />
        <Card.Body>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
            <h2>Under Development</h2>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>
              Comprehensive wedding budget planning tool is coming soon!
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
                <li>✓ Venue & Decoration Budget</li>
                <li>✓ Catering & Menu Planning</li>
                <li>✓ Photography & Videography</li>
                <li>✓ Guest Management</li>
                <li>✓ Vendor Comparison</li>
                <li>✓ Payment Tracking</li>
                <li>✓ Timeline Planning</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default WeddingBudget;
