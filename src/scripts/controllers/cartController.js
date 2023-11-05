export const api_path = "jelly77";

//建立baseURL
const cartBase = axios.create({
  baseURL: "https://livejs-api.hexschool.io/",
});

//取得產品列表
const apiProductList = () =>
  cartBase.get(`api/livejs/v1/customer/${api_path}/products`);

// 取得購物車列表
const apiCartList = () =>
  cartBase.get(`api/livejs/v1/customer/${api_path}/carts`);

// 加入購物車
const apiaddCart = (data) =>
  cartBase.post(`api/livejs/v1/customer/${api_path}/carts`, data);

// 刪除購物車內特定產品
const apideleteCartItem = (id) =>
  cartBase.delete(`api/livejs/v1/customer/${api_path}/carts/${id}`);

// 清除購物車內全部產品
const apideleteAllCart = () =>
  cartBase.delete(`api/livejs/v1/customer/${api_path}/carts`);

//編輯購物車產品數量
const apieditCartNum = (data) =>
  cartBase.patch(`api/livejs/v1/customer/${api_path}/carts`, data);

const productList = document.querySelector(".productList");
const productSelect = document.querySelector(".productSelect");
export let product = []; //存放商品內容

//錯誤彈跳
function errorAlert(err) {
  Swal.fire({
    icon: "error",
    title: `${err?.name}`,
    text: `${err?.message}`,
    showConfirmButton: true,
  });
}
export function init() {
  getProductList();
}
// 取得產品列表api
const getProductList = () => {
  apiProductList()
    .then((res) => {
      product = res.data.products;
      renderProductData(product);
    })
    .catch((err) => {
      errorAlert(err);
    });
};
// 取得產品列表
function renderProductData(data) {
  productList.innerHTML = data
    .map(
      (item) => `
    <li class="col-span-12 md:col-span-6 lg:col-span-3 relative">
      <div class="bg-black text-white text-xl w-[88px] py-2 text-center absolute top-3 -right-1">新品</div>
      <img src="${item.images}" alt="${item.title}" class="w-full h-[302px]">
      <button type="button" class="addbtn bg-black text-white w-full text-center hover:bg-primary py-2 mb-2" data-id="${item.id}">加入購物車</button>
      <h3 class="text-xl mb-2">${item.title}</h3>
      <span class="text-xl line-through">NT$${item.origin_price}</span>
      <p class="text-[28px]">NT$${item.price}</p>
    </li>
  `
    )
    .join("");
}

//productSelect 產品篩選
export function productSelectHandler() {
  productSelect.addEventListener("change", (e) => {
    renderProductData(
      product.filter((item) => {
        if (e.target.value === item.category) {
          return item;
        }
        if (e.target.value === "全部") {
          return item;
        }
      })
    );
  });
}

// 加入購物車
let totalAmount = 0;

// cart post api data
let cartItemData = {
  data: {},
};

// 購物車商品
let cart = [];

export function addToCart(targetProduct) {
  const existingItem = cart.find((item) => item.id === targetProduct.id);
  totalAmount += targetProduct.price;

  if (existingItem) {
    existingItem.quantity++;
    renderCart(cart);
  } else {
    targetProduct.quantity = 1;
    cart.push(targetProduct);
    renderCart(cart);
  }
}

// 購物車畫面渲染
const cartContainer = document.querySelector("#cartContainer");

function renderCart(cartItem) {
  document.querySelector("#emptyCart").classList.add("hidden"); // 隱藏空購物車樣式
  document.querySelector("#btnAmount").classList.add("grid"); // 顯示刪除按鈕及總金額
  document.querySelector("#btnAmount").classList.remove("hidden");
  cartContainer.classList.add("grid"); // 顯示購物車品項容器
  cartContainer.classList.remove("hidden");
  cartContainer.innerHTML = "";

  cartItem.map((item) => {
    const itemTotalAmount = item.quantity * item.price;
    cartContainer.innerHTML += `
    <ol class="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-10 gap-x-[15px] xl:gap-x-[30px] items-center pb-5 mb-5 border-b border-gray-400 gap-y-3">
      <li class="col-span-full md:col-span-3 flex items-center gap-x-[15px] xl:gap-x-[30px]">
        <img src="${item.images}" class="w-20 h-20" alt="" />
        <p>${item.title}</p>
      </li>
      <li class="col-span-2">
        <span class="mr-2 md:hidden">單價</span>$${item.price}
      </li>
      <li class="xl:col-span-2 text-right md:text-left">
        <span class="mr-2 md:hidden">數量</span>${item.quantity}
      </li>
      <li class="hidden md:block xl:col-span-2">
        <span class="md:hidden">金額</span>$${itemTotalAmount}
      </li>
      <li>
        <span class="material-symbols-outlined flex items-center justify-end xl:justify-start">close</span>
      </li>
    </ol>
    `;
  });
  document.querySelector("#totalAmount").innerHTML = `$${totalAmount}`;
}
