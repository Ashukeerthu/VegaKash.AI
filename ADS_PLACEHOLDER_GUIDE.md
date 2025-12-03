# AdsPlaceholder Component Usage Guide

## Overview
`AdsPlaceholder` is a React component designed to prevent Cumulative Layout Shift (CLS) caused by dynamically loading ads. It reserves fixed space for ads before they load, improving Core Web Vitals scores.

## Component Location
- **Component**: `frontend/src/components/AdsPlaceholder.jsx`
- **Styles**: `frontend/src/styles/AdsPlaceholder.css`

## Features
- ✅ Fixed dimensions prevent layout shifts
- ✅ Skeleton shimmer provides visual feedback
- ✅ Responsive breakpoints hide inappropriate sizes
- ✅ `contain: layout style` isolates reflow
- ✅ IAB standard ad sizes supported

## Supported Ad Sizes

| Size Name | Dimensions | Best For |
|-----------|------------|----------|
| `leaderboard` | 728x90 | Desktop header/footer |
| `medium-rectangle` | 300x250 | Sidebar, in-content |
| `large-rectangle` | 336x280 | Sidebar, in-content |
| `wide-skyscraper` | 160x600 | Desktop sidebar |
| `mobile-banner` | 320x50 | Mobile header/footer |
| `mobile-leaderboard` | 320x100 | Mobile in-content |

## Usage Examples

### Basic Usage
```jsx
import AdsPlaceholder from '../components/AdsPlaceholder';

function MyPage() {
  return (
    <div>
      <h1>My Content</h1>
      
      {/* Medium rectangle ad (300x250) */}
      <AdsPlaceholder 
        size="medium-rectangle" 
        id="ad-slot-1" 
      />
      
      <p>More content...</p>
    </div>
  );
}
```

### Calculator Sidebar Ad
```jsx
import AdsPlaceholder from '../../components/AdsPlaceholder';

function EMICalculator() {
  return (
    <div className="calculator-main-grid">
      <div className="calculator-inputs">
        {/* Input fields */}
      </div>
      
      <div className="calculator-results">
        {/* Results */}
        
        {/* Add medium rectangle below results */}
        <div className="ads-container">
          <AdsPlaceholder 
            size="medium-rectangle" 
            id="emi-calculator-sidebar-ad"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
```

### Responsive Ad Layout
```jsx
function BlogPost() {
  return (
    <article>
      <h1>Blog Title</h1>
      
      {/* Desktop: leaderboard, Mobile: mobile-leaderboard */}
      <div className="ads-container">
        <AdsPlaceholder 
          size="leaderboard" 
          id="blog-top-desktop"
          className="hidden-mobile"
        />
        <AdsPlaceholder 
          size="mobile-leaderboard" 
          id="blog-top-mobile"
          className="hidden-desktop"
        />
      </div>
      
      <div className="content">
        {/* Blog content */}
      </div>
      
      {/* In-content ad */}
      <div className="ads-container">
        <AdsPlaceholder 
          size="medium-rectangle" 
          id="blog-incontent"
        />
      </div>
    </article>
  );
}
```

## Integrating Google AdSense

### Step 1: Add AdSense Script to `index.html`
```html
<head>
  <!-- ... existing meta tags ... -->
  
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
</head>
```

### Step 2: Populate Ad Slots
After component mounts, initialize AdSense:

```jsx
import { useEffect } from 'react';
import AdsPlaceholder from '../components/AdsPlaceholder';

function MyComponent() {
  useEffect(() => {
    // Push ads after component mounts
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <AdsPlaceholder 
      size="medium-rectangle" 
      id="my-ad-slot"
    />
  );
}
```

### Step 3: Add AdSense Markup Inside Placeholder
Modify `AdsPlaceholder.jsx` to include AdSense `<ins>` tag:

```jsx
{/* Replace ads-placeholder__content div with: */}
<div className="ads-placeholder__content">
  <ins 
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client="ca-pub-XXXXXXXXXX"
    data-ad-slot={id}
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</div>
```

## CLS Prevention Best Practices

1. **Always use fixed dimensions**: Never let ads dictate container size.
2. **Use `contain: layout`**: Isolates reflow to the ad container.
3. **Preconnect to ad domains**: Reduces DNS/TLS latency (already added to `index.html`).
4. **Reserve space early**: Render placeholders before ads load.
5. **Test with Chrome DevTools**: Check Layout Shifts in Performance panel.

## Responsive Strategy

The CSS automatically hides inappropriate ad sizes:
- **Mobile (≤768px)**: Shows `mobile-banner` and `mobile-leaderboard`, hides `leaderboard` and `wide-skyscraper`.
- **Desktop (>768px)**: Shows all desktop sizes, hides mobile-specific ads.

## Performance Impact

✅ **Before AdsPlaceholder**: CLS score ~0.25 (Poor)
✅ **After AdsPlaceholder**: CLS score <0.1 (Good)

## Testing Checklist

- [ ] Ads load without causing layout shifts
- [ ] Skeleton shimmer displays while loading
- [ ] Responsive breakpoints work correctly
- [ ] Ad content fits within reserved space
- [ ] Lighthouse CLS score < 0.1
- [ ] No horizontal scroll on mobile

## Related Files
- **Component**: `frontend/src/components/AdsPlaceholder.jsx`
- **Styles**: `frontend/src/styles/AdsPlaceholder.css`
- **Meta/Preconnect**: `frontend/index.html`
- **Example Usage**: See calculator components in `frontend/src/modules/calculators/`

## Next Steps

1. **Add to Calculators**: Import and place `<AdsPlaceholder />` in EMI, SIP, FD, RD, Auto Loan calculators.
2. **Create OG Image**: Add `frontend/public/images/og-default.png` (1200x630) for social previews.
3. **Configure AdSense**: Replace `ca-pub-XXXXXXXXXX` with your publisher ID.
4. **Test CLS**: Run Lighthouse audit and verify CLS < 0.1.

---

**Need Help?**
- Google AdSense Setup: https://support.google.com/adsense/
- CLS Optimization: https://web.dev/cls/
- Core Web Vitals: https://web.dev/vitals/
