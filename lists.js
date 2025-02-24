// lists.js
import { ctx, offsetX, offsetY, user } from './canvas.js';

const MAX_LISTS = 3;
let lists = [];

export function initLists() {
  lists = [];
}

export function drawLists() {
  lists.forEach(drawList);
}

function drawList(list) {
  const screenX = list.x + offsetX;
  const screenY = list.y + offsetY;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(screenX, screenY, list.width, list.height);
  ctx.fillStyle = '#fff';
  ctx.font = '14px Arial';
  ctx.fillText(list.label, screenX + 10, screenY + 25);
}

export function createNewList() {
  if (lists.length >= MAX_LISTS) {
    alert("Достигнуто максимальное количество списков (" + MAX_LISTS + ").");
    return;
  }
  let newList = {
    id: Date.now(),
    x: user.x + 100, // располагается справа от персонажа
    y: user.y - lists.length * 60, // смещение для каждого нового списка
    width: 120,
    height: 50,
    label: "Список " + (lists.length + 1),
    visibility: "public", // Возможные состояния: public, private, friends
    items: [] // Здесь будут храниться записи (например, желания)
  };
  lists.push(newList);
}

export function processListClick(worldX, worldY) {
  // Проверяем, попал ли клик (в мировых координатах) в область списка
  for (let list of lists) {
    if (worldX >= list.x && worldX <= list.x + list.width &&
        worldY >= list.y && worldY <= list.y + list.height) {
      // Открываем подменю редактирования (пока просто alert)
      alert("Редактирование " + list.label + "\n(здесь можно изменить название и просмотреть содержимое)");
      return true;
    }
  }
  return false;
}

export function processListContextMenu(worldX, worldY) {
  // При правом клике проверяем, попал ли клик на список и запрашиваем удаление
  for (let i = 0; i < lists.length; i++) {
    let list = lists[i];
    if (worldX >= list.x && worldX <= list.x + list.width &&
        worldY >= list.y && worldY <= list.y + list.height) {
      if (confirm("Удалить список " + list.label + "?")) {
        lists.splice(i, 1);
      }
      return true;
    }
  }
  return false;
}
