import express from "express";
import userRouter from "./routes/user/userRouter";
import adminRouter from "./routes/admin/adminRouter";
import bcrypt from "bcrypt";
import { UserRegisterSchema, UserSignInSchema } from "./types/UserSchema";
import jwt from "jsonwebtoken";
import prisma from "./lib/utils";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Healthy sever" });
});

app.listen(PORT, () => {
  console.log("Server listening on PORT :" + PORT);
});

//Register
app.post("/register", async (req, res) => {
  console.log("iside register");
  try {
    const parsedData = UserRegisterSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error?.errors[0].message });
      return;
    }
    console.log(parsedData);
    const hashedPassword = await bcrypt.hash(parsedData.data?.password, 10);
    //TODO : Fetch amount from wallet
    const user = await prisma.user.create({
      data: {
        email: parsedData.data?.email,
        password: hashedPassword,
        phoneNumber: parsedData.data?.phoneNumber,
        userRole: parsedData.data.userRole === "ADMIN" ? "ADMIN" : "USER",
        amount: "10000",
        lockedAmount: "5000",
      },
    });
    res.json({ message: "User added", id: user.id, userRole: user.userRole });
  } catch (error) {
    res.json({ message: "Something went wrong" }).status(403);
  }
});

//Signin
app.post("/signin", async (req, res) => {
  try {
    const parsedData = UserSignInSchema.safeParse(req.body);
    console.log(parsedData.error?.errors[0].message);
    if (!parsedData.success) {
      res.status(400).json({ error: parsedData.error?.errors[0].message });
      return;
    }
    const userExists = await prisma.user.findUnique({
      where: { phoneNumber: parsedData.data.phoneNumber },
    });
    if (!userExists) {
      res.json({ message: "Invalid Phone Number" }).status(400);
      return;
    }
    const isPasswordValid = await bcrypt.compare(
      parsedData.data.password,
      userExists.password
    );
    if (!isPasswordValid) {
      res.json({ message: "Invalid password" }).status(400);
      return;
    }
    const token = jwt.sign(
      {
        userRole: userExists.userRole,
        phoneNumber: userExists.phoneNumber,
        userId: userExists.id,
      },
      process.env.SECRET_KEY || "secret",
      {
        expiresIn: "2h",
      }
    );
    res.json({ message: "Logged in", token });
  } catch (error) {
    console.log(error);
  }
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
