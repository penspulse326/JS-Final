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

const productList = document.querySelector(".productList");//產品列表
const productSelect = document.querySelector(".productSelect");//產品篩選
const cartList=document.querySelector(".cartList"); //購物車列表

productList.addEventListener("click",addCartItem)
let product = []; //存放商品內容
let cartData=[];//存放購物車列表內容
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
  getCartListApi();
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

// 取得購物車列表api
const getCartListApi=()=>{
  apiCartList()
    .then((res)=>{
      cartData=res.data.carts
      emptyCartblock()
      renderCartList()
      document.querySelector("#totalAmount").textContent = `NT$${res.data.finalTotal}`;
    })
    .catch((err)=>{
      errorAlert(err)
    })
}


// 加入購物車api
const addCartApi=(id)=>{
  let cartID = {
    data: {
      productId: id,
      quantity: 1
    }
  };
  apiaddCart(cartID)
    .then((res)=>{
      getCartListApi()
      Swal.fire({
          icon: 'success',
          title: `新增成功`,
          text: '請至購物車查看',
          showConfirmButton: false,
          timer: 1000,
      });
    })
    .catch((err)=>{
      errorAlert(err)
    })
}

//加入購物車
function addCartItem(e){
  if(!e.target.className.includes("addbtn"))return
    addCartApi(e.target.dataset.id)
}

// 取得購物車列表
function renderCartList(){
  cartList.innerHTML=cartData.map((item)=> `
    <ol class="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-10 gap-x-[15px] xl:gap-x-[30px] items-center pb-5 mb-5 border-b border-gray-400 gap-y-3">
      <li class="col-span-full md:col-span-3 flex items-center gap-x-[15px] xl:gap-x-[30px]">
        <img src="${item.product.images}" class="w-20 h-20" alt="" />
        <p>${item.product.title}</p>
      </li>
      <li class="col-span-2">
        <span class="mr-2 md:hidden">單價</span>$${item.product.price}
      </li>
      <li class="xl:col-span-2 text-right md:text-left">
        <span class="mr-2 md:hidden">數量</span>
        <button type="button"><i class="fa-solid fa-plus add" data-id="${item.id}" data-num="${item.quantity+1}"></i></button>
        ${item.quantity}
        <button type="button"><i class="fa-solid fa-minus remove" data-id="${item.id}" data-num="${item.quantity-1}"></i></button>

      </li>
      <li class="hidden md:block xl:col-span-2">
        <span class="md:hidden">金額</span>$${item.product.price*item.quantity}
      </li>
      <li class="flex items-center justify-end xl:justify-start">
        <button type="button" >
          <i class="fa-solid fa-x delSingleBtn" data-id="${item.id}"></i>
        </button>
      </li>
    </ol>
    `).join("")
}

//檢查購物車是否空的
function emptyCartblock(){
  if(!cartData.length){
    document.querySelector("#emptyCart").classList.remove("hidden");
    document.querySelector("#btnAmount").classList.add("hidden"); 
  }else{
    document.querySelector("#emptyCart").classList.add("hidden")
    document.querySelector("#btnAmount").classList.remove("hidden"); // 顯示刪除按鈕及總金額
    document.querySelector("#btnAmount").classList.add("grid"); 
  }
}








// // 加入購物車
// let totalAmount = 0;

// // cart post api data
// let cartItemData = {
//   data: {},
// };

// // 購物車商品
// let cart = [];

// export function addToCart(targetProduct) {
//   const existingItem = cart.find((item) => item.id === targetProduct.id);
//   totalAmount += targetProduct.price;

//   if (existingItem) {
//     existingItem.quantity++;
//     renderCart(cart);
//   } else {
//     targetProduct.quantity = 1;
//     cart.push(targetProduct);
//     renderCart(cart);
//   }
// }

// 購物車畫面渲染
// const cartContainer = document.querySelector("#cartContainer");

// function renderCart(cartItem) {
//   document.querySelector("#emptyCart").classList.add("hidden"); // 隱藏空購物車樣式
//   document.querySelector("#btnAmount").classList.add("grid"); // 顯示刪除按鈕及總金額
//   document.querySelector("#btnAmount").classList.remove("hidden");
//   cartContainer.classList.add("grid"); // 顯示購物車品項容器
//   cartContainer.classList.remove("hidden");
//   cartContainer.innerHTML = "";

//   cartItem.map((item) => {
//     const itemTotalAmount = item.quantity * item.price;
//     cartContainer.innerHTML += `
//     <ol class="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-10 gap-x-[15px] xl:gap-x-[30px] items-center pb-5 mb-5 border-b border-gray-400 gap-y-3">
//       <li class="col-span-full md:col-span-3 flex items-center gap-x-[15px] xl:gap-x-[30px]">
//         <img src="${item.images}" class="w-20 h-20" alt="" />
//         <p>${item.title}</p>
//       </li>
//       <li class="col-span-2">
//         <span class="mr-2 md:hidden">單價</span>$${item.price}
//       </li>
//       <li class="xl:col-span-2 text-right md:text-left">
//         <span class="mr-2 md:hidden">數量</span>${item.quantity}
//       </li>
//       <li class="hidden md:block xl:col-span-2">
//         <span class="md:hidden">金額</span>$${itemTotalAmount}
//       </li>
//       <li>
//         <span class="material-symbols-outlined flex items-center justify-end xl:justify-start">close</span>
//       </li>
//     </ol>
//     <ol
//       class="hidden grid-cols-4 md:grid-cols-8 xl:grid-cols-10 gap-x-[15px] xl:gap-x-[30px] items-center gap-y-[10px]"
//       id="btnAmount"
//     >
//       <li class="col-span-full md:col-span-2">
//         <button
//           type="button"
//           class="border border-black w-full h-12 rounded-[4px] hover:bg-black hover:text-white"
//         >
//           刪除所有品項
//         </button>
//       </li>
//       <li class="md:col-start-6 xl:col-start-8 xl:text-left">總金額</li>
//       <li
//         class="col-span-3 md:col-span-2 xl:col-start-9 text-[28px] text-right md:text-left xl:text-right"
//         id="totalAmount"
//       ></li>
//     </ol>
//     `;
//   });
//   document.querySelector("#totalAmount").innerHTML = `$${totalAmount}`;
// }
