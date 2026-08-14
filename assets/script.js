// Responsive Navbar
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}
// Smooth Scroll
document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
}
// Form Validation
function validateForm() {
  const name = document.forms["contactForm"]["name"].value;
  const email = document.forms["contactForm"]["email"].value;
  if (name === "" || email === "") {
    alert("Name and Email must be filled out");
    return false;
  }
}

// Carousel
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Auto-play every 5 seconds
setInterval(nextSlide, 5000);

// Initialize
showSlide(currentSlide);


// Scroll animations
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
