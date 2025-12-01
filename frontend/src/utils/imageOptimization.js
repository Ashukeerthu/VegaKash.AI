/**
 * Image Optimization Utilities
 * Lazy loading, responsive images, and performance optimization
 */

/**
 * Create responsive image srcset for different screen sizes
 * @param {string} imagePath - Base image path
 * @param {number[]} widths - Array of widths to generate
 * @returns {string} srcset string
 */
export function createResponsiveImageSrcSet(imagePath, widths = [320, 640, 960, 1280, 1920]) {
  return widths
    .map(width => `${imagePath}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Get optimized image sizes attribute
 * @param {string} breakpoints - CSS breakpoints
 * @returns {string} sizes string
 */
export function getImageSizes(breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
}) {
  return `(max-width: 768px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
}

/**
 * Lazy load images using Intersection Observer
 * @param {HTMLImageElement} img - Image element to lazy load
 * @param {string} src - Image source
 */
export function lazyLoadImage(img, src) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = src;
          image.classList.add('loaded');
          observer.unobserve(image);
        }
      });
    }, {
      rootMargin: '50px', // Start loading 50px before entering viewport
    });
    
    observer.observe(img);
  } else {
    // Fallback for browsers without Intersection Observer
    img.src = src;
  }
}

/**
 * Preload critical images for faster LCP
 * @param {string[]} imagePaths - Array of image paths to preload
 */
export function preloadCriticalImages(imagePaths) {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}

/**
 * Convert image to WebP format (server-side implementation needed)
 * @param {string} imagePath - Original image path
 * @returns {object} Image sources with WebP fallback
 */
export function getOptimizedImageFormat(imagePath) {
  const extension = imagePath.split('.').pop();
  const basePath = imagePath.replace(`.${extension}`, '');
  
  return {
    webp: `${basePath}.webp`,
    fallback: imagePath,
  };
}

/**
 * Image loading placeholder (for skeleton screens)
 */
export const imagePlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E';
