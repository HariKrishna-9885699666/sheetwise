# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets API integration for your Sheet Ledger app.

## Overview

The app uses Google Sheets API to perform CRUD operations directly on your Google Spreadsheet, with automatic creation of month-wise tabs (sheets) for organizing transactions.

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Sheet Ledger")
5. Click **"Create"**
6. Wait for the project to be created and make sure it's selected

---

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on **"Google Sheets API"**
4. Click **"Enable"**
5. Wait for the API to be enabled

---

## Step 3: Create API Credentials (API Key)

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"API key"**
4. Your API key will be created and displayed
5. **Copy this API key** - you'll need it for your `.env` file

### Secure Your API Key (Recommended)

1. Click on the API key name to edit it
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check only **"Google Sheets API"**
3. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add your development URL: `http://localhost:8080/*`
   - Add your production domain when deployed
4. Click **"Save"**

---

## Step 4: Create Your Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like **"My Expense Tracker"**
4. **Important:** Note the Spreadsheet ID from the URL

   **URL Format:**
   ```
   https://docs.google.com/spreadsheets/d/1AbC123XyZ_example_id/edit
                                        ^^^^^^^^^^^^^^^^^^^^^^^^
                                        This is your SPREADSHEET_ID
   ```

5. Copy this Spreadsheet ID - you'll need it for your `.env` file

---

## Step 5: Set Spreadsheet Permissions

**CRITICAL:** You must make the spreadsheet accessible by anyone with the link (read/write)

1. In your Google Spreadsheet, click **"Share"** (top right)
2. Under **"General access"**, click **"Change"**
3. Select **"Anyone with the link"**
4. Set permission to **"Editor"**
5. Click **"Done"**

> ⚠️ **Security Note:** Since we're using API Key (not OAuth), the spreadsheet must be publicly editable. Keep your Spreadsheet ID private and use API key restrictions for security.

---

## Step 6: Configure Your Application

1. Navigate to your project directory:
   ```bash
   cd /Users/hari-krishna/Documents/C/react/sheet-ledger
   ```

2. Open the `.env` file in your editor

3. Add your credentials:
   ```env
   VITE_GOOGLE_API_KEY=AIzaSyC-your-actual-api-key-here
   VITE_GOOGLE_SPREADSHEET_ID=1AbC123XyZ_your_actual_spreadsheet_id
   ```

4. Save the file

---

## Step 7: Test the Integration

1. **Restart your development server** (important for env variables to load):
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Open the app in your browser: `http://localhost:8080`

3. **Test the connection:**
   - Try adding a new transaction
   - Check your Google Spreadsheet - you should see:
     - A new tab created with the current month name (e.g., "2024-12")
     - Header row: `ID | Date | Expense ₹ | Income ₹ | Category | Account | Notes | CreatedAt | UpdatedAt`
     - Your transaction data in the first row

4. **If you see demo data:** The app is still using local demo mode. Check:
   - Browser console for error messages
   - Verify your `.env` file has correct values
   - Make sure you restarted the dev server
   - Verify spreadsheet permissions are set correctly

---

## How It Works

### Month-wise Tab Structure

The app automatically creates and manages tabs (sheets) for each month:

- **Tab Naming:** `YYYY-MM` format (e.g., `2024-12` for December 2024)
- **Auto-creation:** When you add a transaction, if the month's tab doesn't exist, it's created automatically
- **Month Switcher:** Use the UI to switch between different months

### Data Flow

1. **Add Transaction:**
   - App determines which month tab based on transaction date
   - Creates tab if it doesn't exist
   - Appends transaction to that month's sheet

2. **Edit Transaction:**
   - If date changes to different month: row is deleted from old month, added to new month
   - If date stays in same month: row is updated in place

3. **Delete Transaction:**
   - Row is permanently deleted from the appropriate month tab

### Columns in Google Sheets

Each month tab has these columns:

| Column | Description |
|--------|-------------|
| ID | Unique transaction identifier |
| Date | Transaction date (ISO format) |
| Expense ₹ | Expense amount (empty if income) |
| Income ₹ | Income amount (empty if expense) |
| Category | Transaction category |
| Account | Payment account/method |
| Notes | Additional notes |
| CreatedAt | When transaction was created |
| UpdatedAt | Last update timestamp |

---

## Troubleshooting

### "Using local demo data" in console

**Causes:**
- `.env` file not configured
- API key or Spreadsheet ID is invalid
- Development server not restarted after editing `.env`

**Solutions:**
1. Check `.env` file has correct values
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Verify API key in Google Cloud Console
4. Verify Spreadsheet ID from URL

---

### "Failed to fetch sheet tabs" error

**Causes:**
- Google Sheets API not enabled
- API key restrictions too strict
- Spreadsheet not shared publicly

**Solutions:**
1. Enable Google Sheets API in Cloud Console
2. Check API key restrictions allow localhost
3. Set spreadsheet to "Anyone with the link" can edit
4. Check browser console for detailed error

---

### Spreadsheet permission errors

**Causes:**
- Spreadsheet is private
- API key doesn't have write access

**Solutions:**
1. Make spreadsheet editable by anyone with link
2. Verify you're using an API key (not OAuth)

---

### Changes not appearing in Google Sheets

**Causes:**
- Still in demo mode
- API calls failing silently

**Solutions:**
1. Open browser developer console (F12)
2. Check Network tab for API calls
3. Look for errors in Console tab
4. Verify you see POST/PUT requests to `sheets.googleapis.com`

---

## Alternative Setup: OAuth 2.0 (More Secure)

If you need better security (private spreadsheet), you can implement OAuth 2.0 flow:

1. Create OAuth 2.0 Client ID in Google Cloud Console
2. Implement Google Sign-In in the app
3. Use access tokens for API calls
4. Keep spreadsheet private

This is more complex but provides better security. The current API Key approach is simpler for personal use.

---

## Security Best Practices

1. **API Key Restrictions:**
   - Restrict to Google Sheets API only
   - Add HTTP referrer restrictions
   - Never commit `.env` to git (it's in `.gitignore`)

2. **Spreadsheet Access:**
   - Don't share Spreadsheet ID publicly
   - Use a dedicated spreadsheet for this app
   - Consider OAuth 2.0 for sensitive data

3. **Environment Variables:**
   - Keep `.env` file secret
   - Use different spreadsheets for dev/production
   - Never expose keys in client-side code (we use `VITE_` prefix safely)

---

## Next Steps

Once integrated:

1. **Explore Features:**
   - Add different types of transactions
   - Switch between months using the month picker
   - Edit transactions and see updates in real-time

2. **Customize:**
   - Add more categories in `src/types/transaction.ts`
   - Customize the tab naming format in `src/lib/date-utils.ts`
   - Add data validation in Google Sheets

3. **Deploy:**
   - When deploying, update API key HTTP referrer restrictions
   - Add your production domain to allowed referrers
   - Use environment variables in your hosting platform

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify all credentials are correct
3. Test API key with [Google Sheets API Explorer](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get)
4. Ensure spreadsheet permissions are correct

Happy tracking! 📊💰
