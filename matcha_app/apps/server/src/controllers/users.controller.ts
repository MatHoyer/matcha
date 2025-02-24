import type { Request, Response } from 'express';
import db from '../database/Database.js';


export const getUsers = async (req: Request, res: Response) => {

    try {
        const users = await db.user.findMany({});
        console.log("users", users);
        res.status(200).json(users);
    }  
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });    
    }
  }