# Sheet Ledger - Expense & Income Tracker

A modern React + Vite web application for managing daily expenses and income with **direct Google Sheets integration**. All transactions are stored in Google Sheets with automatic month-wise tab organization.

## 🌟 Features

### Core Functionality
- ✅ **Add, Edit, Delete** transactions directly in Google Sheets
- 📊 **Month-wise organization** - automatic creation of separate tabs for each month
- 💰 **Expense & Income tracking** with categories and accounts
- 📅 **Date-based filtering** - switch between months easily
- 🔄 **Real-time sync** with Google Sheets
- 📱 **Responsive design** - works on desktop and mobile

### Google Sheets Integration
- 🔐 **No database required** - all data stored in your Google Spreadsheet
- 🎯 **Auto-create month tabs** - tabs created automatically (e.g., `2024-12`)
- ✏️ **Smart editing** - move transactions between months when date changes
- 🗑️ **Hard delete support** - permanently remove transactions
- 📋 **Structured data** - ID-based row identification for reliable updates

### UI/UX
- 🎨 Modern, clean interface with shadcn/ui components
- 🌓 Dark mode support
- 📊 Summary cards showing income, expenses, and balance
- 🔍 Transaction list with filtering and sorting
- ✨ Smooth animations and transitions

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Google account for creating API credentials
- A Google Spreadsheet

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd sheet-ledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Sheets API** (⚠️ Important!)
   
   Follow the detailed guide: **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)**
   
   Quick overview:
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create an API key
   - Create a Google Spreadsheet and make it publicly editable
   - Copy credentials to `.env` file

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to `http://localhost:8080` in your browser

---

## 📖 How It Works

### Month-wise Tab Structure

The app creates and manages separate tabs (sheets) for each month:

```
Your Spreadsheet
├── 2024-11 (November 2024)
│   ├── Header Row
│   └── Transactions...
├── 2024-12 (December 2024)
│   ├── Header Row
│   └── Transactions...
└── 2025-01 (January 2025)
    ├── Header Row
    └── Transactions...
```

### Data Model

Each month tab contains these columns:

| Column | Type | Description |
|--------|------|-------------|
| ID | string | Unique transaction identifier |
| Date | string | Transaction date (ISO format) |
| Expense ₹ | number | Expense amount (empty if income) |
| Income ₹ | number | Income amount (empty if expense) |
| Category | string | Transaction category |
| Account | string | Payment method/account |
| Notes | string | Additional notes |
| CreatedAt | string | Creation timestamp |
| UpdatedAt | string | Last update timestamp |

### Operations

**Add Transaction:**
1. App determines target month from transaction date
2. Creates month tab if it doesn't exist
3. Appends transaction to that month's sheet

**Edit Transaction:**
- If date stays in same month → updates row in place
- If date changes to different month → deletes from old month, adds to new month

**Delete Transaction:**
- Permanently removes the row from the appropriate month tab

---

## 🛠️ Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Forms:** React Hook Form + Zod validation
- **Date Handling:** date-fns
- **API:** Google Sheets API v4 (REST)
- **Notifications:** Sonner (toast notifications)

---

## 📁 Project Structure

```
sheet-ledger/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── MonthSwitcher.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionList.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useTransactions.ts  # Main transaction logic
│   ├── lib/              # Utility functions
│   │   ├── google-sheets.ts    # Google Sheets API
│   │   ├── date-utils.ts       # Date formatting
│   │   └── format-currency.ts
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/            # TypeScript types
│   │   └── transaction.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── .env                  # Environment variables (not in git)
├── .env.example          # Example env file
├── GOOGLE_SHEETS_SETUP.md  # Setup guide
└── package.json
```

---

## 🎯 Usage

### Adding a Transaction

1. Click **"Add Transaction"** button
2. Fill in the form:
   - Select date (determines which month tab to use)
   - Enter amount (expense OR income, not both)
   - Choose category
   - Select account/payment method
   - Add notes (optional)
3. Click **"Add"**
4. Check your Google Spreadsheet - new tab and row created!

### Editing a Transaction

1. Click **Edit** icon on any transaction
2. Modify fields as needed
3. If you change the date to a different month, the transaction moves to that month's tab
4. Click **"Update"**

### Deleting a Transaction

1. Click **Delete** icon on any transaction
2. Confirm deletion
3. Row is permanently removed from Google Sheets

### Switching Months

- Use the **month picker** at the top to view different months
- Only transactions from the selected month are displayed
- Summary cards update to show that month's totals

---

## 🔒 Security Considerations

### Current Implementation (API Key)

The app uses Google API Key authentication, which requires:
- ✅ Simple setup - no OAuth flow needed
- ✅ Great for personal use
- ⚠️ Spreadsheet must be publicly editable (anyone with link)
- ⚠️ API key exposed in browser (mitigated by restrictions)

**Recommended Security Measures:**
1. Restrict API key to Google Sheets API only
2. Add HTTP referrer restrictions (localhost + your domain)
3. Don't share Spreadsheet ID publicly
4. Use a dedicated spreadsheet for this app

### For Production (OAuth 2.0)

For better security with private spreadsheets:
- Implement Google Sign-In OAuth flow
- Use access tokens instead of API key
- Keep spreadsheet private
- More complex setup but better security

---

## 🎨 Customization

### Categories

Edit `src/types/transaction.ts`:
```typescript
export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  // Add your categories here
] as const;
```

### Accounts

Edit `src/types/transaction.ts`:
```typescript
export const ACCOUNTS = [
  "Cash",
  "Bank Account",
  // Add your accounts here
] as const;
```

### Month Tab Naming

Edit `src/lib/date-utils.ts` to change tab naming format:
```typescript
export function getMonthTabName(date: Date): string {
  // Current: "2024-12"
  // Change to: "Dec 2024" or any format you prefer
}
```

---

## 🐛 Troubleshooting

### App shows demo data instead of Google Sheets

**Cause:** API not configured or credentials invalid

**Solution:**
1. Check `.env` file has correct values
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Verify spreadsheet is shared publicly (anyone with link can edit)
4. Check browser console for errors

### "Failed to fetch sheet tabs" error

**Causes:**
- Google Sheets API not enabled
- API key invalid or restricted
- Spreadsheet permissions wrong

**Solution:** Follow [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) carefully

### Changes not syncing to Google Sheets

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed API calls
4. Verify `isApiConfigured` is true

---

## 🚢 Deployment

### Build for production

```bash
npm run build
```

### Deploy to hosting

The `dist/` folder contains your production build. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

**Important:** Update API key restrictions to include your production domain!

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is open source and available under the MIT License.

---


## 🙏 Acknowledgments

UI components from [shadcn/ui](https://ui.shadcn.com)
Icons from [Lucide](https://lucide.dev)

---

## 📞 Support

For detailed setup instructions, see **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)**

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify Google Sheets API configuration

Happy tracking! 📊💰
