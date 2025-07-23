const { execSync } = require('child_process');

console.log('🚀 Starting production build...\n');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Set environment variables
  process.env.NODE_ENV = 'production';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  // Run the build
  console.log('\n🔨 Building application...');
  execSync('npx next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}