import type { Request, Response } from 'express';

export const signin = async (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Signin' });
};

export const login = async (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Login' });
};
