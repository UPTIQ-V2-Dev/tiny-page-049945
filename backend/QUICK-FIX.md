# 🚨 QUICK FIX: pnpm ENOENT Error

## ⚡ Immediate Solutions (Choose One)

### Option 1: Automatic Fix Script
```bash
chmod +x fix-pnpm-now.sh
./fix-pnpm-now.sh
```

### Option 2: Node.js Setup Scripts
```bash
# Complete setup with pnpm installation
node install-pnpm.mjs

# OR just generate Prisma client
node generate-prisma.mjs
```

### Option 3: Manual pnpm Installation
```bash
# Using npm (most reliable)
npm install -g pnpm@10.14.0

# Using corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@10.14.0 --activate

# Using curl (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh
```

### Option 4: Use npm Instead (No pnpm needed)
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate:npm

# Run typecheck
npm run typecheck:npm

# Start development
npm run dev:npm
```

## 🔧 Quick Commands After Fix

Once pnpm is working:
```bash
pnpm install          # Install dependencies
pnpm db:generate      # Generate Prisma client
pnpm typecheck        # Check TypeScript
pnpm dev              # Start development
```

If using npm alternatives:
```bash
npm install
npm run db:generate:npm
npm run typecheck:npm  
npm run dev:npm
```

## ✅ Verification

Test if pnpm works:
```bash
pnpm --version        # Should show version 10.14.0
pnpm db:generate      # Should generate Prisma client
```

## 🎯 Root Cause

The error "spawn pnpm ENOENT" means:
- pnpm command not found in system PATH
- pnpm not installed globally
- corepack not enabled (for Node.js 16.10+)

## 💡 Why This Happens

Modern Node.js projects use pnpm as the default package manager, but it's not installed by default. The project expects pnpm to be available globally.

## 🚀 Success Indicators

You'll know it's fixed when:
- ✅ `pnpm --version` works
- ✅ `pnpm install` completes without errors
- ✅ `pnpm db:generate` creates Prisma client
- ✅ No more "spawn pnpm ENOENT" errors

## 🆘 Still Having Issues?

Try these debugging steps:

1. **Check Node.js version**: `node --version` (need 16.10+ for corepack)
2. **Restart terminal** after installing pnpm
3. **Check PATH**: `echo $PATH | grep pnpm`
4. **Use npm alternatives** from package.json
5. **Try Docker**: `docker-compose -f docker-compose.only-db-dev.yml up`

## 📞 Emergency Fallback

If nothing works, skip pnpm entirely:
```bash
# Use only npm
npm install
npm run db:generate:npm
npm run dev:npm
```

The project will work fine with npm! 🎉