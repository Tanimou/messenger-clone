import bcrypt from "bcrypt"
import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
      const { name, password, email } = await req.json()
      if (!name || !password || !email) {
        return new  NextResponse("Invalid credentials", { status: 400 })
      }
      // hash password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 12)
      // create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      })
      // return user
      return NextResponse.json(user)
    } catch (error) {
      console.error("REGISTRATION ERROR",error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
}