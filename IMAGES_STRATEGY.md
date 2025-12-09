# VegaKash.AI Travel Planner - Images Strategy

## Overview
This document outlines the considerations and recommended approach for adding images to the Travel Itinerary display without negatively impacting UI performance.

---

## Current Issues
1. **Performance concern**: Loading multiple high-resolution images can slow down the UI
2. **Database requirement**: Need storage solution for images
3. **Unsure about necessity**: Need to evaluate if images add value vs. complexity trade-off

---

## Recommended Approach: **Lazy Load External URLs (No Database)**

### Best Strategy: Use AI to Generate Image URLs

Instead of storing images in a database, **leverage AI to provide external image URLs** from free services:

#### Option 1: Unsplash API (Recommended)
- **Free tier**: 50 requests/hour per app (sufficient for planning)
- **Quality**: High-resolution, professional travel photos
- **Integration**: Modify backend prompt to request image keywords, call Unsplash API
- **Cost**: Free
- **Loading**: Images load on demand (lazy) with placeholder until ready

```python
# Backend example (Python)
import requests

def get_unsplash_image(keyword, count=1):
    """Get free stock images from Unsplash API"""
    API_KEY = os.getenv("UNSPLASH_API_KEY")
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": keyword,
        "count": count,
        "client_id": API_KEY
    }
    response = requests.get(url, params=params)
    if response.ok:
        photos = response.json().get("results", [])
        return [photo["urls"]["regular"] for photo in photos]
    return []

# Usage in itinerary generation
itinerary_item = {
    "title": "Red Fort Delhi",
    "image_url": get_unsplash_image("Red Fort Delhi")[0]
}
```

#### Option 2: Pixabay API
- Free tier: 100 requests/day
- Good variety of travel images
- Similar integration to Unsplash

---

## Implementation Plan

### Step 1: Backend Modifications
Enhance the itinerary generation prompt to request image keywords:

```
JSON response should include:
{
  "activity": {
    "title": "...",
    "image_url": "https://images.unsplash.com/...",  // AI provides keyword, backend fetches URL
    "image_alt": "Red Fort, Delhi Old Town"  // For accessibility
  }
}
```

### Step 2: Add Lazy Loading to Frontend

```jsx
// Activity card with lazy-loaded image
function ActivityCard({ activity }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="activity-card">
      {activity.image_url && (
        <div className="activity-image-container">
          <img
            src={activity.image_url}
            alt={activity.image_alt || activity.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`activity-image ${imageLoaded ? 'loaded' : 'loading'}`}
          />
          {!imageLoaded && <div className="image-skeleton" />}
        </div>
      )}
      {/* Rest of content */}
    </div>
  );
}
```

### Step 3: Add Skeleton Loading CSS

```css
.activity-image-container {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-image.loaded {
  opacity: 1;
}

.image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Pros & Cons

### External URLs (Recommended)
| Pros | Cons |
|------|------|
| No database needed | Relies on external service (Unsplash rate limits) |
| Free & scalable | Image availability varies by search term |
| High quality images | Network requests add slight latency |
| Easy to update | Need API key management |
| Lazy loading reduces initial load | Images may change/disappear over time |

### Database Storage
| Pros | Cons |
|------|------|
| Full control over images | Significant DB storage cost |
| Guaranteed availability | Slow image loading without CDN |
| Offline capable | Requires image upload infrastructure |
| Consistent branding | Maintenance overhead |
| | Much higher complexity |

---

## Performance Impact Minimization

1. **Lazy Loading**: Images only load when near viewport
2. **Skeleton Screens**: Show placeholders while loading
3. **WebP Format**: Use modern image format (via Unsplash)
4. **Responsive Images**: Serve appropriately-sized images
5. **Caching**: Browser cache + CDN (Unsplash provides this)

### Expected Impact
- **Initial load**: No impact (images lazy-loaded)
- **Scroll performance**: ~2-5ms per image load (negligible)
- **Network**: ~20-50KB per image (gzip'd)
- **Memory**: ~1-2MB for ~20 images (manageable)

---

## Recommended Implementation Timeline

1. **Phase 1** (Week 1): 
   - Sign up for Unsplash API
   - Add `image_keyword` field to itinerary response
   - Backend fetches URL based on keyword

2. **Phase 2** (Week 2):
   - Add image containers to activity cards
   - Implement lazy loading + skeleton screens
   - Test with real itineraries

3. **Phase 3** (Week 3):
   - Optimize image sizing
   - Add fallback for failed loads
   - Performance monitoring

---

## Environment Setup

```bash
# Install Unsplash SDK (optional, use REST API instead)
npm install unsplash-js

# Add to .env
VITE_UNSPLASH_API_KEY=your_key_here
```

Backend `.env`:
```
UNSPLASH_API_KEY=your_key_here
```

---

## Fallback Strategy

If images fail to load:
1. Show activity title with colored icon
2. Log error (don't show to user)
3. Placeholder gradient background
4. Activity is still fully usable

---

## Summary

**Recommended Approach**: Use **Unsplash API + Lazy Loading** because:
- ✅ No database required
- ✅ Free and scalable
- ✅ High-quality images
- ✅ Minimal performance impact
- ✅ Easy to implement
- ✅ Can be added incrementally

This approach allows you to add images **without complexity** while maintaining excellent UI performance.
