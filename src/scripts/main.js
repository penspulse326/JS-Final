import orderController from "./controllers/orderController.js";
import {init} from "./controllers/cartController.js"

axios.defaults.baseURL = "https://livejs-api.hexschool.io/api/livejs/v1";
axios.defaults.headers.common["Authorization"] = "97NYtTEy4GNDBv5W3taaYDYt2ff1";

//好評推薦 拖曳區
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
const productList=document.querySelector(".productList");
if(productList){
  init()
}
