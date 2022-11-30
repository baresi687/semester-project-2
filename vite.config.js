import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, './src/index.html'),
        listingDetails: resolve(__dirname, './src/listing-details.html'),
        searchListings: resolve(__dirname, './src/search-listings.html'),
        signUp: resolve(__dirname, './src/sign-up.html'),
        signIn: resolve(__dirname, './src/sign-in.html')
      }
    },
    outDir: '../dist'
  }
})
