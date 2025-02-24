// canvas.js
export let canvas;
export let ctx;
export let offsetX = 0;
export let offsetY = 0;
export let scale = 1; // Масштаб по умолчанию
export let user = {
  id: '12345',
  name: 'Гость',
  x: 0,
  y: 0,
  outlineColor: '#4CAF50',
  registered: false
};

export function setCanvasDimensions(canvasElement) {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  // Центрируем вселенную
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

/**
 * Отрисовка персонажа с учётом масштаба и панорамирования.
 */
export function drawUser() {
  const radius = 50;
  const screenX = user.x * scale + offsetX;
  const screenY = user.y * scale + offsetY;
  ctx.strokeStyle = user.outlineColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  // Шрифт тоже масштабируем
  ctx.font = `${16 * scale}px Arial`;
  ctx.fillText(user.name, screenX - radius * scale, screenY + radius * scale + 20 * scale);
}

/**
 * Регистрируем обработчики событий для мыши и touch-событий.
 * Добавлена поддержка перетаскивания и масштабирования (pinch-to-zoom).
 */
export function registerPanHandlers(canvasElement, callback) {
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };

  // Обработчики для мыши
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
      callback();
    }
  });
  
  canvasElement.addEventListener('mouseup', () => { isDragging = false; });
  canvasElement.addEventListener('mouseleave', () => { isDragging = false; });

  // Обработчики для touch-событий
  let pinchStartDistance = 0;
  let initialScale = scale;
  
  canvasElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // Один палец – обычное перетаскивание
      isDragging = true;
      dragStart.x = e.touches[0].clientX;
      dragStart.y = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      // Два пальца – начинаем масштабирование
      isDragging = false;
      pinchStartDistance = getDistance(e.touches[0], e.touches[1]);
      initialScale = scale;
    }
  }, { passive: false });
  
  canvasElement.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Предотвращаем нежелательный скролл страницы
    if (e.touches.length === 1 && isDragging) {
      let dx = e.touches[0].clientX - dragStart.x;
      let dy = e.touches[0].clientY - dragStart.y;
      offsetX += dx;
      offsetY += dy;
      dragStart.x = e.touches[0].clientX;
      dragStart.y = e.touches[0].clientY;
      callback();
    } else if (e.touches.length === 2) {
      let currentDistance = getDistance(e.touches[0], e.touches[1]);
      scale = initialScale * (currentDistance / pinchStartDistance);
      callback();
    }
  }, { passive: false });
  
  canvasElement.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
      isDragging = false;
    }
  });
}

/**
 * Вспомогательная функция для расчёта расстояния между двумя touch-событиями.
 */
function getDistance(touch1, touch2) {
  let dx = touch2.clientX - touch1.clientX;
  let dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
