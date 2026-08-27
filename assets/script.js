// ---------- Responsive nav ----------
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

// ---------- Smooth scroll for in-page anchors ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// ---------- Contact form validation ----------
function validateForm() {
  const form = document.forms["contactForm"];
  if (!form) return true;
  const name = form["name"].value.trim();
  const email = form["email"].value.trim();
  if (name === "" || email === "") {
    alert("Please fill in your name and email.");
    return false;
  }
  return true;
}

// ---------- Carousel (used on index.html and contact.html) ----------
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
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

if (slides.length) {
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  showSlide(currentSlide);
  setInterval(nextSlide, 5000);
}

// ---------- Scroll-triggered fade-ins ----------
const faders = document.querySelectorAll(".fade-in");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  faders.forEach(fader => fader.classList.add("visible"));
} else {
  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
  );
  faders.forEach(fader => appearOnScroll.observe(fader));
}
