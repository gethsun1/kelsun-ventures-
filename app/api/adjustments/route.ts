import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const whereClause: Record<string, unknown> = {}
    
    if (type) {
      whereClause.type = type
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const adjustments = await prisma.adjustment.findMany({
      where: whereClause,
      include: {
        inventoryItem: true
      },
      orderBy: { date: "desc" }
    })

    return NextResponse.json(adjustments)
  } catch (error) {
    console.error("Error fetching adjustments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { type, date, description, amount, quantity, inventoryItemId } = data

    if (!type || !date) {
      return NextResponse.json(
        { error: "Type and date are required" },
        { status: 400 }
      )
    }

    const adjustment = await prisma.adjustment.create({
      data: {
        type,
        date: new Date(date),
        description,
        amount: amount ? parseFloat(amount) : null,
        quantity: quantity ? parseInt(quantity) : null,
        inventoryItemId: inventoryItemId || null,
      },
      include: {
        inventoryItem: true
      }
    })

    return NextResponse.json(adjustment, { status: 201 })
  } catch (error) {
    console.error("Error creating adjustment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
