// Google Sheets API Configuration
// These values are loaded from environment variables (.env file)
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

// Check if API is properly configured
function checkApiConfiguration(): boolean {
  if (!API_KEY || API_KEY === "your_google_api_key_here" || !API_KEY.trim()) {
    console.warn("Google Sheets API Key not configured. Using demo mode.");
    return false;
  }
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "your_spreadsheet_id_here" || !SPREADSHEET_ID.trim()) {
    console.warn("Google Sheets Spreadsheet ID not configured. Using demo mode.");
    return false;
  }
  return true;
}

export const isApiConfigured = checkApiConfiguration();

export interface SheetRow {
  id: string;
  date: string;
  expense: number;
  income: number;
  category: string;
  account: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Get list of all sheet tabs in the spreadsheet
export async function getSheetTabs(): Promise<string[]> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}?key=${API_KEY}&fields=sheets.properties.title`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch sheet tabs: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.sheets?.map((sheet: { properties: { title: string } }) => sheet.properties.title) || [];
}

// Check if a specific month tab exists
export async function monthTabExists(monthName: string): Promise<boolean> {
  if (!isApiConfigured) {
    return false;
  }
  
  const tabs = await getSheetTabs();
  return tabs.includes(monthName);
}

// Create a new month tab with headers
export async function createMonthTab(monthName: string): Promise<void> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  // First, add the new sheet
  const addSheetUrl = `${SHEETS_API_BASE}/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`;
  
  const addSheetResponse = await fetch(addSheetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          addSheet: {
            properties: { title: monthName }
          }
        }
      ]
    })
  });
  
  if (!addSheetResponse.ok) {
    const errorText = await addSheetResponse.text();
    throw new Error(`Failed to create sheet tab: ${addSheetResponse.status} ${addSheetResponse.statusText} - ${errorText}`);
  }
  
  // Then add the header row
  await appendRows(monthName, [
    ["ID", "Date", "Expense ₹", "Income ₹", "Category", "Account", "Notes", "CreatedAt", "UpdatedAt"]
  ]);
}

// Read all rows from a month tab
export async function readMonthData(monthName: string): Promise<SheetRow[]> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(monthName)}?key=${API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return []; // Tab doesn't exist yet
    }
    const errorText = await response.text();
    throw new Error(`Failed to read sheet data: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  const rows = data.values || [];
  
  // Skip header row, parse data rows
  if (rows.length <= 1) return [];
  
  return rows.slice(1).map((row: string[]) => ({
    id: row[0] || "",
    date: row[1] || "",
    expense: parseFloat(row[2]) || 0,
    income: parseFloat(row[3]) || 0,
    category: row[4] || "",
    account: row[5] || "",
    notes: row[6] || "",
    createdAt: row[7] || "",
    updatedAt: row[8] || "",
  }));
}

// Append rows to a sheet
export async function appendRows(monthName: string, rows: (string | number)[][]): Promise<void> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(monthName)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to append rows: ${response.statusText}`);
  }
}

// Find row index by ID
export async function findRowIndexById(monthName: string, id: string): Promise<number | null> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const data = await readMonthData(monthName);
  const index = data.findIndex(row => row.id === id);
  return index >= 0 ? index + 2 : null; // +2 for header row and 1-based indexing
}

// Update a specific row by ID
export async function updateRowById(monthName: string, id: string, rowData: SheetRow): Promise<void> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const rowIndex = await findRowIndexById(monthName, id);
  if (!rowIndex) {
    throw new Error(`Row with ID ${id} not found in ${monthName}`);
  }
  
  const range = `${monthName}!A${rowIndex}:I${rowIndex}`;
  const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      values: [[
        rowData.id,
        rowData.date,
        rowData.expense || "",
        rowData.income || "",
        rowData.category,
        rowData.account,
        rowData.notes,
        rowData.createdAt,
        rowData.updatedAt
      ]]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update row: ${response.statusText}`);
  }
}

// Delete a row by ID (hard delete)
export async function deleteRowById(monthName: string, id: string): Promise<void> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  const rowIndex = await findRowIndexById(monthName, id);
  if (!rowIndex) {
    throw new Error(`Row with ID ${id} not found in ${monthName}`);
  }
  
  // Get sheet ID first
  const metaUrl = `${SHEETS_API_BASE}/${SPREADSHEET_ID}?key=${API_KEY}&fields=sheets.properties`;
  const metaResponse = await fetch(metaUrl);
  const metaData = await metaResponse.json();
  
  const sheet = metaData.sheets?.find(
    (s: { properties: { title: string } }) => s.properties.title === monthName
  );
  
  if (!sheet) {
    throw new Error(`Sheet ${monthName} not found`);
  }
  
  const sheetId = sheet.properties.sheetId;
  
  // Delete the row
  const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}:batchUpdate?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: rowIndex - 1, // 0-based
              endIndex: rowIndex // exclusive
            }
          }
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete row: ${response.statusText}`);
  }
}

// Add a new transaction to the appropriate month tab
export async function addTransaction(monthName: string, rowData: Omit<SheetRow, "id" | "createdAt" | "updatedAt">): Promise<SheetRow> {
  if (!isApiConfigured) {
    throw new Error("Google Sheets API not configured");
  }
  
  // Check if month tab exists, create if not
  const exists = await monthTabExists(monthName);
  if (!exists) {
    await createMonthTab(monthName);
  }
  
  const now = new Date().toISOString();
  const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const fullRow: SheetRow = {
    ...rowData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  
  await appendRows(monthName, [[
    fullRow.id,
    fullRow.date,
    fullRow.expense || "",
    fullRow.income || "",
    fullRow.category,
    fullRow.account,
    fullRow.notes,
    fullRow.createdAt,
    fullRow.updatedAt
  ]]);
  
  return fullRow;
}
