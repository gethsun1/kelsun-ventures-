# Dashboard Real Data Setup

## 🎯 Overview

The dashboard has been updated to use **real data** from your database instead of dummy data. All metrics, charts, and alerts now reflect actual business data.

## 🚀 Quick Start

### 1. Seed Sample Data (Optional)

To see the dashboard working immediately with sample data:

```bash
# Run the seed script
node scripts/seed-data.js
```

This will create:
- 3 inventory items (1 with low stock)
- 2 active investments
- 7 days of M-Pesa entries
- Sample expenses and adjustments

### 2. Start Using Real Data

The dashboard now automatically calculates:

#### 📊 **Metrics Cards**
- **Total Investments**: Sum of all active investment capital
- **Low Stock Items**: Count of inventory items below reorder threshold
- **Today's M-Pesa Net Flow**: Today's deposits - withdrawals - fees
- **Monthly Profit Share**: Current month's profit share calculations

#### 📈 **Charts**
- **Earnings Chart**: Last 6 months of investment profits vs expenses
- **M-Pesa Chart**: Last 7 days of deposits vs withdrawals

#### 🚨 **Smart Alerts**
- Low stock warnings (only shows when items are actually low)
- M-Pesa entry reminders (when no entries for today)
- Welcome message for new users

## 🔧 How It Works

### Data Flow
1. **Dashboard Hook** (`useDashboard`) fetches data from `/api/dashboard`
2. **API Endpoint** calculates real metrics from your database
3. **Real-time Updates** with SWR (refreshes every 30 seconds)
4. **Loading States** and error handling

### Key Features
- ✅ **Real-time data** - No more dummy values
- ✅ **Automatic calculations** - Metrics update as you add data
- ✅ **Smart comparisons** - Shows changes vs previous periods
- ✅ **Contextual alerts** - Only shows relevant notifications
- ✅ **Performance optimized** - Efficient database queries

## 📝 Adding Your Own Data

### 1. **Investments**
- Go to `/investments` page
- Add investor details, capital, and profit share
- Dashboard will automatically calculate totals

### 2. **Inventory**
- Go to `/inventory` page
- Add items with stock levels and reorder thresholds
- Low stock alerts will appear automatically

### 3. **M-Pesa Transactions**
- Go to `/mpesa` page
- Add daily start/end of day entries
- Net flow calculations update in real-time

### 4. **Expenses**
- Go to `/expenses` page (when implemented)
- Add categorized expenses
- Charts will include expense data

## 🎨 Customization

### Modify Metrics
Edit `/app/api/dashboard/route.ts` to:
- Change calculation logic
- Add new metrics
- Modify time periods

### Update Charts
Edit the chart data generation functions:
- `generateEarningsChartData()`
- `generateMpesaChartData()`

### Custom Alerts
Modify the alerts section in `/app/dashboard/page.tsx` to add:
- New alert conditions
- Custom notification types
- Different alert styles

## 🔍 Troubleshooting

### Dashboard Shows Zeros
- Ensure you have data in your database
- Check that investments are marked as `isActive: true`
- Verify M-Pesa entries have the correct date format

### Charts Not Loading
- Check browser console for errors
- Ensure API endpoint is accessible
- Verify database connection

### Performance Issues
- Dashboard refreshes every 30 seconds
- Consider increasing refresh interval for large datasets
- Optimize database queries if needed

## 🎉 Next Steps

1. **Add your real business data** through the respective pages
2. **Customize metrics** based on your specific needs
3. **Set up regular data entry** routines
4. **Monitor the dashboard** for business insights

The dashboard is now a **powerful business intelligence tool** that grows with your data! 🚀

