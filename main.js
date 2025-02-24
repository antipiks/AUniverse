// main.js
import {
  initCanvas,
  setCanvasDimensions,
  registerPanHandlers,
  updateUserOutlineColor,
  offsetX,
  offsetY,
  drawUser,
  user
} from './canvas.js';
import { initFriends, drawFriends, processFriendClick, toggleFriendship } from './friends.js';
import { initLists, drawLists, createNewList, processListClick, processListContextMenu } from './lists.js';

document.addEventListener('DOMContentLoaded', () => {
  // Telegram Web Apps: сигнализируем, что приложение готово
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
  }
  
  const canvas = document.getElementById('universeCanvas');
  const ctx = canvas.getContext('2d');
  
  // Устанавливаем размеры Canvas
  setCanvasDimensions(canvas);
  initCanvas(canvas, ctx);
  
  // На старте показываем оверлей регистрации
  const regOverlay = document.getElementById('registrationOverlay');
  regOverlay.style.display = 'flex'; // или block – зависит от CSS
  
  // Элементы регистрации: выбор цвета и кнопка подтверждения
  const regColorPicker = document.getElementById('regColorPicker');
  const regConfirmBtn = document.getElementById('regConfirmBtn');
  
  regConfirmBtn.addEventListener('click', () => {
    // Сохраняем выбранный цвет для окантовки
    updateUserOutlineColor(regColorPicker.value);
    // Отмечаем пользователя как зарегистрированного
    user.registered = true;
    // Скрываем оверлей регистрации
    regOverlay.style.display = 'none';
    // Инициализируем модули (например, друзей и списки) – предполагается, что в friends.js и lists.js
    initFriends(canvas);
    initLists();
    // Запускаем основное отображение вселенной
    fullRedraw();
    registerEventHandlers();
  });
  
  // Функция полной перерисовки (отображаются только данные зарегистрированных пользователей)
  function fullRedraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (user.registered) {
      drawFriends();
      drawLists();
      drawUser();
    }
  }
  
  // Регистрируем обработчики событий (запускаются после регистрации)
  function registerEventHandlers() {
    window.addEventListener('resize', () => {
      setCanvasDimensions(canvas);
      fullRedraw();
    });
  
    registerPanHandlers(canvas, fullRedraw);
  
    // Если нужен дополнительный color picker в основной панели (например, для изменения окантовки позже)
    const mainColorPicker = document.getElementById('colorPicker');
    if (mainColorPicker) {
      mainColorPicker.addEventListener('input', (e) => {
        updateUserOutlineColor(e.target.value);
        fullRedraw();
      });
    }
  
    const createListBtn = document.getElementById('createList');
    if (createListBtn) {
      createListBtn.addEventListener('click', () => {
        createNewList();
        fullRedraw();
      });
    }
  
    // Обработка кликов по canvas: сначала проверяем нажатия по друзьям, затем по спискам
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Проверка клика по пользователю-другу
      const friend = processFriendClick(clickX, clickY);
      if (friend) {
        toggleFriendship(friend);
        fullRedraw();
        return;
      }
      
      // Если клик не на друге – проверяем попадание по круговым спискам
      const worldX = clickX - offsetX;
      const worldY = clickY - offsetY;
      if (processListClick(worldX, worldY)) {
        fullRedraw();
        return;
      }
    });
  
    // Правый клик для удаления списка
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
  }
});
