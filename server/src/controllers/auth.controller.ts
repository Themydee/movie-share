import User from "../models/user.model";
import { User as UserType } from "../types";
import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const cleanUsername = sanitizeHtml(username);
    const cleanEmail = sanitizeHtml(email);

    if (!cleanUsername || !cleanEmail || !password) {
      res.status(400).json({
        success: false,
        error: "All fields are required",
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: uuidv4(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: cleanUsername,
        email: cleanEmail,
      },
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const cleanEmail = sanitizeHtml(email);

    if (!cleanEmail || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET_KEY!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
      refreshToken,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error' });
    }
  }
};


export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ success: false, error: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY!) as {
      userId: string;
      email: string;
    };
    const user = await User.findOne({ id: decoded.userId, email: decoded.email });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
      return;
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      accessToken: newToken,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
};