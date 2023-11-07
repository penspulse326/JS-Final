export const TableItem = (item) => {
  const date = new Date(item.createdAt * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}/${month}/${day}`;

  return `
    <tr data-id=${item.id}>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${item.createdAt}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${item.user.name}<br />${item.user.tel}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${item.user.address}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${item.user.email}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${item.products.map((item) => `${item.title}<br/>`).join("")}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
        ${formattedDate}
    </td>
    <td class="p-2 md:px-4 md:py-3 border border-black">
    <button class="btn-order-toggle text-[#0067CE] underline" type="button">
        ${item.paid ? "已處理" : "未處理"}
    </button>
    </td>
    <td class="px-1 py-2 border border-black">
    <button
        class="btn-order-delete w-full py-1 bg-[#C44021] text-white hover:bg-[#9D3F28] duration-300"
        type="button"
    >
        刪除
    </button>
    </td>
    </tr>`;
};

export const tableTitleHTML = `
  <tr>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
      訂單編號
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        聯絡人
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        聯絡地址
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        電子郵件
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        訂單品項
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        訂單日期
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        訂單狀態
    </th>
    <th class="p-2 md:px-4 md:py-3 border border-black whitespace-nowrap">
        操作
    </th>
  </tr>`;
