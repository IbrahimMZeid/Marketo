let cart_indicator = document.getElementById("cart-count-indicator");
let slideIndex = 0;
const loader = document.querySelector(".loader");
window.onload = () => {
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = 0;
      setTimeout(() => {
        loader.classList.add("d-none");
      }, 1000);
    }, 200);
  }
  if (document.cookie.search("login") == -1) {
    location.href = "login.html";
  } else  {
    if (localStorage.getItem("carts")) {
      if(cart_indicator)
      cart_indicator.style.display = "inline-block";
    }
    if (location.href.search("ourproducts.html") != -1) {
      filterProductsCategory();
      getAllProducts();
    } else if (location.href.search("index.html") != -1) {
      setInterval(() => {
        nextSlide();
      }, 3000);
      homeProduct(10);
    } else if (location.href.search("product.html") != -1) displayProduct();
    else if (location.href.search("checkout.html") != -1) checkout();
    else if (location.href.search("carts.html") != -1) displayCarts();
  }
};
function logout() {
  let date = new Date();
  date.setDate(date.getDate() - 30);
  localStorage.removeItem("carts");
  document.cookie = `login=false; expires=${date};`;
  document.cookie = `email=false; expires=${date};`;
  document.cookie = `name=false; expires=${date};`;
  location.href = "index.html";
}
/* ================= read products data from JSON file ==================== */
async function readProductsJSON() {
  let response = await fetch("products.json");
  const jsonData = await response.json();
  let products = jsonData.products;
  // let categories = jsonData.categories;
  return products;
}
/* ================= read Categories data from JSON file ==================== */
async function readCategoriesJSON() {
  const response = await fetch("products.json");
  const jsonData = await response.json();
  let categories = jsonData.categories;
  return categories;
}
// ============= generate sample of products ================
async function homeProduct(count) {
  let products = await readProductsJSON();
  count = count || products.length;
  let product_container = document.querySelector(".products-container");
  for (let index = 0; index < count; index++) {
    let product = products[index];
    let card = generateProductCard(product);
    card.classList.add("card", "m-2", "p-0", "col-11", "col-md-5", "col-lg-3");
    product_container.append(card);
  }
}
/** =============== take product object, generate and return card object  =============== */
function generateProductCard(product) {
  card = document.createElement("div");
  let card_content = document.createElement("div");
  let product_name = document.createElement("h5");
  let product_price = document.createElement("p");
  let product_image = document.createElement("img");
  let product_category = document.createElement("p");
  let show_btn = document.createElement("a");
  let show_icon = document.createElement("i");
  let add_to_cart = document.createElement("a");
  let add_to_cart_icon = document.createElement("i");
  product_image.style.width = "100%";
  product_image.style.height = "100%";
  card_content.classList.add("card-body");
  product_name.innerText = product.name;
  product_name.classList.add("card-title");
  product_price.innerText = `${product.price} $`;
  product_price.classList.add("text-success");
  product_price.classList.add("card-text");
  product_image.src = product.image;
  show_icon.classList.add("bi", "bi-eye-fill");
  show_btn.appendChild(show_icon);
  show_btn.classList.add("btn", "text-primary", "fs-4");
  show_btn.addEventListener("click", () => {
    location.href = "product.html?id=" + product.id;
  });
  add_to_cart_icon.classList.add("bi", "bi-cart-plus-fill");
  add_to_cart.appendChild(add_to_cart_icon);
  add_to_cart.classList.add("btn", "text-danger-emphasis", "fs-4");
  add_to_cart.addEventListener("click", () => {
    addToCart(product, 1);
    cart_indicator.style.display = "inline-block";
  });
  card_content.append(
    product_name,
    product_price,
    product_category,
    show_btn,
    add_to_cart
  );
  card.append(product_image, card_content);
  return card;
}
/** =================== entry point for ourproducts page
 * ** take Categories
 * ** get input values name,max price and min price
 * ** call getAllProducts to filter and display products
 *  =================== */
function filterProductsPrice(categoriesFilter) {
  const maxPrice = document.querySelector(".max-price-input").value;
  const minPrice = document.querySelector(".min-price-input").value;
  const produstName = document.querySelector(".name-input").value;
  if (!categoriesFilter) categoriesFilter = getCheckedCategories();
  getAllProducts(produstName, minPrice, maxPrice, categoriesFilter);
}
/** ==================== get selected categories to display products ===================== */
function getCheckedCategories() {
  const categoriesCheckedBox = document.querySelectorAll(
    ".filter-checkbox:checked"
  );
  const categoriesChecked = Array.from(categoriesCheckedBox).map(
    (checkbox) => checkbox.value
  );
  return categoriesChecked;
}
/** ==================== generate checks for categories filters and add event listener  ===================== */
async function filterProductsCategory() {
  const categoryFilters = document.querySelector(".category-filters-container");
  let categories = await readCategoriesJSON();
  categories.forEach((category) => {
    const categoryCheckbox = document.createElement("input");

    categoryCheckbox.type = "checkbox";
    categoryCheckbox.classList.add("btn-check", "filter-checkbox");
    categoryCheckbox.setAttribute("id", category);
    categoryCheckbox.setAttribute("value", category);
    categoryCheckbox.setAttribute("checked", "checked");

    categoryCheckbox.addEventListener("change", () => {
      const categoriesFilter = getCheckedCategories();
      filterProductsPrice(categoriesFilter);
    });

    const categoryLabel = document.createElement("label");
    categoryLabel.classList.add("btn", "btn-outline-danger");
    categoryLabel.innerText = category;
    categoryLabel.setAttribute("for", category);

    categoryFilters.append(categoryCheckbox, categoryLabel);
  });
}
/** ==================== display all products that match the filter */
async function getAllProducts(
  productName,
  minPrice,
  maxprice,
  categoriesFilter
) {
  let pos = 0;
  let step = 0;

  let products = await readProductsJSON();
  let categories = await readCategoriesJSON();

  // filter section
  if (maxprice)
    products = products.filter((product) => product.price <= maxprice);
  if (minPrice)
    products = products.filter((product) => product.price >= minPrice);
  if (categoriesFilter)
    products = products.filter((product) =>
      categoriesFilter.includes(product.category)
    );
  if (productName)
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(productName.toLowerCase()) ||
        product.category.toLowerCase().includes(productName.toLowerCase()) ||
        product.description.toLowerCase().includes(productName.toLowerCase())
    );
  // ===================== intialize variable that carries category and list of products
  let product_container = document.querySelector(".product-container");
  product_container.innerHTML = "";
  let productCategory = {};
  categories.forEach((category) => {
    productCategory[category] = [];
  });
  products.forEach((product) => {
    productCategory[product.category].push(product);
  });
  // =================== create cards
  for (let category in productCategory) {
    if (!productCategory[category].length) continue;
    let category_container = document.createElement("div");
    category_container.classList.add(
      "row",
      "category-container",
      "flex-nowrap",
      "w-100"
    );
    let category_title = document.createElement("h3");
    category_title.innerText = category;
    category_title.classList.add("my-4");
    product_container.append(category_title);
    product_container.append(category_container);
    let card;
    productCategory[category].forEach((product) => {
      card = generateProductCard(product);
      card.classList.add(
        "card",
        "m-2",
        "p-0",
        "col-12",
        "col-sm-6",
        "col-md-4",
        "col-lg-3"
      );
      category_container.append(card);
    });
    /* =============== Slider Controller =============== */
    let controller = document.createElement("div");
    let next = document.createElement("i");
    next.classList.add(
      "btn",
      "bi-arrow-right-circle-fill",
      "fs-3",
      "text-secondary"
    );
    next.addEventListener("click", () => {
      if (
        step + 1 <
        ((card.offsetWidth + 20) / product_container.offsetWidth) *
          productCategory[category].length
      ) {
        step++;
        pos -= product_container.offsetWidth;
        category_container.style.transform = `translateX(${pos}px)`;
      }
    });
    // controller envent listener
    let prev = document.createElement("i");
    prev.classList.add(
      "btn",
      "bi-arrow-left-circle-fill",
      "fs-3",
      "text-secondary"
    );
    prev.addEventListener("click", () => {
      if (step > 0 && pos < 0) {
        step--;
        pos += product_container.offsetWidth;
        category_container.style.transform = `translateX(${pos}px)`;
      } else {
        step = 0;
        pos = 0;
        category_container.style.transform = `translateX(${pos}px)`;
      }
    });
    if (
      productCategory[category].length * card.offsetWidth <
      product_container.offsetWidth
    ) {
      controller.classList.add("d-none");
    }
    controller.classList.add("d-flex", "justify-content-center");
    controller.append(prev, next);
    product_container.append(controller);
  }
}

/** ================ display single product for product?id = product_id item */
async function displayProduct() {
  let products = await readProductsJSON();
  let product_id = new URLSearchParams(window.location.search).get("id");
  let product = products.find((product) => product.id == product_id);
  if (!product) {
    location.href = "index.html";
  }
  let product_name = document.querySelector(".product-name");
  let product_price = document.querySelector(".product-price");
  let product_description = document.querySelector(".product-description");
  let product_image = document.querySelector(".product-image");
  let product_category = document.querySelector(".product-category");
  let add_to_cart = document.querySelector(".add-to-cart");

  product_name.innerText = product.name;
  product_price.innerText = `${product.price} $`;
  product_description.innerText = `Description: ${product.description}`;
  product_category.innerText = `category: ${product.category}`;
  product_image.src = product.image;
  add_to_cart.addEventListener("click", () => {
    addToCart(product, 1);
    cart_indicator.style.display = "inline-block";
  });
}
let total;
/** ================ display carts */
function displayCarts() {
  total = 0; // reset total
  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  const cartContainer = document.querySelector(".carts-container");
  cartContainer.innerHTML = "";
  carts.forEach((cart) => {
    total += cart.price * cart.quantity;

    const card = document.createElement("div");
    card.classList.add("card", "m-2", "p-2");
    const row = document.createElement("div");
    row.classList.add("row");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("col-md-3");
    const image = document.createElement("img");
    image.classList.add("img-fluid", "rounded-start");
    image.src = cart.image;
    imageContainer.append(image);

    const cardBody = document.createElement("div");
    cardBody.classList.add("col-md-8");
    const name = document.createElement("h5");
    name.classList.add("card-title");
    name.innerText = cart.name;

    const price = document.createElement("p");
    price.classList.add("card-text");
    price.innerText = cart.price;

    const quantityContainer = document.createElement("div");
    const quantity = document.createElement("span");
    quantity.classList.add("card-text");
    quantity.innerText = cart.quantity;

    const reduceBtn = document.createElement("i");
    reduceBtn.classList.add(
      "btn",
      "text-danger",
      "bi-dash-circle",
      "rounded-circle"
    );
    reduceBtn.addEventListener("click", () => {
      total -= cart.price;
      totalPrice.innerText = total;
      cart.quantity = cart.quantity - 1 || 0;
      quantity.innerText = cart.quantity;
      if (addToCart(cart, -1)) {
        displayCarts();
      }
    });

    const increaseBtn = document.createElement("i");
    increaseBtn.classList.add(
      "btn",
      "text-success",
      "bi-plus-circle",
      "rounded-circle"
    );
    increaseBtn.addEventListener("click", () => {
      total += cart.price;
      totalPrice.innerText = total;
      cart.quantity += 1;
      quantity.innerText = cart.quantity;
      addToCart(cart, 1);
    });

    const removeBtn = document.createElement("i");
    removeBtn.classList.add("btn", "text-danger", "bi-trash", "rounded-circle");
    removeBtn.addEventListener("click", () => {
      total -= cart.price * cart.quantity;
      totalPrice.innerText = total;
      addToCart(cart, -cart.quantity);
      displayCarts();
    });

    quantityContainer.append(reduceBtn, quantity, increaseBtn, removeBtn);
    cardBody.append(name, price, quantityContainer);
    row.append(imageContainer, cardBody);
    card.append(row);
    cartContainer.append(card);
  });

  const checkoutBtn = document.querySelector("#checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    if (!localStorage.getItem("carts")) {
      alert("Your cart is empty, please add some products");
      location.href = "ourproducts.html";
    } else location.href = "checkout.html";
  });
  const totalPrice = document.querySelector(".total-price");
  totalPrice.innerText = total;
}
/** ================ checkout method that delete carts from localStorage
 * for future changes send request to server
 *  */
function checkout() {
  if (!localStorage.getItem("carts")) {
    alert("Your cart is empty, please add some products");
    location.href = "ourproducts.html";
  } else {
    localStorage.removeItem("carts");
  }
}
/** =============== add product quantity to cart
 * quantity can be positive for add quantity to specific product or negative for reduce quantity
 * remove product from cart if quantity is 0
 */
function addToCart(product, quantity = 0) {
  let carts = JSON.parse(localStorage.getItem("carts")) || [];
  let cart = carts.find((cart) => cart.id == product.id);
  let deleteProduct = false;
  if (cart) {
    cart.quantity += quantity;
    if (cart.quantity == 0) {
      carts = carts.filter((cart) => cart.id != product.id);
      deleteProduct = true;
    }
  } else {
    cart = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    carts.push(cart);
  }
  if (carts.length == 0) {
    cart_indicator.style.display = "none";
    localStorage.removeItem("carts");
  } else {
    localStorage.setItem("carts", JSON.stringify(carts));
  }
  return deleteProduct;
}
/** ================= Home page slider ===================== */
let home_slider = document.querySelectorAll(".slider");
function prevSlide() {
  home_slider[slideIndex].style.opacity = "0";
  setTimeout(() => {
    home_slider[slideIndex].style.display = "none";
    if (slideIndex == 0) {
      slideIndex = 2;
    } else {
      slideIndex--;
    }
    home_slider[slideIndex].style.display = "block";
    home_slider[slideIndex].style.opacity = "0";
    setTimeout(() => {
      home_slider[slideIndex].style.opacity = "1";
    }, 200);
  }, 200);
}
function nextSlide() {
  home_slider[slideIndex].style.opacity = "0";
  setTimeout(() => {
    home_slider[slideIndex].style.display = "none";
    if (slideIndex == 2) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    home_slider[slideIndex].style.display = "block";
    home_slider[slideIndex].style.opacity = "0";
    setTimeout(() => {
      home_slider[slideIndex].style.opacity = "1";
    }, 200);
  }, 200);
}
/** ====================  scroll to top button onclick event ======================= */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
