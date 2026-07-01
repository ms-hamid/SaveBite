"use client";

import { OrderDetailUpcomingStateScreen } from "../../../components/history/UpcomingDetail";
import CustomerNavbar from "../../../components/navbar/customer_navbar";
import CancelledOrderPage from "../../../components/order_page/CancelState";
import CompletedOrderPage from "../../../components/order_page/CompleteState";
import PaymentOrderPage from "../../../components/order_page/Payment";
import PaymentDoneOrderPage from "../../../components/order_page/PaymentDone";
import ReadyOrderPage from "../../../components/order_page/ReadyState";
import { useOrder } from "../../../components/providers/OrderProvider";
import { PageHeader } from "../../../components/shared";

export default function OrderDetailPage() {
  const { order, listing, merchant, payment} = useOrder();

  console.log(order)

  if (order?.status === 'pending_payment' && order.payment?.pg_status !== 'settlement') {
    window.location.href = `/order/${order.public_id}/serve`;
    return null;
  }

  const page = {
    cancelled: <CancelledOrderPage order={order} />,
    completed: <CompletedOrderPage order={order} />,
    pending_payment: <PaymentOrderPage order={order}/>,
    paid_reserved: <PaymentDoneOrderPage order={order}/>,
    preparing: <OrderDetailUpcomingStateScreen order={order}/>,
    ready_to_pickup: <ReadyOrderPage order_data={order} merchant_data={merchant}/>
  };

  const status = order?.status as keyof typeof page;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Order Details"
        showBack={true}
        onBackClick={() => {window.history.back()}}
      />

      {page[status] ?? null}

      <CustomerNavbar active_tab="order" />
    </div>
  );
}