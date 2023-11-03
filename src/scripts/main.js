import orderController from "./controllers.js/orderController.js";

axios.defaults.baseURL = "https://livejs-api.hexschool.io/api/livejs/v1";
axios.defaults.headers.common["Authorization"] = "97NYtTEy4GNDBv5W3taaYDYt2ff1";

// 後台訂單行為
orderController.getOrder();

//好評推薦 拖曳區
const list = document.querySelector(".recommendation_wall");
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
