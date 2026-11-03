import { formatCurrency } from "@/features/cart/lib/format";
import {
  formatOrderDate,
  formatOrderTime,
  type TrackedOrder,
} from "./orderStorage";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildInvoiceHtml(order: TrackedOrder): string {
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.variantName ?? item.note ?? "-")}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice)}</td>
          <td>${formatCurrency(item.lineTotal)}</td>
        </tr>`,
    )
    .join("");

  const discountRow =
    order.totals.discount > 0
      ? `<div class="row muted"><span>الخصم</span><span>-${formatCurrency(order.totals.discount)}</span></div>`
      : "";
  const depositRow =
    order.totals.deposit > 0
      ? `<div class="row muted"><span>العربون</span><span>${formatCurrency(order.totals.deposit)}</span></div>
         <div class="row muted"><span>المتبقي عند الاستلام</span><span>${formatCurrency(order.totals.remaining)}</span></div>`
      : "";

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فاتورة ${escapeHtml(order.reference)} - SHEORA</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; font-family: Arial, "Segoe UI", sans-serif; color: #1c1917; background: #fff; }
    .sheet { max-width: 820px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
    .brand { font-size: 28px; letter-spacing: 6px; font-weight: 700; }
    .meta { text-align: left; color: #6b7280; font-size: 12px; line-height: 1.8; }
    h1 { font-size: 20px; margin: 28px 0 8px; }
    .customer { color: #4b5563; font-size: 13px; line-height: 1.9; margin-bottom: 22px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: right; padding: 10px 8px; background: #faf8f5; color: #6b7280; font-weight: 600; }
    td { text-align: right; padding: 12px 8px; border-bottom: 1px solid #f0ebe5; }
    .totals { width: 320px; margin-right: auto; margin-top: 18px; font-size: 13px; }
    .row { display: flex; justify-content: space-between; padding: 7px 0; }
    .row.muted { color: #6b7280; }
    .row.total { margin-top: 8px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-weight: 700; font-size: 16px; }
    .note { margin-top: 28px; padding-top: 16px; border-top: 1px dashed #e5e7eb; color: #6b7280; font-size: 11px; line-height: 1.8; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand">SHEORA</div>
        <div style="color:#6b7280;font-size:12px;margin-top:6px;">دار شِيورا للجمال والعطور الفاخرة</div>
      </div>
      <div class="meta">
        <div>فاتورة طلب</div>
        <div>#${escapeHtml(order.reference)}</div>
        <div>${escapeHtml(formatOrderDate(order.createdAt))} - ${escapeHtml(formatOrderTime(order.createdAt))}</div>
      </div>
    </div>

    <h1>فاتورة الطلب</h1>
    <div class="customer">
      <div>المستلم: ${escapeHtml(order.customer.fullName)}</div>
      <div>رقم الموبايل: ${escapeHtml(order.customer.phone)}</div>
      <div>العنوان: ${escapeHtml(order.customer.governorate)} - ${escapeHtml(order.customer.area)} - ${escapeHtml(order.customer.address)}</div>
      <div>طريقة الدفع: ${escapeHtml(order.paymentMethod)}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>المنتج</th>
          <th>التفاصيل</th>
          <th>الكمية</th>
          <th>سعر الوحدة</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <div class="totals">
      <div class="row muted"><span>مجموع المنتجات</span><span>${formatCurrency(order.totals.subtotal)}</span></div>
      ${discountRow}
      <div class="row muted"><span>مصاريف الشحن</span><span>${order.totals.shipping > 0 ? formatCurrency(order.totals.shipping) : "مجاني"}</span></div>
      <div class="row total"><span>الإجمالي</span><span>${formatCurrency(order.totals.total)}</span></div>
      ${depositRow}
    </div>

    <div class="note">
      شكراً لثقتك في SHEORA. للاستفسار أو متابعة الطلب، يرجى التواصل معنا عبر واتساب مع ذكر رقم الطلب #${escapeHtml(order.reference)}.
    </div>
  </div>
</body>
</html>`;
}

export function openOrderInvoice(order: TrackedOrder): void {
  const printWindow = window.open("", "_blank", "width=900,height=1000");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(buildInvoiceHtml(order));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
}
