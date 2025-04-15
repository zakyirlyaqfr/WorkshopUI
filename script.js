// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const header = document.querySelector("header")
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const mobileNav = document.querySelector(".mobile-nav")
    const navLinks = document.querySelectorAll(".nav-link")
  
    // Scroll animations
    const animateElements = document.querySelectorAll(".animate-on-scroll")
  
    // Counter animation
    const counters = document.querySelectorAll(".counter")
  
    // Slider functionality
    const slides = document.querySelectorAll(".slide")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".prev-slide")
    const nextBtn = document.querySelector(".next-slide")
    let currentSlide = 0
  
    // Form submission
    const contactForm = document.getElementById("contact-form")
  
    // Header scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
  
      // Check for elements to animate
      animateOnScroll()
    })
  
    // Mobile menu toggle
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      mobileNav.classList.toggle("active")
      document.body.classList.toggle("no-scroll")
    })
  
    // Close mobile menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active")
        mobileNav.classList.remove("active")
        document.body.classList.remove("no-scroll")
      })
    })
  
    // Smooth scrolling for navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href")
  
        if (targetId.startsWith("#") && targetId !== "#") {
          e.preventDefault()
  
          const targetElement = document.querySelector(targetId)
          const headerHeight = header.offsetHeight
  
          if (targetElement) {
            const targetPosition = targetElement.offsetTop - headerHeight
  
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            })
          }
        }
      })
    })
  
    // Animate elements on scroll
    function animateOnScroll() {
      animateElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementPosition < windowHeight - 100) {
          element.classList.add("show")
        }
      })
    }
  
    // Initialize animations on page load
    animateOnScroll()
  
    // Counter animation
    function animateCounter(counter) {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const duration = 2000 // 2 seconds
      const step = target / (duration / 16) // 60fps
      let current = 0
  
      const timer = setInterval(() => {
        current += step
        counter.textContent = Math.round(current)
  
        if (current >= target) {
          counter.textContent = target
          clearInterval(timer)
        }
      }, 16)
    }
  
    // Start counter animation when in view
    const observerOptions = {
      threshold: 0.5,
    }
  
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          animateCounter(counter)
          counterObserver.unobserve(counter)
        }
      })
    }, observerOptions)
  
    counters.forEach((counter) => {
      counterObserver.observe(counter)
    })
  
    // Slider functionality
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })
  
      // Deactivate all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })
  
      // Show the current slide and activate the corresponding dot
      slides[index].classList.add("active")
      dots[index].classList.add("active")
  
      // Update current slide index
      currentSlide = index
    }
  
    // Next slide
    function nextSlide() {
      const newIndex = (currentSlide + 1) % slides.length
      showSlide(newIndex)
    }
  
    // Previous slide
    function prevSlide() {
      const newIndex = (currentSlide - 1 + slides.length) % slides.length
      showSlide(newIndex)
    }
  
    // Event listeners for slider controls
    nextBtn.addEventListener("click", nextSlide)
    prevBtn.addEventListener("click", prevSlide)
  
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index)
      })
    })
  
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000)
  
    // Form submission
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const model = document.getElementById("model").value
      const message = document.getElementById("message").value
  
      // Simple form validation
      if (!name || !email || !phone || !model) {
        alert("Please fill in all required fields.")
        return
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.")
        return
      }
  
      // Phone validation
      const phoneRegex = /^\d{10,15}$/
      if (!phoneRegex.test(phone.replace(/[^0-9]/g, ""))) {
        alert("Please enter a valid phone number.")
        return
      }
  
      // Simulate form submission
      alert(
        `Thank you, ${name}! Your test drive for the Porsche ${model} has been scheduled. We will contact you shortly at ${email} or ${phone}.`,
      )
  
      // Reset form
      contactForm.reset()
    })
  })
  