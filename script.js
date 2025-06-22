// JavaScript untuk interaktivitas website DriveZone

// DOM Elements
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navMenu = document.querySelector(".nav-menu")
const searchForm = document.querySelector(".search-form")
const filterBtns = document.querySelectorAll(".filter-btn")
const carCards = document.querySelectorAll(".car-card")

// Mobile Menu Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })
}

// Search Functionality
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchTerm = e.target.querySelector("input").value
    filterCars(searchTerm)
  })
}

// Filter Functionality
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter

    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    // Filter cars
    filterCars(filter)
  })
})

// Filter Cars Function
function filterCars(filter) {
  carCards.forEach((card) => {
    const category = card.dataset.category
    const title = card.querySelector("h3").textContent.toLowerCase()

    if (filter === "all" || category === filter || title.includes(filter.toLowerCase())) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem("cart")) || []

function addToCart(carId, carName, carPrice, carImage) {
  const existingItem = cart.find((item) => item.id === carId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: carId,
      name: carName,
      price: carPrice,
      image: carImage,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartUI()
  showNotification("Mobil berhasil ditambahkan ke keranjang!")
}

function removeFromCart(carId) {
  cart = cart.filter((item) => item.id !== carId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartUI()
  showNotification("Mobil berhasil dihapus dari keranjang!")
}

function updateCartUI() {
  const cartCount = document.querySelector(".cart-count")
  const cartItems = document.querySelector(".cart-items")
  const cartTotal = document.querySelector(".cart-total")

  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (cartItems) {
    cartItems.innerHTML = ""
    cart.forEach((item) => {
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="remove-btn">×</button>
            `
      cartItems.appendChild(cartItem)
    })
  }

  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotal.textContent = `Rp ${total.toLocaleString()}`
  }
}

function updateQuantity(carId, change) {
  const item = cart.find((item) => item.id === carId)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(carId)
    } else {
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartUI()
    }
  }
}

// Wishlist Functionality
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

function toggleWishlist(carId, carName, carPrice, carImage) {
  const existingIndex = wishlist.findIndex((item) => item.id === carId)

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1)
    showNotification("Mobil dihapus dari wishlist!")
  } else {
    wishlist.push({
      id: carId,
      name: carName,
      price: carPrice,
      image: carImage,
    })
    showNotification("Mobil ditambahkan ke wishlist!")
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  updateWishlistUI()
}

function updateWishlistUI() {
  const wishlistCount = document.querySelector(".wishlist-count")
  const wishlistItems = document.querySelector(".wishlist-items")

  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length
  }

  if (wishlistItems) {
    wishlistItems.innerHTML = ""
    wishlist.forEach((item) => {
      const wishlistItem = document.createElement("div")
      wishlistItem.className = "wishlist-item"
      wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString()}</p>
                </div>
                <div class="item-actions">
                    <button onclick="addToCart('${item.id}', '${item.name}', ${item.price}, '${item.image}')" class="btn btn-primary">Tambah ke Keranjang</button>
                    <button onclick="toggleWishlist('${item.id}')" class="btn btn-secondary">Hapus</button>
                </div>
            `
      wishlistItems.appendChild(wishlistItem)
    })
  }
}

// Notification System
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("error")
      isValid = false
    } else {
      input.classList.remove("error")
    }
  })

  return isValid
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
  updateWishlistUI()

  // Add event listeners to car cards
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const card = e.target.closest(".car-card")
      const carId = card.dataset.id
      const carName = card.querySelector("h3").textContent
      const carPrice = Number.parseInt(card.querySelector(".price").textContent.replace(/\D/g, ""))
      const carImage = card.querySelector("img").src

      addToCart(carId, carName, carPrice, carImage)
    })
  })

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const card = e.target.closest(".car-card")
      const carId = card.dataset.id
      const carName = card.querySelector("h3").textContent
      const carPrice = Number.parseInt(card.querySelector(".price").textContent.replace(/\D/g, ""))
      const carImage = card.querySelector("img").src

      toggleWishlist(carId, carName, carPrice, carImage)
    })
  })
})
