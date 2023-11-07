import orderController from "./controllers/orderController.js";
import { init, productSelectHandler } from "./controllers/cartController.js";
import { submitBtnHandler } from "./controllers/formController.js";

axios.defaults.baseURL = "https://livejs-api.hexschool.io/api/livejs/v1";

// 好評推薦區塊 拖曳功能
const list = document.querySelector(".recommendation_wall");
if (list) {
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  function startDrag(e) {
    list.classList.add("active");
    startX = e.pageX;
    startScroll = list.scrollLeft;
    moved = false;
  }
  function dragHandler(e) {
    e.preventDefault();
    if (list.classList.contains("active")) {
      moved = true;
      let move = e.pageX - startX;
      list.scrollLeft = startScroll - move * 2;
    }
  }
  function stopDrag(e) {
    list.classList.remove("active");
  }

  list.addEventListener("mousedown", startDrag); //touchstart
  list.addEventListener("mousemove", dragHandler); //touchmove
  list.addEventListener("mouseup", stopDrag); //touchend
  list.addEventListener("mouseleave", stopDrag);
}

//產品列表區及購物車列表區
const productList = document.querySelector(".productList");
if (productList) {
  init();
}

//產品篩選區
const productSelect = document.querySelector(".productSelect");
if (productSelect) {
  productSelectHandler();
}

// 刪除購物車品項
const cartSection = document.querySelector("#cartSection");
if (cartSection) {
  cartSection.addEventListener("click", (e) => {
    if (e.target.id === "delectItem") {
      delectProduct(e.target);
    }
    if (e.target.id === "delectAll") {
      delectAllProduct();
    }
  });
}

// 送出訂單按鈕
const submitBtn = document.querySelector("#submitBtn");
if (submitBtn) {
  submitBtnHandler();
}

// 後台管理區塊
const dashboard = document.querySelector(".dashboard");
if (dashboard) {
  ("97NYtTEy4GNDBv5W3taaYDYt2ff1");
  const orderManager = new orderController();
}
