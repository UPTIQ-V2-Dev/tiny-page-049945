#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗄️ Generating Prisma client...');

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

async function main() {
  try {
    // Ensure the generated directory exists
    const generatedDir = join(__dirname, 'src', 'generated', 'prisma');
    if (!existsSync(generatedDir)) {
      console.log('📁 Creating generated directory...');
      mkdirSync(generatedDir, { recursive: true });
    }

    // Try multiple methods to generate Prisma client
    const methods = [
      'npx prisma generate --schema=./src/prisma/schema.prisma',
      'npx prisma generate',
      'node_modules/.bin/prisma generate --schema=./src/prisma/schema.prisma',
      'node_modules/.bin/prisma generate'
    ];

    let success = false;
    for (const method of methods) {
      console.log(`\n🔄 Trying: ${method}`);
      if (runCommand(method)) {
        success = true;
        break;
      }
    }

    if (success) {
      console.log('\n✅ Prisma client generated successfully!');
      
      // Verify the generated client exists
      const clientPath = join(__dirname, 'src', 'generated', 'prisma', 'index.js');
      if (existsSync(clientPath)) {
        console.log('✅ Generated client files found');
      } else {
        console.log('📁 Client files may be in node_modules/@prisma/client');
      }

      // Try to run a basic typecheck
      console.log('\n🔍 Running basic typecheck...');
      runCommand('npx tsc --noEmit --skipLibCheck');

    } else {
      throw new Error('All Prisma generation methods failed');
    }

    console.log('\n🎉 Prisma setup completed!');
    console.log('\n📋 You can now:');
    console.log('1. Set up your DATABASE_URL');
    console.log('2. Run: npm run dev:npm');
    console.log('3. Or install pnpm: npm install -g pnpm@10.14.0');

  } catch (error) {
    console.error('\n❌ Prisma generation failed:', error.message);
    console.log('\n🔧 Manual alternatives:');
    console.log('1. npm install');
    console.log('2. npx prisma generate --schema=./src/prisma/schema.prisma');
    console.log('3. Or try: npm run db:generate:npm');
    process.exit(1);
  }
}

main();