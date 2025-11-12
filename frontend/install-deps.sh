#!/bin/bash

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm@latest
fi

# Install project dependencies
echo "Installing project dependencies..."
pnpm install

echo "Dependencies installed successfully!"