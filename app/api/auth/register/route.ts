import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check database connection first
    await prisma.$connect()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    
    // Enhanced error handling for Vercel
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      })

      // Database connection errors
      if (error.message.includes('connect') || 
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('timeout')) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 }
        )
      }
      
      // Unique constraint violations
      if (error.message.includes('Unique constraint') || 
          error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }

      // Prisma specific errors
      if (error.message.includes('Prisma')) {
        return NextResponse.json(
          { error: "Database operation failed. Please try again." },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  } finally {
    // Ensure connection is closed
    await prisma.$disconnect()
  }
}
