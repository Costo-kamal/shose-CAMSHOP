// -----------------Start------------------
//Random background Option
let backgroundOption = true;

// Variable To Control The Interval
let backgroundInterval;

// Select Landing Page Element

let landingPage = document.querySelector(".landing");

//Get Array Of Imgs
let imgsArray = ["landing-1.jpg", "landing-2.jpg", "landing-s-3.jpg"];

// function To Randomize Background Images
function randomizeImgs() {
  if (!backgroundOption) return;

  const landingPage = document.querySelector(".landing");
  if (!landingPage) return;

  backgroundInterval = setInterval(() => {
    let randomNumber = Math.floor(Math.random() * imgsArray.length);
    landingPage.style.backgroundImage =
      'url("images/' + imgsArray[randomNumber] + '")';
  }, 5000);
}

randomizeImgs();
// -----------------End------------------

// -----------------Start----------------
// product-list
const productList = document.querySelector(".product-list");
// products
let isProductDetailPage = document.querySelector(".product-detail");
// carts
let isCartPage = document.querySelector(".cart");

// products data
if (productList) {
  displayProducts();
} else if (isProductDetailPage) {
  displayProductDetail();
} else if (isCartPage) {
  displayCart();
}

function displayProducts() {
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
    
     <div class="img-box">
        <img src="${product.colors[0].mainImage}">
    </div>
    <h3 class="title">${product.title}</h3>
    <span class="price">${product.price}</span>
   `;

    productList.appendChild(productCard);

    const imgBox = productCard.querySelector(".img-box");
    imgBox.addEventListener("click", () => {
      sessionStorage.setItem("productId", JSON.stringify(product));
      window.location.href = "product-detail.html";
    });
  });
}

// Function to display product details

function displayProductDetail() {
  const productData = JSON.parse(sessionStorage.getItem("productId"));

  const title = document.querySelector(".title");
  const price = document.querySelector(".price");
  const description = document.querySelector(".description");
  const mainImageContainer = document.querySelector(".main-img");
  const thumbnailContainer = document.querySelector(".thumbnail-list");
  const colorContainer = document.querySelector(".color-options");
  const sizeContainer = document.querySelector(".size-options");
  const addtoCartBtn = document.querySelector("#add-cart-btn");

  let selectedColor = productData.colors[0];
  let selectedSize = selectedColor.sizes[0];

  function updateProductDetails(colorData) {
    if (!colorData.sizes.includes(selectedSize)) {
      selectedSize = colorData.sizes[0];
    }

    // Update image
    mainImageContainer.innerHTML = `
    <img src="${colorData.mainImage}">`;

    thumbnailContainer.innerHTML = "";
    const allthumbnails = [colorData.mainImage].concat(
      colorData.thumbnails.slice(0, 3)
    );
    allthumbnails.forEach((thumb) => {
      const img = document.createElement("img");
      img.src = thumb;

      thumbnailContainer.appendChild(img);
      // Add click event to change main image
      img.addEventListener("click", () => {
        mainImageContainer.innerHTML = `

        <img src="${thumb}">`;
      });
    });

    // Update colors and sizes
    colorContainer.innerHTML = "";
    productData.colors.forEach((color) => {
      const img = document.createElement("img");
      img.src = color.mainImage;
      if (color.name === colorData.name) img.classList.add("selected");

      colorContainer.appendChild(img);

      img.addEventListener("click", () => {
        selectedColor = color;
        updateProductDetails(color);
      });
    });

    sizeContainer.innerHTML = "";
    colorData.sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.textContent = size;
      if (size === selectedSize) btn.classList.add("selected");

      sizeContainer.appendChild(btn);

      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".size-options button")
          .forEach((el) => el.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSize = size;
      });
    });
  }
  // Set initial product details
  title.textContent = productData.title;
  price.textContent = productData.price;
  description.textContent = productData.description;

  updateProductDetails(selectedColor);

  addtoCartBtn.addEventListener("click", () => {
    addtoCart(productData, selectedColor, selectedSize);
        window.location.href = "cart.html";
  });
}

function addtoCart(product, color, size) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) =>
      item.id === product.id && item.color === color.name && item.size === size
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: color.mainImage,
      color: color.name,
      size: size,
      quantity: 1,
    });
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// -----------------End------------------
// -----------------Start----------------
// cart

function displayCart() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalEl = document.querySelector(".subtotal");
  const grandTotalEl = document.querySelector(".grand-total");

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "$0";
    grandTotalEl.textContent = "$0";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
    
         <div class="product">
             <img src="${item.image}">
                <div class="item-detail">
                    <p>${item.title}</p>
                   <div class="size-color-box">
                      <span class="size">${item.size}</span>
                       <span class="color">${item.color}</span>
                   </div>
                </div>
        </div>
                <span class="price">${item.price}</span>
                <div class="quantity"><input type="number" value="${item.quantity}" min="1" data-index="${index}"></div>
                <span class="total-price">${itemTotal} DH</span>
                <button class="remove"  data-index="${index} " ><i class="fa-solid fa-xmark" ></i></button> `;
    cartItemsContainer.appendChild(cartItem);
  });

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  grandTotalEl.textContent = `$${subtotal.toFixed(2)}`;
  removeCartItem();
  updateCartQuantity();
}

function removeCartItem() {
  document.querySelectorAll(".remove i").forEach((button) => {
    button.addEventListener("click", function () {
      let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

      const index = this.getAttribute("data-index");

      cart.splice(index, 1);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartBadge();
    });
  });
}

function updateCartQuantity() {
  document.querySelectorAll(".quantity input").forEach((input) => {
    input.addEventListener("change", function () {
      let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

      const index = this.getAttribute("data-index");

      cart[index].quantity = parseInt(this.value);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartBadge();
    });
  });
}

// icon cart
function updateCartBadge() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.querySelector(".shop");

  if (badge) {
    if (cartCount > 0) {
      badge.textContent = cartCount;
      badge.style.display = "block";
    } else {
      badge.style.display = "none";
    }
  }
}

updateCartBadge();
console.log(updateCartBadge());
// -----------------End------------------

// start
// document
//   .querySelector("#place-order-btn")
//   .addEventListener("click", sendOrderToWhatsApp);

// function sendOrderToWhatsApp() {
//   const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

//   if (cart.length === 0) {
//     alert("Your cart is empty.");
//     return;
//   }

//   let message = "🛒 *New Order Received!*\n\n";

//   cart.forEach((item, index) => {
//     message += `#${index + 1}\n`;
//     message += `*Product:* ${item.title}\n`;
//     message += `*Price:* ${item.price}\n`;
//     message += `*Color:* ${item.color}\n`;
//     message += `*Size:* ${item.size}\n`;
//     message += `*Quantity:* ${item.quantity}\n\n`;
//   });

//   const subtotal = cart.reduce(
//     (total, item) =>
//       total + parseFloat(item.price.replace("$", "")) * item.quantity,
//     0
//   );
//   message += `💰 *Total:* $${subtotal.toFixed(2)}\n`;

//   const phone = "21256464401"; // <-- your WhatsApp number here
//   const encodedMsg = encodeURIComponent(message);
//   const url = `https://wa.me/${phone}?text=${encodedMsg}`;
//   window.open(url, "_blank");

//   // Optional: Clear cart after sending
//   sessionStorage.removeItem("cart");
//   updateCartBadge();
// }

// end
