import { TableItem, tableTitleHTML } from "../conponents/tableItem.js";

const apiPath = "shin";

class orderController {
  constructor() {
    // 事件元素
    this.btnLogin = document.querySelector(".btn-login");
    this.btnClear = document.querySelector(".btn-clearOrders");
    this.btnBack = document.querySelector(".btn-chartBack");
    this.tableElement = document.querySelector(".table-order");

    this.btnLogin?.addEventListener("click", () => this.orderInit());
    this.btnClear?.addEventListener("click", () => this.checkClearBtn());
    this.tableElement?.addEventListener("click", (e) =>
      this.checkTableClick(e)
    );

    // 表格與提示區塊
    this.loading = document.querySelector(".loading");
    this.dashboard = document.querySelector(".dashboard");
    this.hintNotLogin = document.querySelector(".section-not-login");
    this.order = document.querySelector(".section-order");
    this.orderList = document.querySelector(".order-list");
    this.orderEmpty = document.querySelector(".order-empty");
    this.orderData = [];
  }
  // 顯示讀取動畫
  showLoading() {
    this.loading.classList.remove("hidden");
    this.loading.classList.add("flex");
    this.dashboard.classList.add("blur-sm");
  }
  // 關閉讀取動畫
  disableLoading() {
    this.loading.classList.remove("flex");
    this.loading.classList.add("hidden");
    this.dashboard.classList.remove("blur-sm");
  }
  // 渲染表格
  renderTable() {
    if (!this.orderData.length) {
      this.orderEmpty.classList.remove("hidden");
      this.orderList.classList.add("hidden");
      return;
    }

    this.orderEmpty.classList.add("hidden");
    this.orderList.classList.remove("hidden");

    this.orderData.sort((a, b) => a.createdAt - b.createdAt);

    this.tableElement.innerHTML =
      tableTitleHTML + this.orderData.map((item) => TableItem(item)).join("");

    this.showChart();
  }
  // 請求訂單列表
  getOrder() {
    this.showLoading();
    axios
      .get(`/admin/${apiPath}/orders`)
      .then((res) => {
        if (res.data.status) {
          this.orderData = res.data.orders;
          this.renderTable();
          this.disableLoading();
          return;
        }
        Swal.fire("讀取失敗", "讀取訂單時發生錯誤，請稍後再試 QQ", "error");
      })
      .catch(() => {
        Swal.fire("讀取失敗", "讀取訂單時發生錯誤，請稍後再試 QQ", "error");
      });
  }
  // 初始化
  orderInit() {
    const uid = prompt("請輸入 UID", "97NYtTEy4GNDBv5W3taaYDYt2ff1");
    if (!uid) return;

    axios.defaults.headers.common["Authorization"] = uid;
    this.getOrder();

    this.hintNotLogin.classList.add("hidden");
    this.order.classList.remove("hidden");
  }
  // 監聽 table 點擊
  checkTableClick(e) {
    const isBtnToggle = e.target.classList.contains("btn-order-toggle");
    const isBtnDelete = e.target.classList.contains("btn-order-delete");
    const id = e.target.closest("tr").getAttribute("data-id");

    if (isBtnToggle) this.putOrderPaidStatus(id, e.target.textContent);
    if (isBtnDelete) {
      Swal.fire({
        title: "注意",
        text: "確定要刪除此筆訂單嗎 OAO？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonText: "取消",
        confirmButtonText: "確定刪除",
      }).then((result) => {
        if (result.isConfirmed) this.deleteOrder(id);
        return;
      });
    }
  }
  // 請求更改付款狀態
  putOrderPaidStatus(id, statusText) {
    this.showLoading();
    const text = statusText.trim();
    let status = false;

    if (text === "已處理") status = true;
    if (text === "未處理") status = false;

    const reqData = { data: { id, paid: !status } };

    axios
      .put(`/admin/${apiPath}/orders`, reqData)
      .then((res) => {
        if (res.status === 200) {
          this.orderData = res.data.orders;
          this.renderTable();
          this.disableLoading();
          Swal.fire({
            icon: "success",
            title: `更改成功`,
            showConfirmButton: false,
            timer: 1000,
          });
          return;
        }
        Swal.fire("更改失敗", "更改訂單時發生失敗，請稍後再試 QQ", "error");
      })
      .catch(() =>
        Swal.fire("更改失敗", "更改訂單時發生失敗，請稍後再試 QQ", "error")
      );
  }
  // 請求刪除單個訂單
  deleteOrder(id) {
    this.showLoading();

    axios
      .delete(`/admin/${apiPath}/orders/${id}`)
      .then((res) => {
        if (res.status === 200) {
          this.orderData = res.data.orders;
          this.renderTable();
          this.disableLoading();
          Swal.fire({
            icon: "success",
            title: `刪除成功`,
            showConfirmButton: false,
            timer: 1000,
          });
          return;
        }
        Swal.fire("刪除失敗", "刪除訂單時發生失敗，請稍後再試 QQ", "error");
      })
      .catch(() =>
        Swal.fire("刪除失敗", "刪除訂單時發生失敗，請稍後再試 QQ", "error")
      );
  }
  // 監聽清除按鈕
  checkClearBtn() {
    if (!this.orderData.length) {
      Swal.fire("錯誤操作", "目前沒有任何訂單 =O=", "question");
      return;
    }
    Swal.fire({
      title: "注意",
      text: "確定要刪除所有訂單嗎 OAO？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "取消",
      confirmButtonText: "確定刪除",
    }).then((result) => {
      if (result.isConfirmed) this.clearOrder();
    });
  }
  // 請求清除全部訂單
  clearOrder() {
    axios
      .delete(`/admin/${apiPath}/orders`)
      .then((res) => {
        if (res.data.status) {
          Swal.fire("刪除成功!", res.data.message, "success");
          this.orderData = res.data.orders;
          this.renderTable();
        }
      })
      .catch(() =>
        Swal.fire("清除失敗", "清除全部訂單時發生失敗，請稍後再試 QQ", "error")
      );
  }
  // 生成圖表
  createChart(rawData, chartName, event = () => {}) {
    const data = Object.entries(rawData);
    const mainColors = chartName === "category" && {
      pattern: ["#5434A7", "#9D7FEA", "#DACBFF"],
    };
    const subColors = chartName === "sub" && {
      pattern: ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"],
    };

    return c3.generate({
      bindto: "#chart",
      data: {
        type: "pie",
        columns: data,
        onclick: event,
      },
      size: {
        width: 350,
        height: 350,
      },
      padding: {
        bottom: 32,
      },
      color: mainColors || subColors,
    });
  }
  // 顯示圖表
  showChart() {
    const { categoryData, subData } = this.transformOrderData(this.orderData);
    const showSubData = (id) => {
      this.createChart(subData[id], "sub");

      this.btnBack.classList.remove("hidden");

      this.btnBack.addEventListener("click", () => {
        this.btnBack.classList.add("hidden");
        this.createChart(categoryData, "category", (d) => showSubData(d.id));
      });
    };

    this.createChart(categoryData, "category", (d) => showSubData(d.id));
  }
  // 資料轉換
  transformOrderData(data) {
    const productsData = data.map((item) => item.products);
    const categoryData = {};
    const subData = {};

    productsData.forEach((arr) => {
      arr.forEach((item) => {
        const { category, title, price, quantity } = item;
        const totalPrice = price * quantity;

        if (!categoryData[category]) {
          categoryData[category] = totalPrice;
        } else {
          categoryData[category] += totalPrice;
        }

        if (!subData[category]) {
          subData[category] = { [title]: totalPrice };
        } else if (!subData[category][title]) {
          subData[category][title] = totalPrice;
        } else {
          subData[category][title] += totalPrice;
        }
      });
    });

    return { categoryData, subData };
  }
}

export default orderController;
