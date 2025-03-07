document.addEventListener("DOMContentLoaded", () => {
    // Navigation functionality: show/hide pages
    const navLinks = document.querySelectorAll("nav a");
    const pages = document.querySelectorAll(".page");
  
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.getAttribute("data-target");
        pages.forEach(page => {
          if (page.id === target) {
            page.classList.add("active");
          } else {
            page.classList.remove("active");
          }
        });
      });
    });
  });
  
  // Booking Modal functions
  function openBookingModal(adventureName) {
    document.getElementById("modalAdventureName").innerText = adventureName;
    document.getElementById("bookingModal").style.display = "block";
  }
  
  function closeBookingModal() {
    document.getElementById("bookingModal").style.display = "none";
    document.getElementById("bookingForm").reset();
    document.getElementById("bookingMessage").innerText = "";
  }
  
  function submitBooking(e) {
    e.preventDefault();
    // Simulate a booking confirmation
    document.getElementById("bookingMessage").innerText = "Booking confirmed! Check your email for details.";
    setTimeout(() => {
      closeBookingModal();
    }, 2000);
  }
  
  // Contact form submission
  function submitContactForm(e) {
    e.preventDefault();
    document.getElementById("contactMessage").innerText = "Thank you for your message! We'll get back to you soon.";
    document.getElementById("contactForm").reset();
    setTimeout(() => {
      document.getElementById("contactMessage").innerText = "";
    }, 3000);
  }
  