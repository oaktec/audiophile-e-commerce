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

interface OrdersPageProps {}

const OrdersPage: FC<OrdersPageProps> = () => {
  return (
    <div className="max-w-xl space-y-6 rounded-lg bg-white p-6 sm:p-7 lg:p-12">
      <TypographyFormHeader>Orders</TypographyFormHeader>
      <Table>
        <TableCaption>Your order history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Order Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableCell className="font-medium">Order 1</TableCell>
          <TableCell>Shipped</TableCell>
          <TableCell>01/01/2021</TableCell>
          <TableCell>£100.00</TableCell>
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersPage;
