const UserSelectorBtn = document.querySelector('#User-selector');
const AdminSelectorBtn = document.querySelector('#Admin-selector');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const chatInput = document.querySelector('.chat-input');
const clearChatBtn = document.querySelector('.clear-chat-button');

const messages = JSON.parse(localStorage.getItem('messages')) || [];
let messageSender = 'User';

// 🔵 Har bir xabar uchun HTML yasaydi (index bilan)
const createChatMessageElement = (message, index) => `
  <div class="message ${message.sender === 'User' ? 'blue-bg' : 'gray-bg'}" data-index="${index}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
    <button class="delete-message">🗑</button>
  </div>
`;

// 🔄 Xabarlarni qayta chiqarish
function renderMessages() {
  chatMessages.innerHTML = '';
  messages.forEach((message, index) => {
    chatMessages.innerHTML += createChatMessageElement(message, index);
  });
  addDeleteEvents();
}

// 🧽 Delete tugmalariga event berish
function addDeleteEvents() {
  document.querySelectorAll('.delete-message').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const msgDiv = e.target.closest('.message');
      const index = parseInt(msgDiv.getAttribute('data-index'));
      
      // Admin yoki Userni farqlash
      const currentUser = localStorage.getItem('isAdmin') === 'true' ? 'Admin' : 'User';

      // Foydalanuvchi faqat o'z xabarini o'chirishi mumkin yoki admin barcha xabarlarni o'chirishi mumkin
      if (messages[index].sender === currentUser || currentUser === 'Admin') {
        messages.splice(index, 1); // Xabarni o‘chirish
        localStorage.setItem('messages', JSON.stringify(messages)); // Local storage-ga saqlash
        renderMessages(); // Yangilangan xabarlarni render qilish
      } else {
        alert("❌ Siz faqat o'zingizning xabarlaringizni o'chira olasiz!"); // Foydalanuvchi ruxsatsiz o‘chirishga urinmoqda
      }
    });
  });
}

// Sahifa yuklanganda xabarlarni ko‘rsatish
window.onload = () => {
  renderMessages();
};

// Foydalanuvchi turini yangilash (User yoki Admin)
const updateMessageSender = (name) => {
  messageSender = name;
  chatHeader.innerText = `Chat`;

  if (name === 'User') {
    UserSelectorBtn.classList.add('active-person');
    AdminSelectorBtn.classList.remove('active-person');
  }

  if (name === 'Admin') {
    AdminSelectorBtn.classList.add('active-person');
    UserSelectorBtn.classList.remove('active-person');
    
    // Admin bo‘lsa boshqa sahifaga o'tamiz
    localStorage.setItem('isAdmin', 'true');
  }

  chatInput.focus();
};

// User va Admin ni tanlash
UserSelectorBtn.onclick = () => updateMessageSender('User');
AdminSelectorBtn.onclick = () => updateMessageSender('Admin');

// Xabar yuborish
const sendMessage = (e) => {
  e.preventDefault();

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
  };

  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));
  renderMessages();
  chatInputForm.reset();
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

chatInputForm.addEventListener('submit', sendMessage);

// Chatni tozalash
clearChatBtn.addEventListener('click', () => {
  localStorage.clear();
  messages.length = 0;
  chatMessages.innerHTML = '';
});
