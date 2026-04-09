const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
const monthYear = document.getElementById("month-year")
const dates = document.getElementById("dates")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")

const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); 
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('start-date').value = `${yyyy}-${mm}-${dd}`;


const currentTheme = localStorage.getItem('workdate');
let current = new Date()
 let startDate = new Date(currentTheme) // Початкова дата першого денного дня

function getShift(date) {
  const diff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) % 8;
  const pattern = ['day', 'day', 'off', 'off', 'night', 'night', 'off', 'off'];
  return pattern[diff];
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

function renderCalendar(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  monthYear.textContent = monthNames[month] + " " + year
  dates.innerHTML = ""
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  const startDay = (firstDay.getDay() === 0 ? 7 : firstDay.getDay())
  const totalDays = lastDay.getDate()
  const today = new Date()
  let dayCount = 1
  let nextMonthDay = 1
  let totalCells = startDay - 1 + totalDays
  let rows = Math.ceil(totalCells / 7)
  let dayIndex = 0
  for (let week = 0; week < rows; week++) {
    let weekStartDate = new Date(year, month, 1 - (startDay - 1) + week * 7)
    const weekNum = getWeekNumber(weekStartDate)
    for (let i = 1; i <= 7; i++) {
      dayIndex++
      let cell = ""
      let classes = ""
      let shiftClass = ""
      let currentDate = null
      if (dayIndex < startDay) {
        let prevDate = prevLastDay.getDate() - (startDay - 1 - dayIndex)
        classes = "other-month"
        cell = prevDate
        currentDate = new Date(year, month - 1, prevDate)
      } else if (dayCount <= totalDays) {
        classes = "current-month"
        currentDate = new Date(year, month, dayCount)
        const shift = getShift(currentDate)
        if (shift === 'day') shiftClass = 'shift-day'
        else if (shift === 'night') shiftClass = 'shift-night'
        else if (shift === 'off') shiftClass = 'shift-off'
        if (dayCount === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          cell = `<span class="today">${dayCount}</span>`
        } else {
          cell = dayCount
        }
        dayCount++
      } else {
        classes = "other-month"
        cell = nextMonthDay++
        currentDate = new Date(year, month + 1, cell)
      }
      dates.innerHTML += `<div class="${classes} ${shiftClass}">${cell}</div>`
    }
  }
}

prevBtn.onclick = () => {
  current.setMonth(current.getMonth() - 1)
  renderCalendar(current)
};
nextBtn.onclick = () => {
  current.setMonth(current.getMonth() + 1)
  renderCalendar(current)
};
document.getElementById('set-start').onclick = () => {
  const dateValue = document.getElementById('start-date').value;
  startDate = new Date(dateValue);
  renderCalendar(current);
  localStorage.setItem('workdate', dateValue);
};

renderCalendar(current)

// JavaScript for the modal
const modal = document.getElementById('modal');
const closeBtn = document.getElementsByClassName('close')[0];

// Function to open modal
function openModal() {
  modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
  modal.style.display = 'none';
}

// Close when clicking the close button
closeBtn.onclick = closeModal;

// Close when clicking outside the modal
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

// Example: Open modal on button click (add a button in HTML)
document.getElementById('openModalBtn').onclick = openModal;


