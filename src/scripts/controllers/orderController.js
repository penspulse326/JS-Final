import TableItem from "../conponents/tableItem.js";

const apiPath = "shin";

class orderController {
  constructor() {
    this.btnLogin = document.querySelector(".btn-login");
    this.tableElement = document.querySelector(".table-order");
    this.orderData = [];

    this.btnLogin?.addEventListener("click", () => this.orderInit());
    this.tableElement?.addEventListener("click", (e) =>
      this.checkTableClick(e)
    );
  }
  // 渲染表格
  renderTable() {
    this.orderData.sort((a, b) => a.createdAt - b.createdAt);

    if (!this.orderData.length) return;
    this.tableElement.innerHTML =
      tableTitleHTML + this.orderData.map((item) => TableItem(item)).join("");
  }
  // 請求訂單列表
  getOrder() {
    axios
      .get(`/admin/${apiPath}/orders`)
      .then((res) => {
        if (res.data.status) {
          this.orderData = res.data.orders;
          this.renderTable();
          return;
        }
        Swal.fire("讀取失敗", "讀取訂單時發生錯誤，請稍後再試 QQ", "error");
      })
      .catch(() =>
        Swal.fire("讀取失敗", "讀取訂單時發生錯誤，請稍後再試 QQ", "error")
      );
  }
  // 請求更改付款狀態
  putOrderPaidStatus(id, statusText) {
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
        }
      })
      .catch(() =>
        Swal.fire("更改失敗", "更改訂單時發生失敗，請稍後再試 QQ", "error")
      );
  }
  // 請求刪除單個訂單
  deleteOrder(id) {
    axios
      .delete(`/admin/${apiPath}/orders/${id}`)
      .then((res) => {
        if (res.status === 200) {
          this.orderData = res.data.orders;
          this.renderTable();
        }
      })
      .catch(() =>
        Swal.fire("刪除失敗", "刪除訂單時發生失敗，請稍後再試 QQ", "error")
      );
  }
  // 監聽 table 點擊
  checkTableClick(e) {
    const isBtnToggle = e.target.classList.contains("btn-order-toggle");
    const isBtnDelete = e.target.classList.contains("btn-order-delete");
    const id = e.target.closest("tr").getAttribute("data-id");

    if (isBtnToggle) this.putOrderPaidStatus(id, e.target.textContent);
    if (isBtnDelete) this.deleteOrder(id);
  }
  // 初始化
  orderInit() {
    const uid = prompt("請輸入 UID", "97NYtTEy4GNDBv5W3taaYDYt2ff1");
    axios.defaults.headers.common["Authorization"] = uid;
    this.getOrder();
  }
}

const tableTitleHTML = `
  <tr>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
      訂單編號
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        聯絡人
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        聯絡地址
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        電子郵件
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        訂單品項
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        訂單日期
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        訂單狀態
    </th>
    <th class="px-4 py-3 border border-black whitespace-nowrap">
        操作
    </th>
  </tr>`;

export default new orderController();
