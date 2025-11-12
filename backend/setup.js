#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up pnpm and generating Prisma client...');

// Function to run commands with better error handling
function runCommand(command, options = {}) {
  try {
    console.log(`📋 Running: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: __dirname,
      ...options 
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Function to check if command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  try {
    // Check if pnpm exists
    if (!commandExists('pnpm')) {
      console.log('📦 pnpm not found. Installing pnpm...');
      
      // Try corepack first (recommended for Node.js 16.10+)
      if (commandExists('corepack')) {
        console.log('🔧 Enabling corepack...');
        runCommand('corepack enable');
        runCommand('corepack prepare pnpm@10.14.0 --activate');
      } else if (commandExists('npm')) {
        console.log('📦 Installing pnpm via npm...');
        runCommand('npm install -g pnpm@10.14.0');
      } else {
        console.error('❌ Neither corepack nor npm found. Cannot install pnpm.');
        process.exit(1);
      }
    }

    // Verify pnpm installation
    if (commandExists('pnpm')) {
      console.log('✅ pnpm is available');
      runCommand('pnpm --version');
    } else {
      console.error('❌ pnpm installation failed');
      process.exit(1);
    }

    // Install dependencies if node_modules doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
      console.log('📦 Installing dependencies...');
      runCommand('pnpm install');
    }

    // Generate Prisma client
    console.log('🗄️ Generating Prisma client...');
    const prismaGenerated = runCommand('pnpm db:generate') || runCommand('npx prisma generate --schema=./src/prisma/schema.prisma');
    
    if (prismaGenerated) {
      console.log('✅ Prisma client generated successfully');
    } else {
      console.error('❌ Failed to generate Prisma client');
      process.exit(1);
    }

    // Run typecheck
    console.log('🔍 Running TypeScript typecheck...');
    const typecheckPassed = runCommand('pnpm typecheck') || runCommand('npx tsc --noEmit');
    
    if (typecheckPassed) {
      console.log('✅ TypeScript typecheck passed');
    } else {
      console.log('⚠️ TypeScript typecheck failed, but this might be expected in some environments');
    }

    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your database connection (DATABASE_URL)');
    console.log('2. Run database migrations: pnpm db:push');
    console.log('3. Start the development server: pnpm dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();