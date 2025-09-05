const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedData() {
  try {
    console.log('🌱 Seeding initial data...')

    // Create sample inventory items
    const inventoryItems = await Promise.all([
      prisma.inventoryItem.create({
        data: {
          name: 'Laptop Charger',
          unitCost: 2500,
          currentStock: 5,
          reorderThreshold: 10,
        }
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'USB Cable',
          unitCost: 800,
          currentStock: 2, // Low stock
          reorderThreshold: 5,
        }
      }),
      prisma.inventoryItem.create({
        data: {
          name: 'Phone Case',
          unitCost: 1200,
          currentStock: 15,
          reorderThreshold: 8,
        }
      }),
    ])

    console.log('✅ Created inventory items')

    // Create sample investments
    const investments = await Promise.all([
      prisma.investment.create({
        data: {
          investorName: 'John Doe',
          startDate: new Date('2024-01-15'),
          capital: 200000,
          currentProfit: 45000,
          profitShare: 0.3,
          isActive: true,
        }
      }),
      prisma.investment.create({
        data: {
          investorName: 'Jane Smith',
          startDate: new Date('2024-02-01'),
          capital: 150000,
          currentProfit: 25000,
          profitShare: 0.25,
          isActive: true,
        }
      }),
    ])

    console.log('✅ Created investments')

    // Create sample M-Pesa entries for the last 7 days
    const today = new Date()
    const mpesaEntries = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Start of day entry
      mpesaEntries.push(
        prisma.mpesaEntry.create({
          data: {
            date: date,
            type: 'start_of_day',
            startingFloat: 5000 + Math.random() * 2000,
          }
        })
      )
      
      // End of day entry
      mpesaEntries.push(
        prisma.mpesaEntry.create({
          data: {
            date: date,
            type: 'end_of_day',
            deposits: 8000 + Math.random() * 4000,
            withdrawals: 3000 + Math.random() * 2000,
            fees: 50 + Math.random() * 100,
            endingFloat: 6000 + Math.random() * 3000,
          }
        })
      )
    }

    await Promise.all(mpesaEntries)
    console.log('✅ Created M-Pesa entries')

    // Create sample expenses
    const expenses = await Promise.all([
      prisma.expense.create({
        data: {
          date: new Date('2024-12-01'),
          category: 'Office Supplies',
          description: 'Stationery and office materials',
          amount: 5000,
        }
      }),
      prisma.expense.create({
        data: {
          date: new Date('2024-12-02'),
          category: 'Transport',
          description: 'Fuel and transport costs',
          amount: 3000,
        }
      }),
      prisma.expense.create({
        data: {
          date: new Date('2024-12-03'),
          category: 'Marketing',
          description: 'Social media advertising',
          amount: 8000,
        }
      }),
      prisma.expense.create({
        data: {
          date: new Date('2024-12-04'),
          category: 'Equipment',
          description: 'New laptop for office',
          amount: 45000,
        }
      }),
      prisma.expense.create({
        data: {
          date: new Date('2024-12-05'),
          category: 'Utilities',
          description: 'Monthly internet bill',
          amount: 2500,
        }
      }),
      prisma.expense.create({
        data: {
          date: new Date('2024-12-06'),
          category: 'Professional Services',
          description: 'Legal consultation',
          amount: 12000,
        }
      }),
    ])

    console.log('✅ Created expenses')

    // Create sample adjustments
    const adjustments = await Promise.all([
      prisma.adjustment.create({
        data: {
          type: 'stock_adjustment',
          date: new Date('2024-12-01'),
          description: 'Stock count adjustment',
          quantity: -2,
          inventoryItemId: inventoryItems[0].id,
        }
      }),
      prisma.adjustment.create({
        data: {
          type: 'item_picked',
          date: new Date('2024-12-02'),
          description: 'Item picked for sale',
          amount: 2500,
          inventoryItemId: inventoryItems[0].id,
        }
      }),
    ])

    console.log('✅ Created adjustments')

    console.log('🎉 Data seeding completed successfully!')
    console.log('\n📊 Dashboard should now show real data:')
    console.log('- Total Investments: KSH 350,000')
    console.log('- Low Stock Items: 1 (USB Cable)')
    console.log('- M-Pesa entries for the last 7 days')
    console.log('- Sample expenses and adjustments')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedData()
