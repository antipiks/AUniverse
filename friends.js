// friends.js
import { ctx, offsetX, offsetY, user } from './canvas.js';

let others = [
  { id: 'u2', name: 'Друг 1', x: 200, y: -100, outlineColor: '#FF0000', isFriend: false },
  { id: 'u3', name: 'Друг 2', x: -300, y: 150, outlineColor: '#0000FF', isFriend: false }
];

export function initFriends(canvasElement) {
  // Здесь можно добавить дополнительную инициализацию, если потребуется
}

export function drawFriends() {
  others.forEach(other => {
    drawOther(other);
    if (other.isFriend) {
      drawFriendConnection(other);
    }
  });
}

function drawOther(other) {
  const radius = 50;
  const screenX = other.x + offsetX;
  const screenY = other.y + offsetY;
  ctx.strokeStyle = other.outlineColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText(other.name, screenX - radius, screenY + radius + 20);
}

function drawFriendConnection(other) {
  const userScreenX = user.x + offsetX;
  const userScreenY = user.y + offsetY;
  const otherScreenX = other.x + offsetX;
  const otherScreenY = other.y + offsetY;
  ctx.strokeStyle = '#00FFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(userScreenX, userScreenY);
  ctx.lineTo(otherScreenX, otherScreenY);
  ctx.stroke();
}

export function processFriendClick(clickX, clickY) {
  // Проверяем, попал ли клик в радиус другого пользователя
  for (let other of others) {
    const radius = 50;
    const otherScreenX = other.x + offsetX;
    const otherScreenY = other.y + offsetY;
    let dx = clickX - otherScreenX;
    let dy = clickY - otherScreenY;
    if (Math.sqrt(dx * dx + dy * dy) <= radius) {
      return other;
    }
  }
  return null;
}

export function toggleFriendship(other) {
  if (!other.isFriend) {
    if (confirm("Отправить запрос дружбы к " + other.name + "?")) {
      // Симуляция подтверждения дружбы (в реальном проекте – запрос и подтверждение обеими сторонами)
      other.isFriend = true;
      alert("Вы теперь друзья с " + other.name + "!");
    }
  } else {
    alert("Вы уже друзья с " + other.name + ".");
  }
}
