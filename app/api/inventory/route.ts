import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: "asc" }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching inventory:", error)
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

    const { name, unitCost, currentStock, reorderThreshold } = await request.json()

    if (!name || unitCost === undefined || currentStock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        unitCost: parseFloat(unitCost),
        currentStock: parseInt(currentStock),
        reorderThreshold: parseInt(reorderThreshold) || 10,
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
