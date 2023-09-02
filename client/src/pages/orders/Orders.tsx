import api from "@/api/api";
import { TypographyFormHeader } from "@/components/common/Typography";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import { useQuery } from "react-query";

interface OrdersPageProps {}

const OrdersPage: FC<OrdersPageProps> = () => {
  const { data: orders } = useQuery(
    "orders",
    () => api.get("/orders") as Promise<Order[]>,
  );

  console.log(orders);

  return (
    <div className="max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-7 lg:p-12">
      <TypographyFormHeader>Orders</TypographyFormHeader>
      <Table>
        <TableCaption>Click an order for more info</TableCaption>
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
              <TableBody key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status || "Complete"}</TableCell>
                <TableCell>£{order.total.toLocaleString()}</TableCell>
              </TableBody>
            ))}
      </Table>
    </div>
  );
};

export default OrdersPage;
