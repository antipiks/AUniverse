// main.js
import {
  initCanvas,
  setCanvasDimensions,
  registerPanHandlers,
  updateUserOutlineColor,
  offsetX,
  offsetY,
  drawUser
} from './canvas.js';
import { initFriends, drawFriends, processFriendClick, toggleFriendship } from './friends.js';
import { initLists, drawLists, createNewList, processListClick, processListContextMenu } from './lists.js';

document.addEventListener('DOMContentLoaded', () => {
  // Интеграция с Telegram Web Apps: сигнализируем, что приложение готово
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    // Дополнительно можно установить тему или использовать другие методы Telegram API
  }

  const canvas = document.getElementById('universeCanvas');
  const ctx = canvas.getContext('2d');
  
  // Устанавливаем размеры Canvas
  setCanvasDimensions(canvas);
  initCanvas(canvas, ctx);
  
  // Инициализируем модули друзей и списков
  initFriends(canvas);
  initLists();
  
  // Функция полного перерисовывания всего пространства
  function fullRedraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFriends();
    drawLists();
    drawUser();
  }
  
  // Начальная отрисовка
  fullRedraw();
  
  // Обработка изменения размеров окна
  window.addEventListener('resize', () => {
    setCanvasDimensions(canvas);
    fullRedraw();
  });
  
  // Обработка панорамирования (перетаскивание)
  registerPanHandlers(canvas, fullRedraw);
  
  // Изменение цвета окантовки персонажа через color picker
  const colorPicker = document.getElementById('colorPicker');
  colorPicker.addEventListener('input', (e) => {
    updateUserOutlineColor(e.target.value);
    fullRedraw();
  });
  
  // Обработка создания нового списка
  const createListBtn = document.getElementById('createList');
  createListBtn.addEventListener('click', () => {
    createNewList();
    fullRedraw();
  });
  
  // Обработка клика по canvas (проверка нажатия на друга или список)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Проверка клика по другому пользователю (персонажу)
    const friend = processFriendClick(clickX, clickY);
    if (friend) {
      toggleFriendship(friend);
      fullRedraw();
      return;
    }
    
    // Если не кликнули по другу – проверяем клики по спискам
    const worldX = clickX - offsetX;
    const worldY = clickY - offsetY;
    if (processListClick(worldX, worldY)) {
      fullRedraw();
      return;
    }
  });
  
  // Обработка правого клика для удаления списка
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = clickX - offsetX;
    const worldY = clickY - offsetY;
    if (processListContextMenu(worldX, worldY)) {
      fullRedraw();
    }
  });
});
