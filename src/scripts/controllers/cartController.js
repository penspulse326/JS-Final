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

const productList = document.querySelector(".productList"); //產品列表
const productSelect = document.querySelector(".productSelect"); //產品篩選
const cartList = document.querySelector(".cartList"); //購物車列表
const deleteAllBtn = document.querySelector(".deleteAllBtn"); //刪除全部品項按鈕

let product = []; //存放商品內容
export let cartData = []; //存放購物車列表內容

//初始化
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
      <img src="${item.images}" alt="${
        item.title
      }" class="w-full h-[302px] object-cover">
      <button type="button" class="addbtn bg-black text-white w-full text-center hover:bg-primary py-2 mb-2" data-id="${
        item.id
      }">加入購物車</button>
      <h3 class="text-xl mb-2">${item.title}</h3>
      <span class="text-xl line-through">NT$${money(item.origin_price)}</span>
      <p class="text-[28px]">NT$${money(item.price)}</p>
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
const getCartListApi = () => {
  apiCartList()
    .then((res) => {
      cartData = res.data.carts;
      emptyCartblock();
      renderCartList();
      document.querySelector("#totalAmount").textContent = `NT$${money(
        res.data.finalTotal
      )}`;
    })
    .catch((err) => {
      errorAlert(err);
    });
};

// 加入購物車api
const addCartApi = (id) => {
  let cartID = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  apiaddCart(cartID)
    .then((res) => {
      getCartListApi();
      Swal.fire({
        icon: "success",
        title: `新增成功`,
        text: "請至購物車查看",
        showConfirmButton: false,
        timer: 1000,
      });
    })
    .catch((err) => {
      errorAlert(err);
    });
};

// 刪除購物車內特定產品api
const deleteCartItemApi = (id) => {
  apideleteCartItem(id)
    .then((res) => {
      getCartListApi();
      Toast.fire({
        icon: "success",
        title: `成功刪除囉`,
      });
    })
    .catch((err) => {
      errorAlert(err);
    });
};

// 刪除購物車內全部產品api
const deleteAllCartApi = () => {
  Swal.fire({
    title: "你確定要刪除全部品項?",
    text: "刪除後購物車就沒有產品了！！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "刪除囉",
  }).then((result) => {
    if (result.isConfirmed) {
      apideleteAllCart()
        .then((res) => {
          Toast.fire({
            icon: "success",
            title: `${res.data.message}`,
          });
          getCartListApi();
        })
        .catch((err) => {
          errorAlert(err);
        });
    }
  });
};

//編輯購物車產品數量api
const editCartNumApi = (id, num) => {
  let cartID = {
    data: {
      id,
      quantity: num * 1,
    },
  };
  apieditCartNum(cartID)
    .then((res) => {
      getCartListApi();
    })
    .catch((err) => {
      errorAlert(err);
    });
};

//加入購物車
function addCartItem(e) {
  if (cartData.some((item) => item.product.id === e.target.dataset.id)) {
    let { id, quantity } = cartData.find(
      (item) => item.product.id === e.target.dataset.id
    );
    editCartNumApi(id, quantity + 1);
    Swal.fire({
      icon: "success",
      title: `新增成功`,
      text: "請至購物車查看",
      showConfirmButton: false,
      timer: 1000,
    });
  } else if (e.target.className.includes("addbtn")) {
    addCartApi(e.target.dataset.id);
  }
}

// 取得購物車列表
function renderCartList() {
  cartList.innerHTML = cartData
    .map(
      (item) => `
    <ol class="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-10 gap-x-[15px] xl:gap-x-[30px] items-center pb-5 mb-5 border-b border-gray-400 gap-y-3">
      <li class="col-span-full md:col-span-3 flex items-center gap-x-[15px] xl:gap-x-[30px]">
        <img src="${item.product.images}" class="w-20 h-20" alt="" />
        <p>${item.product.title}</p>
      </li>
      <li class="col-span-2">
        <span class="mr-2 md:hidden">單價</span>$${money(item.product.price)}
      </li>
      <li class="xl:col-span-2 text-right md:text-left">
        <span class="mr-2 md:hidden">數量</span>
        <button type="button"><i class="fa-solid fa-plus add" data-id="${
          item.id
        }" data-num="${item.quantity + 1}"></i></button>
        <span class="mx-1">${item.quantity}</span>
        <button type="button"><i class="fa-solid fa-minus remove" data-id="${
          item.id
        }" data-num="${item.quantity - 1}"></i></button>

      </li>
      <li class="hidden md:block xl:col-span-2">
        <span class="md:hidden">金額</span>$${money(
          item.product.price * item.quantity
        )}
      </li>
      <li class="flex items-center justify-end xl:justify-start">
        <button type="button" >
          <i class="fa-solid fa-x delSingleBtn" data-id="${item.id}"></i>
        </button>
      </li>
    </ol>
    `
    )
    .join("");
}

//檢查購物車是否空的
function emptyCartblock() {
  if (!cartData.length) {
    document.querySelector("#emptyCart").classList.remove("hidden");
    document.querySelector("#btnAmount").classList.add("hidden");
  } else {
    document.querySelector("#emptyCart").classList.add("hidden");
    document.querySelector("#btnAmount").classList.remove("hidden"); // 顯示刪除按鈕及總金額
    document.querySelector("#btnAmount").classList.add("grid");
  }
}

// 刪除或調整購物車內特定產品
function cartHandler(e) {
  e.preventDefault();
  if (e.target.className.includes("delSingleBtn")) {
    Swal.fire({
      title: "你確定要刪除該品項?",
      text: "刪除就不能再反悔了！！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "刪除囉",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCartItemApi(e.target.dataset.id);
      }
    });
  }
  if (
    e.target.className.includes("add") ||
    e.target.className.includes("remove")
  ) {
    if (e.target.dataset.num === "0") return;
    disabledBtn(e.target.parentElement);
    editCartNumApi(e.target.dataset.id, e.target.dataset.num);
    setTimeout(() => {
      Toast.fire({
        icon: "success",
        title: `成功修改該品項數量`,
      });
    }, 1500);
  }
}

//SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

//錯誤彈跳
function errorAlert(err) {
  Swal.fire({
    icon: "error",
    title: `${err?.name}`,
    text: `${err?.message}`,
    showConfirmButton: true,
  });
}

//按鈕disabled
function disabledBtn(target) {
  if (target.disabled) {
    setTimeout(() => {
      target.disabled = false;
    }, 1500);
  } else {
    target.disabled = true;
  }
}

//數字加逗點
function money(num) {
  //必須為字串
  let str = num.toString().split(".");
  return str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

cartList.addEventListener("click", cartHandler);
productList.addEventListener("click", addCartItem);
deleteAllBtn.addEventListener("click", deleteAllCartApi);
