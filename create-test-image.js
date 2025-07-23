const { createCanvas } = require('canvas');
const fs = require('fs');

function createTestImage() {
  // Create a 512x512 canvas
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#3B82F6'); // Blue
  gradient.addColorStop(1, '#1E40AF'); // Darker blue
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  // Draw fitness-themed elements
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('FITNESS', 256, 200);
  ctx.fillText('FORCE', 256, 260);
  
  // Draw dumbbell icon
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  
  // Dumbbell bar
  ctx.beginPath();
  ctx.moveTo(150, 350);
  ctx.lineTo(362, 350);
  ctx.stroke();
  
  // Left weight
  ctx.beginPath();
  ctx.rect(130, 330, 40, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  
  // Right weight  
  ctx.beginPath();
  ctx.rect(342, 330, 40, 40);
  ctx.fill();
  
  // Lightning bolt
  ctx.fillStyle = '#FDE047'; // Yellow
  ctx.beginPath();
  ctx.moveTo(256, 380);
  ctx.lineTo(240, 420);
  ctx.lineTo(248, 420);
  ctx.lineTo(240, 460);
  ctx.lineTo(272, 420);
  ctx.lineTo(264, 420);
  ctx.lineTo(272, 380);
  ctx.closePath();
  ctx.fill();
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('test.png', buffer);
  
  console.log('✅ Test image created as test.png');
  console.log('📝 Note: This is a placeholder. Imagen 3 requires quota increase.');
  console.log('🔗 Request quota at: https://console.cloud.google.com/iam-admin/quotas');
}

createTestImage();