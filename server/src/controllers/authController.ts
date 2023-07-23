import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { authService } from "../services";
import db from "../db";

export default {
  loginUser: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const result = await authService.loginUser(email, password);

      res.status(200).json({
        id: result[0].id,
        token: "token", // TODO: generate token
      });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  },
  registerUser: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { email, password, firstName, lastName, address } = req.body;
      const result = await authService.registerUser(
        email,
        password,
        firstName,
        lastName,
        address
      );

      res.status(201).json({
        id: result.id,
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  },
};
