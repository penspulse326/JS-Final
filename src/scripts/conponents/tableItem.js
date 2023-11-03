const TableItem = (item) => {
  const date = new Date(item.createdAt * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}/${month}/${day}`;

  return `
    <tr data-id=${item.id}>
    <td class="px-4 py-3 border border-black">
        ${item.createdAt}
    </td>
    <td class="px-4 py-3 border border-black">
        ${item.user.name}<br />${item.user.tel}
    </td>
    <td class="px-4 py-3 border border-black">
        ${item.user.address}
    </td>
    <td class="px-4 py-3 border border-black">
        ${item.user.email}
    </td>
    <td class="px-4 py-3 border border-black">
        ${item.products.map((item) => `${item.title}<br/>`).join("")}
    </td>
    <td class="px-4 py-3 border border-black">
        ${formattedDate}
    </td>
    <td class="px-4 py-3 border border-black">
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

export default TableItem;
