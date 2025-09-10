import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investments = await prisma.investment.findMany({
      orderBy: { startDate: "desc" }
    })

    return NextResponse.json(investments)
  } catch (error) {
    console.error("Error fetching investments:", error)
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

    const { investorName, startDate, capital, profitShare } = await request.json()

    if (!investorName || !startDate || !capital || !profitShare) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const investment = await prisma.investment.create({
      data: {
        investorName,
        startDate: new Date(startDate),
        capital: parseFloat(capital),
        profitShare: parseFloat(profitShare),
      }
    })

    return NextResponse.json(investment, { status: 201 })
  } catch (error) {
    console.error("Error creating investment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
