import orderController from "./controllers/orderController.js";
import {
  init,
  productSelectHandler,
  addToCart,
  product,
} from "./controllers/cartController.js";
import { getValue, apiPostOrder } from "./controllers/formController.js";

axios.defaults.baseURL = "https://livejs-api.hexschool.io/api/livejs/v1";
axios.defaults.headers.common["Authorization"] = "97NYtTEy4GNDBv5W3taaYDYt2ff1";

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

//產品列表區
const productList = document.querySelector(".productList");
if (productList) {
  init();
}

//產品篩選區
const productSelect = document.querySelector(".productSelect");
if (productSelect) {
  productSelectHandler();
}

// 監聽加入購物車按鈕
productList.addEventListener("click", (e) => {
  // 取得按鈕的品項ID
  const productId = e.target.getAttribute("data-id");
  const targetProduct = product.find((product) => product.id === productId);
  if (targetProduct) {
    addToCart(targetProduct);
  }
});

// 監聽送出訂單按鈕
document.querySelector("#submitBtn").addEventListener("click", () => {
  getValue();
  apiPostOrder();
});

// 後台管理區塊
const dashboard = document.querySelector(".dashboard");
if (dashboard) {
  const orderManager = new orderController();
}
