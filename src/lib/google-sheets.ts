import { gapi } from 'gapi-script';

// Google Sheets OAuth Configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
const TOKEN_STORAGE_KEY = 'sheetwise_auth_token';

let gapiInitialized = false;
let tokenClient: google.accounts.oauth2.TokenClient | null = null;

// Check if OAuth is properly configured
function checkApiConfiguration(): boolean {
  if (!CLIENT_ID || CLIENT_ID === "your_google_client_id_here" || !CLIENT_ID.trim()) {
    console.warn("Google OAuth Client ID not configured. Using demo mode.");
    return false;
  }
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "your_spreadsheet_id_here" || !SPREADSHEET_ID.trim()) {
    console.warn("Google Sheets Spreadsheet ID not configured. Using demo mode.");
    return false;
  }
  return true;
}

export const isApiConfigured = checkApiConfiguration();

// Initialize GAPI
export async function initializeGapi(): Promise<void> {
  if (gapiInitialized) return;
  
  return new Promise((resolve, reject) => {
    if (typeof gapi === 'undefined') {
      reject(new Error('gapi not loaded'));
      return;
    }
    
    gapi.load('client', async () => {
      try {
        // For OAuth, we don't need API key - just discovery docs
        await gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInitialized = true;
        
        // Restore token from localStorage if available
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
          try {
            const tokenData = JSON.parse(storedToken);
            // Check if token is still valid (not expired)
            if (tokenData.expiry && Date.now() < tokenData.expiry) {
              gapi.client.setToken({ access_token: tokenData.access_token });
            } else {
              // Token expired, remove it
              localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
          } catch (e) {
            console.error('Failed to restore token:', e);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
        
        resolve();
      } catch (error) {
        console.error('GAPI initialization failed:', error);
        reject(error);
      }
    });
  });
}

// Initialize Google Identity Services
export function initializeGis(callback?: () => void): void {
  if (tokenClient) return;
  
  if (typeof google === 'undefined' || !google.accounts) {
    console.error('Google Identity Services not loaded');
    return;
  }
  
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {
      // This callback will be overridden by signIn()
      // Just a placeholder for initialization
    },
  });
}

// Sign in user
export function signIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }

    // Set up callback before requesting token
    tokenClient.callback = async (response) => {
      // Guard against undefined response
      if (!response) {
        console.error('OAuth callback received undefined response');
        reject(new Error('OAuth response was undefined'));
        return;
      }
      
      if (response.error) {
        console.error('OAuth error:', response.error);
        reject(new Error(response.error));
        return;
      }
      
      // CRITICAL: Manually set the token on gapi client
      // GIS doesn't automatically set it, we must do it ourselves
      if (response.access_token) {
        gapi.client.setToken({
          access_token: response.access_token,
        });
        
        // Get user email and store with token
        // Set expiry to 30 days from now instead of token expiry
        const expiryTime = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
        
        // Fetch user email from tokeninfo
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${response.access_token}`)
          .then(res => res.json())
          .then(data => {
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
              access_token: response.access_token,
              expiry: expiryTime,
              email: data.email || null,
            }));
          })
          .catch(err => {
            console.error('Failed to get email:', err);
            // Still store token even if email fetch fails
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({
              access_token: response.access_token,
              expiry: expiryTime,
            }));
          });
        
        resolve();
      } else {
        console.error('No access token in response');
        reject(new Error('No access token received'));
      }
    };

    // Request access token with prompt
    // Use empty prompt to allow automatic re-authentication if user has valid Google session
    try {
      tokenClient.requestAccessToken({ prompt: '' });
    } catch (error) {
      console.error('Failed to request access token:', error);
      reject(error);
    }
  });
}

// Sign out user
export function signOut(): void {
  try {
    const token = gapi?.client?.getToken?.();
    if (token && token.access_token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
      });
      gapi.client.setToken(null);
    }
    // Remove token from localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

// Silent token renewal - attempts to refresh token without user interaction
export async function refreshTokenSilently(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!tokenClient) {
      console.warn('Token client not initialized');
      resolve(false);
      return;
    }

    // Check if there's a stored token that's about to expire (within 5 minutes)
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      const tokenData = JSON.parse(storedToken);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      // If token expires in less than 5 minutes, try to renew
      if (tokenData.expiry - now < fiveMinutes) {
        console.log('Token expiring soon, attempting silent renewal...');
        tokenClient.requestAccessToken({ prompt: '' });
        resolve(true);
        return;
      }
    }
    
    resolve(false);
  });
}

// Check if user is signed in
export function isSignedIn(): boolean {
  try {
    const token = gapi?.client?.getToken?.();
    return token !== null && token !== undefined;
  } catch {
    return false;
  }
}

// Get current user email
export async function getUserEmail(): Promise<string | null> {
  if (!isSignedIn()) return null;
  
  try {
    // First, try to get from localStorage (cached)
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      const tokenData = JSON.parse(storedToken);
      if (tokenData.email) {
        return tokenData.email;
      }
    }
    
    // If not in cache, fetch from API
    const token = gapi?.client?.getToken?.();
    if (!token || !token.access_token) return null;
    
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token.access_token}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.email || null;
  } catch (error) {
    console.error('Failed to get user email:', error);
    return null;
  }
}

export interface SheetRow {
  id: string;
  date: string;
  expense: number;
  category: string;
  account: string;
  notes: string;
  image?: string; // base64 or URL
  createdAt: string;
  updatedAt: string;
}

// Get list of all sheet tabs in the spreadsheet
export async function getSheetTabs(): Promise<string[]> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties.title',
    });
    
    return response.result.sheets?.map((sheet: any) => sheet.properties.title) || [];
  } catch (error) {
    console.error('Failed to fetch sheet tabs:', error);
    throw error;
  }
}

// Check if a specific month tab exists
export async function monthTabExists(monthName: string): Promise<boolean> {
  if (!isApiConfigured || !isSignedIn()) {
    return false;
  }
  
  const tabs = await getSheetTabs();
  return tabs.includes(monthName);
}

// Create a new month tab with headers
export async function createMonthTab(monthName: string): Promise<void> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  try {
    // Add the new sheet
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            addSheet: {
              properties: { title: monthName }
            }
          }
        ]
      }
    });
    
    // Add header row
    await appendRows(monthName, [
      ["ID", "Date", "Expense ₹", "Category", "Account", "Notes", "Image", "CreatedAt", "UpdatedAt"]
    ]);
    

  } catch (error) {
    console.error('Failed to create month tab:', error);
    throw error;
  }
}

// Read all rows from a month tab
export async function readMonthData(monthName: string): Promise<SheetRow[]> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  // Try to refresh token if it's about to expire
  await refreshTokenSilently();
  
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: monthName,
    });
    
    const rows = response.result.values || [];
    
    // Skip header row, parse data rows, and filter out total row
    if (rows.length <= 1) return [];
    
    return rows.slice(1)
      .filter((row: any[]) => {
        // Filter out total row (last column contains "TOTAL")
        if (row[8] && row[8].toString().toUpperCase().includes('TOTAL')) {
          return false;
        }
        // Filter out rows without ID or valid date
        if (!row[0] || !row[1]) {
          return false;
        }
        // Validate date is not empty or "Invalid Date"
        const testDate = new Date(row[1]);
        if (isNaN(testDate.getTime())) {
          return false;
        }
        return true;
      })
      .map((row: any[]) => ({
        id: row[0] || "",
        date: row[1] || "",
        expense: parseFloat(row[2]) || 0,
        category: row[3] || "",
        account: row[4] || "",
        notes: row[5] || "",
        image: row[6] || undefined,
        createdAt: row[7] || "",
        updatedAt: row[8] || "",
      }));
  } catch (error) {
    if ((error as any).status === 404) {
      return []; // Tab doesn't exist yet
    }
    console.error('Failed to read month data:', error);
    throw error;
  }
}

// Append rows to a sheet
export async function appendRows(monthName: string, rows: (string | number)[][]): Promise<void> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  try {
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: monthName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rows
      }
    });
  } catch (error) {
    console.error('Failed to append rows:', error);
    throw error;
  }
}

// Find row index by ID
export async function findRowIndexById(monthName: string, id: string): Promise<number | null> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  const data = await readMonthData(monthName);
  const index = data.findIndex(row => row.id === id);
  return index >= 0 ? index + 2 : null; // +2 for header row and 1-based indexing
}

// Update a specific row by ID
export async function updateRowById(monthName: string, id: string, rowData: SheetRow): Promise<void> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  const rowIndex = await findRowIndexById(monthName, id);
  if (!rowIndex) {
    throw new Error(`Row with ID ${id} not found in ${monthName}`);
  }
  
  const range = `${monthName}!A${rowIndex}:I${rowIndex}`;
  
  try {
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          rowData.id,
          rowData.date,
          rowData.expense || "",
          rowData.category,
          rowData.account,
          rowData.notes,
          rowData.image || "",
          rowData.createdAt,
          rowData.updatedAt
        ]]
      }
    });
  } catch (error) {
    console.error('Failed to update row:', error);
    throw error;
  }
}

// Delete a row by ID (hard delete)
export async function deleteRowById(monthName: string, id: string): Promise<void> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  const rowIndex = await findRowIndexById(monthName, id);
  if (!rowIndex) {
    throw new Error(`Row with ID ${id} not found in ${monthName}`);
  }
  
  try {
    // Get sheet metadata
    const metaResponse = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties',
    });
    
    const sheet = metaResponse.result.sheets?.find(
      (s: any) => s.properties.title === monthName
    );
    
    if (!sheet) {
      throw new Error(`Sheet ${monthName} not found`);
    }
    
    const sheetId = sheet.properties.sheetId;
    
    // Delete the row
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
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
      }
    });
  } catch (error) {
    console.error('Failed to delete row:', error);
    throw error;
  }
}

// Add a new transaction to the appropriate month tab
export async function addTransaction(monthName: string, rowData: Omit<SheetRow, "id" | "createdAt" | "updatedAt">): Promise<SheetRow> {
  if (!isApiConfigured || !isSignedIn()) {
    throw new Error("Not authenticated");
  }
  
  // Check if month tab exists, create if not
  const exists = await monthTabExists(monthName);
  if (!exists) {
    await createMonthTab(monthName);
  }
  
  const now = new Date().toISOString(); // Full ISO string with time
  const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const fullRow: SheetRow = {
    ...rowData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  
  // Find if there's a total row and insert before it
  const allData = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${monthName}!A:I`
  });
  
  const rows = allData.result.values || [];
  let insertRowIndex = rows.length; // Default: append at end (0-based for API)
  let needsRowInsertion = false;
  
  // Check if last row is a total row (contains "TOTAL" in last column - index 8)
  if (rows.length > 1) {
    const lastRow = rows[rows.length - 1];
    if (lastRow[8] && lastRow[8].toString().toUpperCase().includes('TOTAL')) {
      insertRowIndex = rows.length - 1; // Insert before total row (0-based)
      needsRowInsertion = true;
    }
  }
  
  // Get sheet metadata to get sheetId
  const metaResponse = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties',
  });
  
  const sheet = metaResponse.result.sheets?.find(
    (s: any) => s.properties.title === monthName
  );
  
  if (!sheet) {
    throw new Error(`Sheet ${monthName} not found`);
  }
  
  const sheetId = sheet.properties.sheetId;
  
  // If we need to insert before total row, insert a new row first
  if (needsRowInsertion) {
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: insertRowIndex,
                endIndex: insertRowIndex + 1
              },
              inheritFromBefore: false
            }
          },
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: insertRowIndex,
                endRowIndex: insertRowIndex + 1
              },
              cell: {
                userEnteredFormat: {
                  textFormat: { fontSize: 10, bold: false },
                  backgroundColor: { red: 1, green: 1, blue: 1 },
                  horizontalAlignment: "RIGHT"
                }
              },
              fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)"
            }
          }
        ]
      }
    });
  }
  
  // Now write the data to the inserted/appended row
  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${monthName}!A${insertRowIndex + 1}:I${insertRowIndex + 1}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[
        fullRow.id,
        fullRow.date,
        fullRow.expense || "",
        fullRow.category,
        fullRow.account,
        fullRow.notes,
        fullRow.image || "",
        fullRow.createdAt,
        fullRow.updatedAt
      ]]
    }
  });
  
  // If this is the first transaction (no total row existed), add the total row now
  if (!needsRowInsertion) {
    const totalRowIndex = rows.length + 1; // +1 for 1-based indexing
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${monthName}!A:I`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [["", "", `=SUM(C2:C${totalRowIndex})`, "", "", "", "", "", "TOTAL EXPENSE"]]
      }
    });
    
    // Format the new total row
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: totalRowIndex,
                endRowIndex: totalRowIndex + 1,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: { fontSize: 16, bold: true },
                  backgroundColor: { red: 1, green: 0.9, blue: 0.7 },
                  horizontalAlignment: "CENTER"
                }
              },
              fields: "userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)"
            }
          }
        ]
      }
    });
  }
  
  // Update the total formula if we inserted before existing total row
  if (needsRowInsertion) {
    const totalRowIndex = insertRowIndex + 2; // +1 for the row we just inserted, +1 for 1-based
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${monthName}!C${totalRowIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[`=SUM(C2:C${totalRowIndex - 1})`]]
      }
    });
  }
  
  return fullRow;
}
