export const api_path = "jelly77";

//建立baseURL
const cartBase = axios.create({
	baseURL: "https://livejs-api.hexschool.io/",
});

//取得產品列表
const apiProductList = () => cartBase.get(`api/livejs/v1/customer/${api_path}/products`);

// 取得購物車列表
const apiCartList = () => cartBase.get(`api/livejs/v1/customer/${api_path}/carts`);

// 加入購物車
const apiaddCart = (data) => cartBase.post(`api/livejs/v1/customer/${api_path}/carts`,data);

// 刪除購物車內特定產品
const apideleteCartItem = (id) => cartBase.delete(`api/livejs/v1/customer/${api_path}/carts/${id}`);

// 清除購物車內全部產品
const apideleteAllCart = () => cartBase.delete(`api/livejs/v1/customer/${api_path}/carts`);

//編輯購物車產品數量
const apieditCartNum = (data) => cartBase.patch(`api/livejs/v1/customer/${api_path}/carts`,data);

const productList=document.querySelector(".productList");
const productSelect=document.querySelector(".productSelect")
let product = []; //存放商品內容

//錯誤彈跳
function errorAlert(err){
  Swal.fire({
      icon: 'error',
      title:`${err?.name}`,
      text: `${err?.message}`,
      showConfirmButton: true,
    });
}
export function init(){
  getProductList()
}
// 取得產品列表api
const getProductList=()=>{
  apiProductList()
    .then((res)=>{
      product=res.data.products
      renderProductData(product)
    })
    .catch((err)=>{
      errorAlert(err)
    })
}
// 取得產品列表
function renderProductData(data){
  productList.innerHTML=data.map((item)=>`
    <li class="col-span-3 relative">
      <div class="bg-black text-white text-xl w-[88px] py-2 text-center absolute top-3 -right-1">新品</div>
      <img src="${item.images}" alt="${item.title}" class="w-full h-[302px]">
      <button type="button" class="addbtn bg-black text-white w-full text-center hover:bg-primary py-2 mb-2" data-id="${item.id}">加入購物車</button>
      <h3 class="text-xl mb-2">${item.title}</h3>
      <span class="text-xl line-through">NT$${item.origin_price}</span>
      <p class="text-[28px]">NT$${item.price}</p>
    </li>
  `).join("")
}

//productSelect 產品篩選
export function productSelectHandler(){
  productSelect.addEventListener("change",(e)=>{
  renderProductData(product.filter((item) => {
    if (e.target.value === item.category) {
      return item;
    }
    if (e.target.value === "全部") {
      return item;
    }
  }))
})
}