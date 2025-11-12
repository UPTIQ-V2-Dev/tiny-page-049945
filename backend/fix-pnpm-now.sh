#!/bin/bash

echo "🔧 Fixing pnpm ENOENT error..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project root."
    exit 1
fi

echo "📋 Method 1: Installing pnpm via npm..."
npm install -g pnpm@10.14.0 2>/dev/null && echo "✅ pnpm installed via npm" || echo "⚠️ npm install failed"

echo "📋 Method 2: Enabling corepack..."
corepack enable 2>/dev/null && echo "✅ corepack enabled" || echo "⚠️ corepack not available"
corepack prepare pnpm@10.14.0 --activate 2>/dev/null && echo "✅ pnpm prepared via corepack" || echo "⚠️ corepack prepare failed"

echo "📋 Method 3: Direct pnpm installation..."
curl -fsSL https://get.pnpm.io/install.sh | sh 2>/dev/null && echo "✅ pnpm installed via curl" || echo "⚠️ curl install failed"

# Add pnpm to PATH if it was installed in ~/.local/share/pnpm
export PATH="$HOME/.local/share/pnpm:$PATH"

echo "🔍 Verifying pnpm installation..."
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm is available"
    pnpm --version
    
    echo "📦 Installing dependencies..."
    pnpm install
    
    echo "🗄️ Generating Prisma client..."
    pnpm db:generate
    
    echo "🔍 Running typecheck..."
    pnpm typecheck
    
    echo "🎉 All done! You can now use:"
    echo "  pnpm dev - start development server"
    echo "  pnpm db:push - set up database"
    
else
    echo "⚠️ pnpm still not available. Using npm alternatives..."
    
    echo "📦 Installing dependencies with npm..."
    npm install
    
    echo "🗄️ Generating Prisma client with npx..."
    npx prisma generate --schema=./src/prisma/schema.prisma
    
    echo "🔍 Running typecheck with npx..."
    npx tsc --noEmit
    
    echo "💡 pnpm installation failed, but you can use these npm alternatives:"
    echo "  npm run dev:npm - start development server"
    echo "  npm run db:generate:npm - generate Prisma client"
    echo "  npm run typecheck:npm - run TypeScript check"
fi

echo "✨ Setup complete!"