# 🔧 PNPM Setup Guide

This guide will help you resolve the "spawn pnpm ENOENT" error and set up pnpm properly.

## 🚨 Problem
```
pnpm failed: spawn pnpm ENOENT
Error: spawn pnpm ENOENT
```

This error occurs because pnpm is not installed or not found in your system PATH.

## 🛠️ Solutions

### Option 1: Automatic Setup (Recommended)
Run the setup script that will handle everything for you:

```bash
node setup.js
```

### Option 2: Manual pnpm Installation

#### Method A: Using Corepack (Node.js 16.10+)
```bash
# Enable corepack (comes with modern Node.js)
corepack enable

# Prepare pnpm
corepack prepare pnpm@10.14.0 --activate
```

#### Method B: Using npm
```bash
# Install pnpm globally via npm
npm install -g pnpm@10.14.0
```

#### Method C: Direct Installation
```bash
# Install via curl (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Add to PATH (if needed)
export PATH="$HOME/.local/share/pnpm:$PATH"
```

#### Method D: Using Homebrew (macOS)
```bash
brew install pnpm
```

#### Method E: Using Chocolatey (Windows)
```bash
choco install pnpm
```

### Option 3: Use npm Instead
If you can't install pnpm, use the npm alternatives provided in package.json:

```bash
# Instead of: pnpm db:generate
npm run db:generate:npm

# Instead of: pnpm typecheck  
npm run typecheck:npm

# Instead of: pnpm dev
npm run dev:npm

# Instead of: pnpm install
npm install
```

## 🔍 Verification

After installing pnpm, verify it works:

```bash
# Check pnpm version
pnpm --version

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run typecheck
pnpm typecheck
```

## 📋 Quick Start Commands

Once pnpm is installed, run these commands in order:

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
pnpm db:generate

# 3. Set up database (make sure DATABASE_URL is configured)
pnpm db:push

# 4. Seed database (optional)
pnpm db:seed

# 5. Start development server
pnpm dev
```

## 🐛 Troubleshooting

### Issue: "pnpm command not found" after installation
**Solution**: Restart your terminal or reload your shell configuration:
```bash
# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

### Issue: Permission errors
**Solution**: Use sudo (Linux/macOS) or run as administrator (Windows):
```bash
sudo npm install -g pnpm@10.14.0
```

### Issue: Corporate proxy/firewall
**Solution**: Configure npm/pnpm proxy settings:
```bash
npm config set proxy http://your-proxy:port
npm config set https-proxy http://your-proxy:port
```

### Issue: Node.js version compatibility
**Solution**: Ensure you're using Node.js 16.10+ for corepack support:
```bash
node --version
```

## 🚀 Alternative: Docker Development

If pnpm installation continues to fail, use Docker:

```bash
# Build and run with Docker
docker-compose -f docker-compose.only-db-dev.yml up -d
```

## 📞 Need Help?

1. Check the [pnpm installation guide](https://pnpm.io/installation)
2. Verify Node.js version: `node --version` (requires 16.10+ for corepack)
3. Try the npm alternatives in package.json
4. Use the automated setup script: `node setup.js`

## 🎯 What's Next?

After fixing pnpm:
1. ✅ Dependencies installed
2. ✅ Prisma client generated  
3. ✅ Database connected
4. ✅ Ready to start development

Run `pnpm dev` to start the development server! 🚀