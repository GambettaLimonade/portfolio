# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```
"# portfolio" 


dev local package.json :

"scripts": {
        "build": "cross-env NODE_OPTIONS=--openssl-legacy-provider webpack --config ./bundler/webpack.prod.js",
        "dev": "cross-env NODE_OPTIONS=--openssl-legacy-provider webpack serve --config ./bundler/webpack.dev.js",
        "deploy": "vercel --prod"
    }

pour vercel il faut enlever le cross-env :

"scripts": {
        "build": "NODE_OPTIONS=--openssl-legacy-provider webpack --config ./bundler/webpack.prod.js",
        "dev": "NODE_OPTIONS=--openssl-legacy-provider webpack serve --config ./bundler/webpack.dev.js",
        "deploy": "vercel --prod"
    }

