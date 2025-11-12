#!/bin/bash

echo "🔧 Converting project to use npm instead of pnpm..."

# Remove pnpm lock file
if [ -f "pnpm-lock.yaml" ]; then
    rm pnpm-lock.yaml
    echo "🗑️  Removed pnpm-lock.yaml"
fi

# Install dependencies with npm
echo "📦 Installing dependencies with npm..."
npm install

# Update package.json scripts to use npm
echo "📝 Updating package.json scripts..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add npm equivalents
pkg.scripts['npm:build'] = 'npm run build';
pkg.scripts['npm:dev'] = 'npm run dev';
pkg.scripts['npm:eslint'] = 'npm run eslint';
pkg.scripts['npm:prettier'] = 'npm run prettier';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added npm script alternatives');
"

echo "✅ Project converted to use npm!"
echo ""
echo "💡 You can now use:"
echo "   npm run build    # Build the project"
echo "   npm run dev      # Start development server"
echo "   npm run eslint   # Run linting"
echo "   npm run prettier # Format code"