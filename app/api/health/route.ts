import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Test if we can access the User table
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      userCount,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.POSTGRES_PRISMA_URL ? "Neon (POSTGRES_PRISMA_URL)" : "Standard (DATABASE_URL)",
    })
  } catch (error) {
    console.error("Health check failed:", error)
    
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.POSTGRES_PRISMA_URL ? "Neon (POSTGRES_PRISMA_URL)" : "Standard (DATABASE_URL)",
      },
      { status: 500 }
    )
  }
}


