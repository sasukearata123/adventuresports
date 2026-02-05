const adventureCatalog = [
  {
    id: 1,
    title: "River Rafting in Rishikesh",
    sport: "White Water Rafting",
    location: "Rishikesh, Uttarakhand",
    cityQuery: "Rishikesh",
    wikiTitle: "Rishikesh",
    latitude: 30.0869,
    longitude: 78.2676,
    season: "Sep - Jun"
  },
  {
    id: 2,
    title: "Paragliding in Bir Billing",
    sport: "Paragliding",
    location: "Bir Billing, Himachal Pradesh",
    cityQuery: "Bir",
    wikiTitle: "Bir, Himachal Pradesh",
    latitude: 32.0498,
    longitude: 76.7084,
    season: "Oct - Jun"
  },
  {
    id: 3,
    title: "Scuba Diving in Andaman",
    sport: "Scuba Diving",
    location: "Havelock Island, Andaman",
    cityQuery: "Havelock Island",
    wikiTitle: "Swaraj Dweep",
    latitude: 11.969,
    longitude: 92.9876,
    season: "Nov - Apr"
  },
  {
    id: 4,
    title: "Skiing in Gulmarg",
    sport: "Skiing",
    location: "Gulmarg, Jammu & Kashmir",
    cityQuery: "Gulmarg",
    wikiTitle: "Gulmarg",
    latitude: 34.0484,
    longitude: 74.3805,
    season: "Dec - Mar"
  },
  {
    id: 5,
    title: "Trekking in Ladakh",
    sport: "High Altitude Trek",
    location: "Leh, Ladakh",
    cityQuery: "Leh",
    wikiTitle: "Leh",
    latitude: 34.1526,
    longitude: 77.5771,
    season: "May - Sep"
  },
  {
    id: 6,
    title: "Surfing in Kovalam",
    sport: "Surfing",
    location: "Kovalam, Kerala",
    cityQuery: "Kovalam",
    wikiTitle: "Kovalam",
    latitude: 8.3988,
    longitude: 76.9781,
    season: "Oct - Mar"
  }
];

const state = {
  selectedAdventure: null,
  bookings: []
};

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("nav a[data-target]");
const experienceGrid = document.getElementById("experienceGrid");
const experienceStatus = document.getElementById("experienceStatus");
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");
const bookingMessage = document.getElementById("bookingMessage");
const selectedAdventureElement = document.getElementById("selectedAdventure");
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");
const exploreBtn = document.getElementById("exploreBtn");

function switchPage(targetPageId) {
  pages.forEach((page) => page.classList.toggle("active", page.id === targetPageId));
  navLinks.forEach((link) => link.classList.toggle("active-link", link.dataset.target === targetPageId));
}

function loadBookings() {
  state.bookings = JSON.parse(localStorage.getItem("adventureBookings") || "[]");
  renderBookings();
}

function saveBookings() {
  localStorage.setItem("adventureBookings", JSON.stringify(state.bookings));
}

function renderBookings() {
  if (state.bookings.length === 0) {
    bookingList.innerHTML = "<p>No ticket requests yet. Book an adventure to see it here.</p>";
    return;
  }

  bookingList.innerHTML = state.bookings
    .slice()
    .reverse()
    .map(
      (booking) => `
      <article class="booking-item">
        <h3>${booking.adventure}</h3>
        <p class="meta">${booking.name} • ${booking.email}</p>
        <p class="meta">Date: ${booking.date} • Participants: ${booking.participants}</p>
        <p class="meta">Booking ID: ${booking.id}</p>
      </article>`
    )
    .join("");
}

async function fetchWikiSummary(title) {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (!response.ok) {
    throw new Error("Wikipedia data unavailable");
  }

  const data = await response.json();
  return data.extract ? data.extract.slice(0, 180) + "…" : "Destination overview currently unavailable.";
}

async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather service unavailable");
  }

  const data = await response.json();
  return data.current;
}

function weatherCodeToLabel(code) {
  const codeMap = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    61: "Rain",
    71: "Snow",
    95: "Thunderstorm"
  };

  return codeMap[code] || "Variable";
}

function openBookingModal(adventureTitle) {
  state.selectedAdventure = adventureTitle;
  selectedAdventureElement.textContent = `Selected Adventure: ${adventureTitle}`;
  bookingModal.style.display = "block";
  bookingModal.setAttribute("aria-hidden", "false");
}

function closeBookingModal() {
  bookingModal.style.display = "none";
  bookingModal.setAttribute("aria-hidden", "true");
  bookingForm.reset();
  bookingMessage.textContent = "";
}

function initializeNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      switchPage(link.dataset.target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  exploreBtn.addEventListener("click", () => switchPage("experiences"));

  document.querySelector('a.secondary-link[data-target="contact"]').addEventListener("click", (event) => {
    event.preventDefault();
    switchPage("contact");
  });
}

async function renderExperiences() {
  const cards = await Promise.all(
    adventureCatalog.map(async (item) => {
      try {
        const [summary, weather] = await Promise.all([
          fetchWikiSummary(item.wikiTitle),
          fetchWeather(item.latitude, item.longitude)
        ]);

        return `
          <article class="card">
            <h3>${item.title}</h3>
            <p class="meta">${item.location}</p>
            <p>${summary}</p>
            <div class="tags">
              <span class="tag">${item.sport}</span>
              <span class="tag">Season: ${item.season}</span>
            </div>
            <p class="meta">Current: ${weather.temperature_2m}°C, ${weatherCodeToLabel(weather.weather_code)} • Wind ${weather.wind_speed_10m} km/h</p>
            <button type="button" data-book="${item.title}">Book Ticket</button>
          </article>
        `;
      } catch (error) {
        return `
          <article class="card">
            <h3>${item.title}</h3>
            <p class="meta">${item.location}</p>
            <p>We couldn't load live details right now. Please try again shortly.</p>
            <div class="tags">
              <span class="tag">${item.sport}</span>
              <span class="tag">Season: ${item.season}</span>
            </div>
            <button type="button" data-book="${item.title}">Book Ticket</button>
          </article>
        `;
      }
    })
  );

  experienceGrid.innerHTML = cards.join("");
  experienceStatus.textContent = `Loaded ${adventureCatalog.length} curated adventure experiences across India.`;

  document.querySelectorAll("button[data-book]").forEach((button) => {
    button.addEventListener("click", () => openBookingModal(button.dataset.book));
  });
}

function initializeForms() {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = {
      id: `ADV-${Date.now().toString().slice(-6)}`,
      adventure: state.selectedAdventure,
      name: document.getElementById("bookingName").value.trim(),
      email: document.getElementById("bookingEmail").value.trim(),
      date: document.getElementById("bookingDate").value,
      participants: document.getElementById("participants").value
    };

    state.bookings.push(booking);
    saveBookings();
    renderBookings();

    bookingMessage.textContent = `Ticket request submitted! Your reference is ${booking.id}.`;
    setTimeout(() => {
      closeBookingModal();
      switchPage("bookings");
    }, 1400);
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactMessage.textContent = "Thank you. Our advisor team will contact you within 24 hours.";
    contactForm.reset();
  });
}

document.getElementById("closeBooking").addEventListener("click", closeBookingModal);
window.addEventListener("click", (event) => {
  if (event.target === bookingModal) {
    closeBookingModal();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  initializeNavigation();
  initializeForms();
  loadBookings();
  await renderExperiences();
});
