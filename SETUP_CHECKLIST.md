# 📋 Google Sheets Integration Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup (Already Complete)

- [x] React app created with Vite + TypeScript
- [x] Google Sheets API functions implemented
- [x] Month-wise tab management coded
- [x] Environment variable structure ready
- [x] UI components for status indicators
- [x] Error handling and fallback modes
- [x] Documentation created

## 🔧 Setup Steps (You Need To Do)

### Step 1: Google Cloud Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project named "Sheet Ledger"
- [ ] Enable "Google Sheets API" from API Library
- [ ] Create API Key (Credentials)
- [ ] Restrict API Key:
  - [ ] API restrictions: Google Sheets API only
  - [ ] Application restrictions: HTTP referrers
  - [ ] Add referrer: `http://localhost:8080/*`
- [ ] Copy API Key

### Step 2: Google Spreadsheet Setup
- [ ] Create new Google Spreadsheet
- [ ] Name it (e.g., "My Expense Tracker")
- [ ] Copy Spreadsheet ID from URL
- [ ] Share spreadsheet:
  - [ ] Click "Share" button
  - [ ] General access: "Anyone with the link"
  - [ ] Permission: "Editor"
  - [ ] Click "Done"

### Step 3: Configure Application
- [ ] Open `.env` file in project root
- [ ] Paste your API Key after `VITE_GOOGLE_API_KEY=`
- [ ] Paste your Spreadsheet ID after `VITE_GOOGLE_SPREADSHEET_ID=`
- [ ] Save the file

### Step 4: Test Configuration
- [ ] Run setup check: `./check-setup.sh`
- [ ] Verify no errors reported
- [ ] Stop dev server (Ctrl+C)
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:8080

### Step 5: Verify Connection
- [ ] Header shows "Connected" (green indicator)
- [ ] No orange "Demo Mode" alert banner
- [ ] Browser console (F12) shows no errors
- [ ] Network tab shows requests to `sheets.googleapis.com`

### Step 6: Test Functionality
- [ ] Add a test transaction:
  - [ ] Click "Add Transaction"
  - [ ] Fill in all fields
  - [ ] Click "Add"
- [ ] Check Google Spreadsheet:
  - [ ] New tab created (e.g., "2024-12")
  - [ ] Header row present
  - [ ] Transaction data saved
- [ ] Edit the transaction:
  - [ ] Click edit icon
  - [ ] Change some values
  - [ ] Click "Update"
  - [ ] Verify changes in spreadsheet
- [ ] Delete the transaction:
  - [ ] Click delete icon
  - [ ] Confirm deletion
  - [ ] Verify row removed from spreadsheet

## 🚨 Troubleshooting Checklist

If still showing "Demo Mode":

- [ ] Checked `.env` values are not empty/placeholders
- [ ] Restarted dev server AFTER editing `.env`
- [ ] Verified spreadsheet permissions (anyone = editor)
- [ ] Checked browser console for errors
- [ ] Verified API key is valid
- [ ] Verified Spreadsheet ID is correct
- [ ] Checked API key restrictions allow localhost

If getting API errors:

- [ ] 403 Error: Check API key restrictions
- [ ] 404 Error: Wrong Spreadsheet ID
- [ ] 401 Error: API key invalid
- [ ] CORS Error: Check spreadsheet permissions

## 📚 Documentation Reference

- **Quick Setup:** [QUICKSTART.md](./QUICKSTART.md)
- **Detailed Guide:** [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
- **Project Docs:** [README.md](./README.md)
- **Summary:** [SUMMARY.md](./SUMMARY.md)

## 🎯 Success Criteria

Your setup is complete when:

✅ Header shows "Connected" with green indicator  
✅ No "Demo Mode" alert appears  
✅ Adding transaction creates row in Google Sheets  
✅ Editing transaction updates Google Sheets  
✅ Deleting transaction removes from Google Sheets  
✅ Month tabs auto-create as needed  
✅ No errors in browser console  

## 💡 Tips

1. **Environment Variables:**
   - Always restart server after `.env` changes
   - Variables must start with `VITE_` to be accessible
   - No quotes needed around values

2. **API Key Security:**
   - Never commit `.env` to git (already in `.gitignore`)
   - Always use API restrictions
   - Different keys for dev/production

3. **Spreadsheet Permissions:**
   - Must be publicly editable for API key auth
   - For private sheets, implement OAuth 2.0
   - Don't share Spreadsheet ID publicly

4. **Development:**
   - Use browser DevTools to debug
   - Check Network tab for API calls
   - Console shows helpful error messages

## 🔄 Quick Commands

```bash
# Check setup configuration
./check-setup.sh

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## 📝 Notes

Write any setup-specific notes here:

- API Key created: ___/___/20___
- Spreadsheet created: ___/___/20___
- Project Name: _________________
- Spreadsheet URL: _________________
- Issues encountered: _________________

---

**Last Updated:** Setup completed on initial configuration
**Status:** ⚠️ Awaiting Google API credentials

Once all checkboxes are ticked, you're ready to track expenses! 🎉
