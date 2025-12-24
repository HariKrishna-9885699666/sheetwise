# Quick Start - Google Sheets Integration

## 🎯 What You Need to Do

Your app is **ready** for Google Sheets integration! Follow these steps to connect it:

### 1️⃣ Get Google API Credentials (10 minutes)

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create new project named "Sheet Ledger"

2. **Enable Google Sheets API:**
   - Go to "APIs & Services" > "Library"
   - Search "Google Sheets API"
   - Click "Enable"

3. **Create API Key:**
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "API key"
   - **Copy the API key**
   
4. **Restrict API Key (Important):**
   - Click the key to edit
   - API restrictions: Select "Google Sheets API" only
   - Application restrictions: "HTTP referrers"
   - Add: `http://localhost:8080/*`
   - Save

### 2️⃣ Create Your Spreadsheet (2 minutes)

1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it "My Expense Tracker"
4. Copy the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit
                                           ^^^^^^^^^^^
                                           This part!
   ```

5. **Make it editable (Critical!):**
   - Click "Share" button
   - "General access" > "Anyone with the link"
   - Permission: "Editor"
   - Click "Done"

### 3️⃣ Configure Your App (1 minute)

1. Open `.env` file in your project root

2. Add your credentials:
   ```env
   VITE_GOOGLE_API_KEY=AIzaSyC-your-actual-api-key-here
   VITE_GOOGLE_SPREADSHEET_ID=1ABC123XYZ-your-actual-id
   ```

3. Save the file

### 4️⃣ Test It! (1 minute)

1. **Restart dev server** (important!):
   ```bash
   # Press Ctrl+C to stop current server
   npm run dev
   ```

2. Open http://localhost:8080

3. Add a transaction:
   - Click "Add Transaction"
   - Fill the form
   - Click "Add"

4. Check your Google Spreadsheet:
   - Should see a new tab: `2024-12`
   - Should see header row and your transaction

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] API key created and restricted
- [ ] Spreadsheet created and shared publicly
- [ ] Spreadsheet ID copied
- [ ] `.env` file updated with credentials
- [ ] Dev server restarted
- [ ] Transaction added successfully
- [ ] Data appears in Google Sheets

## 🔴 Still Seeing Demo Data?

If the app shows demo data instead of connecting to Google Sheets:

1. **Check `.env` file:**
   - Values should NOT be empty
   - Should NOT contain "your_...here" text
   - No extra spaces or quotes

2. **Restart dev server:**
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

3. **Check browser console (F12):**
   - Look for error messages
   - Should NOT see "API not configured"
   - Should see network requests to `sheets.googleapis.com`

4. **Verify spreadsheet permissions:**
   - Go to spreadsheet
   - Click Share
   - Should say "Anyone with the link" can edit

## 📚 Full Documentation

For detailed instructions with screenshots and troubleshooting:
- **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)** - Complete setup guide
- **[README.md](./README.md)** - Full project documentation

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "API not configured" in console | Check `.env` values, restart server |
| "Failed to fetch sheet tabs" | Enable API, check restrictions |
| "Permission denied" errors | Make spreadsheet publicly editable |
| Changes not saving | Check Network tab for 403/401 errors |

## 🎉 Once Connected

Your app will:
- ✅ Create month tabs automatically
- ✅ Save all transactions to Google Sheets
- ✅ Sync edits and deletes in real-time
- ✅ Work offline with local demo mode as fallback

Enjoy tracking your expenses! 🚀
