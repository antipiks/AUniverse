// canvas.js
export let canvas;
export let ctx;
export let offsetX = 0;
export let offsetY = 0;
export let user = {
  id: '12345',
  name: 'Гость',
  x: 0,
  y: 0,
  outlineColor: '#4CAF50'
};

export function setCanvasDimensions(canvasElement) {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  offsetX = canvasElement.width / 2;
  offsetY = canvasElement.height / 2;
}

export function initCanvas(canvasElement, context) {
  canvas = canvasElement;
  ctx = context;
}

export function updateUserOutlineColor(color) {
  user.outlineColor = color;
}

export function drawUser() {
  const radius = 50;
  const screenX = user.x + offsetX;
  const screenY = user.y + offsetY;
  ctx.strokeStyle = user.outlineColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText(user.name, screenX - radius, screenY + radius + 20);
}

export function redraw() {
  // Функция оставлена для совместимости; основная отрисовка происходит в fullRedraw() в main.js
}

export function registerPanHandlers(canvasElement, callback) {
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  canvasElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
  });
  canvasElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let dx = e.clientX - dragStart.x;
      let dy = e.clientY - dragStart.y;
      offsetX += dx;
      offsetY += dy;
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
      if (callback) callback();
    }
  });
  canvasElement.addEventListener('mouseup', () => { isDragging = false; });
  canvasElement.addEventListener('mouseleave', () => { isDragging = false; });
}
