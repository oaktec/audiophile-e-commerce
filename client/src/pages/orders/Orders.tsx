import api from "@/api/api";
import { TypographyFormHeader } from "@/components/common/Typography";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenName } from "@/lib/utils";
import { FC, useState } from "react";
import { useQuery } from "react-query";

interface OrdersPageProps {}

const OrdersPage: FC<OrdersPageProps> = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders } = useQuery(
    "orders",
    () => api.get("/orders") as Promise<Order[]>,
  );

  console.log(orders);

  return (
    <div className="max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-7 lg:p-12">
      <TypographyFormHeader>Orders</TypographyFormHeader>
      <Table>
        <TableCaption>Click an order to see more info</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>

            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Total</TableHead>
          </TableRow>
        </TableHeader>
        {orders &&
          orders
            .slice()
            .reverse()
            .map((order) => (
              <TableBody
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setOrderDialogOpen(true);
                }}
                className="cursor-pointer transition-colors hover:bg-gray-100"
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status || "Complete"}</TableCell>
                <TableCell>£{order.total.toLocaleString()}</TableCell>
              </TableBody>
            ))}
      </Table>
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        {selectedOrder && (
          <DialogContent className="top-[50%] w-max -translate-y-[50%] gap-1">
            <TypographyFormHeader className="pb-0 text-[1.125rem] tracking-[0.08038rem] sm:text-[1.125rem]">
              Summary - Order #{selectedOrder.id}
            </TypographyFormHeader>
            <TypographyFormHeader className="pb-0 text-[1.125rem] font-normal tracking-[0.08038rem] sm:text-[1.125rem]">
              {new Date(selectedOrder.orderDate).toLocaleDateString()}
            </TypographyFormHeader>
            <div className="space-y-6">
              {selectedOrder?.items.map((item) => (
                <div
                  key={item.product.slug}
                  className="flex items-center gap-4"
                >
                  <img
                    src={`/product-${item.product.slug}/desktop/image-product.jpg`}
                    alt={item.product.name}
                    className="mr-4 h-16 w-16 rounded-lg"
                  />
                  <div className="grid w-full grid-cols-[1fr_auto] items-center font-bold leading-[1.5625rem]">
                    <p className="text-[0.9375rem] ">
                      {shortenName(item.product.name)}
                    </p>
                    <p className="text-[0.9375rem] opacity-50">
                      x{item.quantity}
                    </p>
                    <p className="text-sm opacity-50">
                      £{Number(item.product.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="mt-8 grid grid-cols-2 items-center gap-2">
                <span className="text-[0.9375rem] font-medium uppercase leading-[1.5625rem] opacity-50">
                  Total
                </span>
                <span className="ml-auto text-lg  font-bold">
                  £{Number(selectedOrder?.total).toLocaleString()}
                </span>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrdersPage;
