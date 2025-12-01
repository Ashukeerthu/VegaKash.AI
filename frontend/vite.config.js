import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression for production builds
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10KB
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression (better than gzip, supported by modern browsers)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for smaller bundles
    minify: 'terser', // Better minification than esbuild
    target: 'es2015', // Support modern browsers
    
    // Chunk splitting strategy for optimal caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - rarely change, cache longer
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'ui-vendor': ['axios', 'react-helmet-async'],
        },
        // Optimized file naming for cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Performance optimizations
    chunkSizeWarningLimit: 1000, // Warn if chunks > 1MB
    cssCodeSplit: true, // Split CSS per component
    assetsInlineLimit: 4096, // Inline assets < 4KB
  },
  
  // Enable dependency pre-bundling for faster dev server
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'chart.js'],
  },
})
