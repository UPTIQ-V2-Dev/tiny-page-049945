#!/bin/bash

# Fix pnpm installation issue
echo "Installing pnpm globally..."

# Try to install pnpm using npm
npm install -g pnpm@10.14.0 || {
    echo "Failed to install pnpm globally, trying corepack..."
    # Enable corepack (comes with Node.js 16.10+)
    corepack enable || {
        echo "Corepack not available, installing pnpm via curl..."
        # Install pnpm using the official installer
        curl -fsSL https://get.pnpm.io/install.sh | sh -
        # Add to PATH
        export PATH="$HOME/.local/share/pnpm:$PATH"
    }
}

# Verify installation
echo "Verifying pnpm installation..."
pnpm --version

# Generate Prisma client
echo "Generating Prisma client..."
cd /app/generated-apps/c3126582-fff5-4b4e-b6b1-1491e1ad371f/b8f46720-1f4b-4f36-be64-f81925c27eab/backend
pnpm db:generate || npx prisma generate --schema=./src/prisma/schema.prisma

# Run typecheck
echo "Running TypeScript typecheck..."
pnpm typecheck || npx tsc --noEmit

echo "Setup complete!"