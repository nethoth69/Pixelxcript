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

// ---------- Contact form (Formspree) ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  const defaultStatusText = formStatus.textContent;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = contactForm["name"].value.trim();
    const email = contactForm["email"].value.trim();
    if (name === "" || email === "") {
      formStatus.textContent = "Please fill in your name and email.";
      formStatus.style.color = "#B3261E";
      return;
    }

    const submitBtn = contactForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    formStatus.textContent = "Sending…";
    formStatus.style.color = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = "Thanks — your message has been sent. We'll get back to you soon.";
        formStatus.style.color = "#1E7B34";
      } else {
        formStatus.textContent = "Something went wrong sending your message. Please try WhatsApp or email instead.";
        formStatus.style.color = "#B3261E";
      }
    } catch (err) {
      formStatus.textContent = "Network error — please check your connection or try WhatsApp/email instead.";
      formStatus.style.color = "#B3261E";
    } finally {
      submitBtn.disabled = false;
    }
  });
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
