const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');

// 绘制圆形背景
ctx.beginPath();
ctx.arc(16, 16, 16, 0, Math.PI * 2);
ctx.fillStyle = '#1989fa';
ctx.fill();

// 导出为 base64
const faviconUrl = canvas.toDataURL();

// 创建 link 标签
const link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = faviconUrl;

// 添加到 head
document.head.appendChild(link); 