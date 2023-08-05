import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import { orderService } from "../services";

export default {
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    const orders = await orderService.getAllOrdersByUserId(userId);

    res.status(StatusCodes.OK).json(orders);
  },
  getOrderById: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (isNaN(orderId)) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Invalid order ID"));
    }

    if (!userId) {
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          "You must be logged in to do that"
        )
      );
    }

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return next(
        createHttpError(StatusCodes.NOT_FOUND, "Order does not exist")
      );
    }

    if (order.userId !== userId) {
      return next(
        createHttpError(
          StatusCodes.FORBIDDEN,
          "You are not the owner of this order"
        )
      );
    }

    res.status(StatusCodes.OK).json(order);
  },
};
