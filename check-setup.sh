#!/bin/bash

# Google Sheets Integration Test Script
# This script helps verify your Google Sheets setup

echo "🔍 Checking Google Sheets Integration Setup..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Create one by copying .env.example:"
    echo "   cp .env.example .env"
    echo ""
    exit 1
else
    echo "✅ .env file found"
fi

# Check if API key is set
if grep -q "VITE_GOOGLE_API_KEY=$" .env || grep -q "your_google_api_key_here" .env; then
    echo "❌ Google API Key not configured in .env"
    echo "   Follow QUICKSTART.md to get your API key"
    echo ""
    HAS_ERRORS=true
else
    echo "✅ Google API Key configured"
fi

# Check if Spreadsheet ID is set
if grep -q "VITE_GOOGLE_SPREADSHEET_ID=$" .env || grep -q "your_spreadsheet_id_here" .env; then
    echo "❌ Google Spreadsheet ID not configured in .env"
    echo "   Follow QUICKSTART.md to get your Spreadsheet ID"
    echo ""
    HAS_ERRORS=true
else
    echo "✅ Google Spreadsheet ID configured"
fi

echo ""

if [ "$HAS_ERRORS" = true ]; then
    echo "⚠️  Configuration incomplete!"
    echo ""
    echo "Next steps:"
    echo "1. Follow QUICKSTART.md to get credentials"
    echo "2. Update .env with your API key and Spreadsheet ID"
    echo "3. Run this script again to verify"
    echo "4. Restart dev server: npm run dev"
    echo ""
    exit 1
else
    echo "🎉 Configuration looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure dev server is running: npm run dev"
    echo "2. Open http://localhost:8080"
    echo "3. Look for 'Connected' indicator in the header"
    echo "4. Add a test transaction"
    echo "5. Check your Google Spreadsheet for the data"
    echo ""
    echo "If you still see 'Demo Mode', check:"
    echo "- Did you restart the dev server after editing .env?"
    echo "- Is your spreadsheet shared publicly (anyone with link = Editor)?"
    echo "- Check browser console for error messages"
    echo ""
fi
