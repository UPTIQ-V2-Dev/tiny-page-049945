#!/bin/bash

echo "🔧 Fixing pnpm ENOENT error..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm@latest
    
    # Verify installation
    if command -v pnpm &> /dev/null; then
        echo "✅ pnpm installed successfully"
    else
        echo "❌ pnpm installation failed, falling back to npm"
        
        # Remove pnpm-lock.yaml and use npm
        if [ -f "pnpm-lock.yaml" ]; then
            rm pnpm-lock.yaml
            echo "🗑️  Removed pnpm-lock.yaml"
        fi
        
        echo "📦 Installing dependencies with npm..."
        npm install
        
        echo "✅ Dependencies installed with npm"
        echo "💡 You can now use npm run build, npm run dev, etc."
        exit 0
    fi
fi

echo "📦 Installing dependencies with pnpm..."
pnpm install

echo "✅ Dependencies installed successfully!"
echo "💡 You can now run: pnpm run build, pnpm run dev, etc."