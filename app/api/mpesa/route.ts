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
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const whereClause: Record<string, unknown> = {}
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const entries = await prisma.mpesaEntry.findMany({
      where: whereClause,
      orderBy: { date: "desc" }
    })

    // Calculate net change for each entry
    const entriesWithNetChange = entries.map(entry => {
      let netChange = 0
      if (entry.type === "end_of_day" && entry.deposits && entry.withdrawals && entry.fees) {
        netChange = entry.deposits - entry.withdrawals - entry.fees
      }
      return {
        ...entry,
        netChange
      }
    })

    return NextResponse.json(entriesWithNetChange)
  } catch (error) {
    console.error("Error fetching M-Pesa entries:", error)
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
    const { date, type, startingFloat, deposits, withdrawals, fees, endingFloat } = data

    if (!date || !type) {
      return NextResponse.json(
        { error: "Date and type are required" },
        { status: 400 }
      )
    }

    // Calculate net change for end of day entries
    let netChange = null
    if (type === "end_of_day" && deposits !== undefined && withdrawals !== undefined && fees !== undefined) {
      netChange = deposits - withdrawals - fees
    }

    const entry = await prisma.mpesaEntry.create({
      data: {
        date: new Date(date),
        type,
        startingFloat: startingFloat ? parseFloat(startingFloat) : null,
        deposits: deposits ? parseFloat(deposits) : null,
        withdrawals: withdrawals ? parseFloat(withdrawals) : null,
        fees: fees ? parseFloat(fees) : null,
        endingFloat: endingFloat ? parseFloat(endingFloat) : null,
        netChange,
      }
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error creating M-Pesa entry:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
