#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 Installing pnpm and setting up the project...');

function runCommand(command, options = {}) {
  try {
    console.log(`📋 Running: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options 
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

function commandExists(command) {
  try {
    execSync(`which ${command} 2>/dev/null || where ${command} 2>nul`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  try {
    console.log('🔍 Checking Node.js version...');
    const nodeVersion = process.version;
    console.log(`Node.js version: ${nodeVersion}`);

    // Check if pnpm already exists
    if (commandExists('pnpm')) {
      console.log('✅ pnpm is already installed');
      runCommand('pnpm --version');
    } else {
      console.log('📦 pnpm not found. Installing...');

      // Method 1: Try corepack (Node.js 16.10+)
      const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
      if (majorVersion >= 16) {
        console.log('🔧 Attempting to enable corepack...');
        if (runCommand('corepack enable')) {
          console.log('✅ Corepack enabled');
          if (runCommand('corepack prepare pnpm@10.14.0 --activate')) {
            console.log('✅ pnpm prepared via corepack');
          }
        }
      }

      // Method 2: Try npm global install as fallback
      if (!commandExists('pnpm')) {
        console.log('📦 Trying to install pnpm via npm...');
        if (commandExists('npm')) {
          runCommand('npm install -g pnpm@10.14.0');
        }
      }

      // Verify installation
      if (commandExists('pnpm')) {
        console.log('✅ pnpm successfully installed');
        runCommand('pnpm --version');
      } else {
        console.log('⚠️ pnpm installation failed, will use npx fallback');
      }
    }

    // Install dependencies
    console.log('📦 Installing dependencies...');
    if (commandExists('pnpm')) {
      runCommand('pnpm install');
    } else {
      console.log('Using npm as fallback...');
      runCommand('npm install');
    }

    // Generate Prisma client
    console.log('🗄️ Generating Prisma client...');
    let prismaGenerated = false;
    
    if (commandExists('pnpm')) {
      prismaGenerated = runCommand('pnpm db:generate');
    }
    
    if (!prismaGenerated) {
      console.log('📋 Using npx to generate Prisma client...');
      prismaGenerated = runCommand('npx prisma generate --schema=./src/prisma/schema.prisma');
    }

    if (prismaGenerated) {
      console.log('✅ Prisma client generated successfully');
    } else {
      console.error('❌ Failed to generate Prisma client');
      throw new Error('Prisma client generation failed');
    }

    // Run typecheck
    console.log('🔍 Running TypeScript typecheck...');
    let typecheckPassed = false;
    
    if (commandExists('pnpm')) {
      typecheckPassed = runCommand('pnpm typecheck');
    }
    
    if (!typecheckPassed) {
      console.log('📋 Using npx for typecheck...');
      typecheckPassed = runCommand('npx tsc --noEmit');
    }

    if (typecheckPassed) {
      console.log('✅ TypeScript typecheck passed');
    } else {
      console.log('⚠️ TypeScript typecheck had issues, but continuing...');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your DATABASE_URL environment variable');
    console.log('2. Run database setup: pnpm db:push (or npm run db:push:npm)');
    console.log('3. Start development: pnpm dev (or npm run dev:npm)');

    if (commandExists('pnpm')) {
      console.log('\n✅ pnpm is ready to use!');
    } else {
      console.log('\n💡 pnpm installation failed, but npm alternatives are available:');
      console.log('   - Use "npm run db:generate:npm" instead of "pnpm db:generate"');
      console.log('   - Use "npm run dev:npm" instead of "pnpm dev"');
      console.log('   - Use "npm run typecheck:npm" instead of "pnpm typecheck"');
    }

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Manual steps to recover:');
    console.log('1. Install pnpm manually: npm install -g pnpm@10.14.0');
    console.log('2. Or use npm alternatives: npm run db:generate:npm');
    process.exit(1);
  }
}

main();