const noBtn = document.getElementById('noBtn');
const successMessage = document.getElementById('successMessage');
const overlay = document.getElementById('overlay');
const container = document.querySelector('.container');

// Calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Move the No button away from cursor
document.addEventListener('mousemove', (e) => {
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const distance = getDistance(e.clientX, e.clientY, noBtnCenterX, noBtnCenterY);

    // If cursor is within 150px of the button, move it
    if (distance < 150) {
        const angle = Math.atan2(noBtnCenterY - e.clientY, noBtnCenterX - e.clientX);
        const moveDistance = 100;

        let newX = noBtnCenterX + Math.cos(angle) * moveDistance;
        let newY = noBtnCenterY + Math.sin(angle) * moveDistance;

        // Keep button fully within viewport with padding
        const padding = 10;
        const btnWidth = noBtnRect.width;
        const btnHeight = noBtnRect.height;
        
        const centerX = Math.max(padding + btnWidth / 2, Math.min(window.innerWidth - padding - btnWidth / 2, newX));
        const centerY = Math.max(padding + btnHeight / 2, Math.min(window.innerHeight - padding - btnHeight / 2, newY));

        noBtn.style.left = (centerX - btnWidth / 2) + 'px';
        noBtn.style.top = (centerY - btnHeight / 2) + 'px';
    }
});

// Valentine's week days
const days = [
    { name: 'Rose Day', emoji: '🌹', date: new Date(2026, 1, 7), content: '🌹 Every rose symbolizes a thorn... no wait, it symbolizes love! 💕', decoration: '🌹💕🌹' },
    { name: 'Propose Day', emoji: '💍', date: new Date(2026, 1, 8), content: '💍 Will you take this journey with me? 🥺💕', decoration: '💍✨💍' },
    { name: 'Chocolate Day', emoji: '🍫', date: new Date(2026, 1, 9), content: '🍫 Sweet like you, melting in my heart... 🍫💕', decoration: '🍫💕🍫' },
    { name: 'Teddy Day', emoji: '🧸', date: new Date(2026, 1, 10), content: '🧸 Cuddles and bears, the recipe for happiness! 🧸💕', decoration: '🧸💕🧸' },
    { name: 'Promise Day', emoji: '🤝', date: new Date(2026, 1, 11), content: '🤝 I promise to always make you smile! 💕🌟', decoration: '🤝💕🤝' },
    { name: 'Hug Day', emoji: '🤗', date: new Date(2026, 1, 12), content: '🤗 The best feeling is when I wrap my arms around you! 💕', decoration: '🤗💕🤗' },
    { name: 'Kiss Day', emoji: '😘', date: new Date(2026, 1, 13), content: '😘 A kiss is worth a thousand words of love! 💋💕', decoration: '😘💕😘' },
    { name: "Valentine's Day", emoji: '💖', date: new Date(2026, 1, 14), content: '💖 Today I celebrate you, my greatest treasure! 👑💕', decoration: '💖💕💖' }
];

// Get current date
function getCurrentDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Check if a date is enabled
function isDateEnabled(date) {
    const today = getCurrentDate();
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return today.getTime() >= target.getTime();
}

// Create day buttons
function createDayButtons() {
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    
    days.forEach((day, i) => {
        const dayBtn = document.createElement('button');
        // Always enable first day (Rose Day) immediately; others depend on date
        const isEnabled = (i === 0) || isDateEnabled(day.date);
        dayBtn.className = isEnabled ? 'day-btn' : 'day-btn disabled-btn';
        dayBtn.innerHTML = `<span>${day.emoji}</span><span>${day.name.split(' ')[0]}</span>`;
        
        if (isEnabled) {
            dayBtn.onclick = () => showDayByIndex(i);
        } else {
            dayBtn.style.cursor = 'not-allowed';
            dayBtn.onclick = (e) => { e.preventDefault(); showDisabledPopup(); };
            dayBtn.title = 'Coming soon...';
        }
        
        daysGrid.appendChild(dayBtn);
    });
}

// Handle day selection
function selectDay(day) {
    const idx = days.findIndex(d => d.name === day.name && d.emoji === day.emoji);
    if (idx >= 0) showDayByIndex(idx);
}

// current index used by navigation
let currentDayIndex = 0;

// Show day modal by index with prev/next navigation
function showDayByIndex(index) {
    currentDayIndex = ((index % days.length) + days.length) % days.length;
    const day = days[currentDayIndex];

    // hide containers and show overlay
    document.getElementById('daysContainer').style.display = 'none';
    successMessage.style.display = 'none';
    overlay.style.display = 'block';

    // remove existing if present
    const existing = document.querySelector('.day-selected');
    if (existing) existing.remove();

    const daySelected = document.createElement('div');
    daySelected.className = 'day-selected';
    // Build modal content; if Rose Day, use poem and hint
    const isRose = currentDayIndex === 0;
    const roseImageHtml = isRose ? '<div class="day-image-wrap"><img src="assets/rose-day.jpg" alt="Rose Day" class="day-image"></div>' : '';
    const mainContent = isRose
        ? `
            <p class="poem">Like a rose spreads fragrance without trying,<br>
            you spread warmth without knowing.<br><br>
            And my world smells sweeter<br>
            just because you’re in it.</p>
        `
        : `<p>${day.content}</p>`;

    daySelected.innerHTML = `
        <button class="day-back-btn" onclick="closeDayModal()">←</button>
        <div class="content-scroll">
            <h1>${day.emoji} ${day.name}</h1>
            ${roseImageHtml}
            ${mainContent}
            <p style="font-size: 2.5rem; margin-top: 24px;">${day.decoration}</p>
            <p style="margin-top: 24px; color: #ff1493; font-weight: 600; font-size: 1.1rem;">Thank you for being part of my love story! 💕</p>
            ${isRose ? '<p class="rose-hint">Check your bag… the fragrance isn\'t just on this page</p>' : ''}
        </div>
    `;
    document.body.appendChild(daySelected);
    daySelected.style.display = 'block';

    // create heart animations
    for (let i = 0; i < 12; i++) {
        setTimeout(() => createHeartAnimation(), i * 80);
    }
}

function closeDayModal() {
    const existing = document.querySelector('.day-selected');
    if (existing) existing.remove();
    overlay.style.display = 'none';
    document.getElementById('daysContainer').style.display = 'block';
}

// Show a friendly popup when user clicks a disabled day
function showDisabledPopup() {
    // avoid creating multiple popups
    if (document.querySelector('.disabled-popup')) return;

    const popup = document.createElement('div');
    popup.className = 'disabled-popup';
    popup.textContent = 'arey arey itni kya jaldi h baby, vo din toh aane do';
    document.body.appendChild(popup);

    // auto-remove after 2.5s
    setTimeout(() => {
        popup.classList.add('disabled-popup--hide');
        setTimeout(() => popup.remove(), 300);
    }, 2500);
}

// Go back to days selection
function goBack() {
    document.getElementById('daysContainer').style.display = 'none';
    successMessage.style.display = 'block';
    overlay.style.display = 'block';
}

// Handle Yes button click with staggered hearts
function handleYes() {
    overlay.style.display = 'block';
    successMessage.style.display = 'block';
    
    // Create floating hearts with varied timing
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeartAnimation();
        }, i * 70 + Math.random() * 50);
    }
    
    // Show days selection after 2.5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
        document.getElementById('daysContainer').style.display = 'block';
    }, 2500);
}

// Create heart animation with varied duration and horizontal drift
function createHeartAnimation() {
    const heart = document.createElement('div');
    heart.classList.add('hearts-animation');
    heart.textContent = '❤️';
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200;
    const duration = 3.5 + Math.random() * 0.5;
    heart.style.left = startX + 'px';
    heart.style.top = '0px';
    heart.style.setProperty('--drift', drift + 'px');
    heart.style.setProperty('--duration', duration + 's');
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000);
}

// Initialize button position randomly but safely
window.addEventListener('load', () => {
    const randomX = Math.random() * (window.innerWidth - 200) + 100;
    const randomY = Math.random() * (window.innerHeight - 200) + 100;
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Create day buttons
    createDayButtons();
});
