# SheetWise - Expense & Income Tracker

A modern React + TypeScript web application for managing daily expenses and income with **direct Google Sheets & Google Drive integration** using OAuth 2.0 for secure, private access.

---

## 🚀 Quick Setup - OAuth 2.0 for Private Spreadsheet

**✨ Your spreadsheet and images stay PRIVATE - only accessible by you!**

### Prerequisites
- Node.js & npm installed
- Google account
- 15 minutes setup time

### Step 1: Google Cloud Setup (8 minutes)

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project"
   - Name: "SheetWise" 
   - Click "Create"

2. **Enable APIs:**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     - ✅ Google Sheets API
     - ✅ Google Drive API

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" > "OAuth consent screen"
   - User Type: **External**
   - App name: "SheetWise"
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add these scopes:
     - `https://www.googleapis.com/auth/spreadsheets`
     - `https://www.googleapis.com/auth/drive.file`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Test users: Add your email
   - Save and Continue

4. **Create OAuth Client ID:**
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: **Web application**
   - Name: "SheetWise Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:8080`
     - (Add your production domain when deploying)
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:8080`
     - (Add your production domain when deploying)
   - Click "Create"
   - **Copy the Client ID** - you'll need this!

### Step 2: Create Google Spreadsheet (3 minutes)

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"My Expense Tracker"** or any name you prefer
4. Copy the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123XYZ_example_id/edit
                                           ^^^^^^^^^^^^^^^^^^
                                           This is your ID
   ```
5. **Keep it private** - No need to share publicly with OAuth!

### Step 3: Configure Application (2 minutes)

1. Clone the repository and install dependencies:
   ```bash
   git clone <YOUR_REPO_URL>
   cd sheetwise
   npm install
   ```

2. Create `.env` file in project root:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
   VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
   ```

3. Save the file

### Step 4: Start & Test (2 minutes)

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 (or http://localhost:8080)

3. Click **"Sign In with Google"**

4. Grant permissions when prompted

5. Add a transaction and verify it appears in your Google Spreadsheet!


---

## 🌟 Features

### Core Functionality
- ✅ **Add, Edit, Delete** transactions with full CRUD operations
- 📊 **Month-wise organization** - automatic tab creation for each month
- 💰 **Expense tracking** with categories and payment accounts
- 📅 **Date-based filtering** - easy month switching
- 🔄 **Real-time sync** with Google Sheets
- 📱 **Responsive design** - optimized for mobile and desktop
- 🖼️ **Image attachments** - upload receipts to Google Drive (max 1MB, auto-resized to 600x600px)
- 🗑️ **Smart cleanup** - automatic image deletion when replacing or removing

### Google Integration
- 🔐 **OAuth 2.0 Authentication** - secure access to your private data
- 📂 **Google Drive Storage** - organized folder structure (Monthly Expenses > Images)
- 🎯 **Auto-create month tabs** - tabs created automatically (e.g., `December 2025`)
- ✏️ **Smart editing** - move transactions between months when date changes
- 🔒 **Private by default** - no public sharing required
- 📋 **Structured data** - reliable row identification and updates

### UI/UX
- 🎨 Modern interface with shadcn/ui components
- 🌓 Dark mode support
- 📊 Summary cards with total expenses and transaction count
- 🔍 Search, filter, and sort transactions
- ✨ Smooth animations and loading states
- 📱 Mobile floating action button for easy access
- 🖼️ Icon-based image preview (opens in new tab)
- ⏱️ Edit restrictions (last 10 days only)

---

## 📖 How It Works

### Month-wise Tab Structure

The app creates separate tabs in your Google Spreadsheet for each month:

```
Your Spreadsheet
├── November 2024
│   ├── Header Row
│   ├── Transaction 1
│   ├── Transaction 2
│   └── TOTAL EXPENSE
├── December 2024
│   ├── Header Row
│   ├── Transaction 1
│   └── TOTAL EXPENSE
└── January 2025
    └── (Created when first transaction added)
```

### Data Model

Each month tab contains these columns:

| Column | Type | Description |
|--------|------|-------------|
| Date | string | Transaction date (DD MMM format) |
| Category | string | Expense category |
| Account | string | Payment method/account |
| Notes | string | Additional details |
| Image | string | Google Drive URL (if attached) |
| Expense | number | Expense amount |
| ID | string | Unique identifier (hidden column) |

### Image Management

- **Upload**: Images are automatically resized to 600x600px and uploaded to Google Drive
- **Storage**: Organized in `Monthly Expenses > Images` folder structure
- **Access**: Public URLs stored in spreadsheet, viewable via icon click
- **Cleanup**: Old images deleted automatically when:
  - Replacing with new image
  - Removing image from transaction
  - Deleting entire transaction

### Operations

**Add Transaction:**
1. Fill form with date, category, account, notes, and optional image
2. Image uploaded to Google Drive (if provided)
3. App determines target month from date
4. Creates month tab if doesn't exist
5. Appends transaction row
6. Updates TOTAL EXPENSE row

**Edit Transaction:**
- Date change to different month → moves to new month tab
- Date stays in same month → updates in place
- Image replacement → deletes old image, uploads new one
- Image removal → deletes image from Drive

**Delete Transaction:**
- Deletes associated image from Drive (if exists)
- Removes row from appropriate month tab
- Updates TOTAL EXPENSE

---

## 🛠️ Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Forms:** React Hook Form + Zod validation
- **Date Handling:** date-fns
- **API:** Google Sheets API v4 + Google Drive API v3 (REST)
- **Auth:** gapi-script (Google OAuth 2.0)
- **Notifications:** Sonner (toast notifications)
- **Icons:** Lucide React

---

## 📁 Project Structure

```
sheetwise/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components (40+ components)
│   │   ├── Header.tsx       # App header with sign-in/out
│   │   ├── MonthSwitcher.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TransactionForm.tsx  # Form with image upload
│   │   ├── TransactionList.tsx  # Table with filters
│   │   └── DeleteConfirmDialog.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useTransactions.ts   # Main state management
│   ├── lib/                 # Utility functions
│   │   ├── google-sheets.ts     # Sheets API integration
│   │   ├── google-drive.ts      # Drive API integration
│   │   ├── date-utils.ts        # Date formatting
│   │   ├── format-currency.ts
│   │   └── utils.ts
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main page
│   │   └── NotFound.tsx
│   ├── types/               # TypeScript types
│   │   └── transaction.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/
│   └── robots.txt
├── .env                     # Environment variables (not in git)
├── .gitignore
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md                # This file
```

---

## 🎯 Usage Guide

### Adding a Transaction

1. Click **"Add Transaction"** button (header or floating button on mobile)
2. Fill in the form:
   - **Date:** Select date (determines which month tab)
   - **Category:** Choose from predefined categories
   - **Account:** Select payment method
   - **Notes:** Add description
   - **Amount:** Enter expense amount
   - **Image (Optional):** Upload receipt (max 1MB, auto-resized)
3. Click **"Add Transaction"**
4. Verify in Google Spreadsheet!

### Editing a Transaction

- Only transactions from **last 10 days** can be edited
- Click **Edit** (pencil icon)
- Modify fields as needed
- Date change to different month → transaction moves to new tab
- Image operations:
  - Replace: Upload new image (old one deleted automatically)
  - Remove: Click "Remove Image" (deletes from Drive)
- Click **"Update Transaction"**

### Deleting a Transaction

- Only transactions from **last 10 days** can be deleted
- Click **Delete** (trash icon)
- Confirm deletion
- Row and associated image removed permanently

### Viewing Images

- Click image icon in transaction row
- Opens image in new tab
- No inline preview for better performance

### Searching & Filtering

- **Search:** Type in search box (searches notes, category, account)
- **Filter by Category:** Select category from dropdown
- **Sort:** Choose from:
  - Newest First (default)
  - Oldest First
  - Amount High-Low
  - Amount Low-High
- **Reset:** Click reset button to clear filters

### Switching Months

- Use month selector at top
- Shows only transactions from selected month
- Summary cards update accordingly

---

## 🔒 Security & Privacy

### OAuth 2.0 Benefits

- ✅ **Private spreadsheet** - only accessible by signed-in user
- ✅ **Secure tokens** - no API keys exposed
- ✅ **User consent** - explicit permission grants
- ✅ **Revocable access** - can revoke anytime in Google Account settings

### API Limits

**Google Sheets API:**
- 60 requests/minute per user
- 300 requests/minute per project
- Sufficient for personal use

**Google Drive API:**
- 1000 requests per 100 seconds per user
- Adequate for image uploads

### Best Practices

1. **Don't share credentials** - keep `.env` file private
2. **Review permissions** - check what app can access
3. **Use test data** - test with sample data first
4. **Regular backups** - Google Sheets has version history
5. **Revoke if needed** - visit Google Account permissions

---

## 🎨 Customization

### Categories

Edit `src/types/transaction.ts`:
```typescript
export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  // Add your categories here
] as const;
```

### Payment Accounts

Edit `src/types/transaction.ts`:
```typescript
export const ACCOUNTS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "UPI",
  "Net Banking",
  // Add your accounts here
] as const;
```

### Image Constraints

Edit `src/components/TransactionForm.tsx`:
```typescript
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const TARGET_DIMENSION = 600; // 600x600px
```

### Edit Time Window

Edit `src/components/TransactionList.tsx`:
```typescript
const tenDaysAgo = new Date(today);
tenDaysAgo.setDate(today.getDate() - 10); // Change 10 to your preference
```

---

## 🐛 Troubleshooting

### "Not Connected" Status

**Cause:** Not signed in or OAuth not configured

**Solution:**
1. Verify `.env` file has correct Client ID and Spreadsheet ID
2. Restart dev server
3. Click "Sign In with Google"
4. Grant all requested permissions

### "Failed to load transactions" Error

**Causes:**
- Invalid Spreadsheet ID
- Spreadsheet not accessible
- Google Sheets API not enabled

**Solution:**
1. Check Spreadsheet ID in `.env`
2. Verify you own the spreadsheet
3. Enable Google Sheets API in Cloud Console
4. Check browser console for detailed errors

### Image Upload Fails

**Causes:**
- File size > 1MB
- Google Drive API not enabled
- Permission issues

**Solution:**
1. Compress image before uploading
2. Enable Google Drive API in Cloud Console
3. Check OAuth scopes include `drive.file`
4. Verify "Monthly Expenses" folder permissions

### Changes Not Syncing

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed API requests
4. Verify OAuth token is valid (refresh page)


---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains your production build.

### Environment Variables for Production

Create production environment variables in your hosting platform:
```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_GOOGLE_SPREADSHEET_ID=your_production_spreadsheet_id
```

### Update OAuth Settings

In Google Cloud Console:
1. Go to "APIs & Services" > "Credentials"
2. Edit your OAuth Client ID
3. Add production URLs to:
   - **Authorized JavaScript origins:**
     - `https://yourdomain.com`
   - **Authorized redirect URIs:**
     - `https://yourdomain.com`

### Recommended Hosting

Deploy to any static hosting platform:
- **Vercel** (recommended for React apps)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**
- **Cloudflare Pages**

**Example: Vercel Deploy**
```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

---

## 📝 Development Scripts

```bash
npm run dev          # Start development server (port 5173 or 8080)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Google APIs for Sheets and Drive integration

---

## 📞 Support & FAQ

### How do I revoke app access?

1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find "SheetWise"
3. Click "Remove Access"

### Can I use multiple spreadsheets?

Yes! Change `VITE_GOOGLE_SPREADSHEET_ID` in `.env` and restart the server.

### What happens if I delete the "Monthly Expenses" folder?

The app will recreate it automatically on next image upload.

### Can others use my spreadsheet?

Only if you:
1. Share the spreadsheet with them via Google Sheets
2. They sign in with their own Google account in your app
3. They have edit permissions on your spreadsheet

### How do I backup my data?

Your data is already in Google Sheets! To backup:
- Use Google Sheets version history
- Download as Excel/CSV from Sheets
- Use Google Takeout for full account backup

---

## 📊 Features Roadmap

Potential future enhancements:
- [ ] Budget tracking per category
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Data visualization charts
- [ ] Export to PDF/Excel
- [ ] Bulk upload via CSV
- [ ] Transaction tags
- [ ] Split transactions

---

## 🐛 Known Limitations

1. **Edit Window:** Only last 10 days transactions are editable (configurable)
2. **Image Size:** Max 1MB per image (configurable)
3. **Image Format:** Auto-converted to JPEG
4. **API Limits:** 60 requests/min per user (Google limitation)
5. **Offline Mode:** Requires internet connection (cloud-based)

---

Happy tracking! 📊💰

For issues or questions, open an issue on GitHub.
