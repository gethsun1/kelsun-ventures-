import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, unitCost, currentStock, reorderThreshold } = await request.json()

    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(unitCost !== undefined && { unitCost: parseFloat(unitCost) }),
        ...(currentStock !== undefined && { currentStock: parseInt(currentStock) }),
        ...(reorderThreshold !== undefined && { reorderThreshold: parseInt(reorderThreshold) }),
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.inventoryItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
