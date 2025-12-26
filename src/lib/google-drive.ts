import { gapi } from 'gapi-script';

// Find existing folder by name in Google Drive (searches everywhere)
async function findFolderByName(folderName: string): Promise<string | null> {
  const accessToken = gapi.client.getToken().access_token;

  // Search anywhere in Drive for this folder name
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,parents)&orderBy=createdTime&pageSize=10`,
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Failed to search for folder: ${searchResponse.statusText}`);
  }

  const searchData = await searchResponse.json();
  
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  return null;
}

// Create a new folder in Google Drive
async function createFolder(folderName: string, parentFolderId?: string): Promise<string> {
  const accessToken = gapi.client.getToken().access_token;
  
  
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const createResponse = await fetch(
    'https://www.googleapis.com/drive/v3/files?fields=id',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!createResponse.ok) {
    throw new Error(`Failed to create folder: ${createResponse.statusText}`);
  }

  const createData = await createResponse.json();
  return createData.id;
}

// Get or create the folder structure: Monthly Expenses > Images
async function getImagesFolderId(): Promise<string> {
  // First, find existing "Monthly Expenses" folder
  let monthlyExpensesFolderId = await findFolderByName('Monthly Expenses');
  
  if (!monthlyExpensesFolderId) {
    console.warn('No existing "Monthly Expenses" folder found, creating new one');
    monthlyExpensesFolderId = await createFolder('Monthly Expenses');
  } else {
  }
  
  // Now find or create "Images" folder inside Monthly Expenses
  const accessToken = gapi.client.getToken().access_token;
  const query = `name='Images' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${monthlyExpensesFolderId}' in parents`;
  
  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
  );

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }
  
  // Create Images folder inside Monthly Expenses
  const imagesFolderId = await createFolder('Images', monthlyExpensesFolderId);
  return imagesFolderId;
}

// Upload an image file to Google Drive and return the public URL
export async function uploadImageToDrive(file: File): Promise<string> {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  // Get the Images folder ID
  const imagesFolderId = await getImagesFolderId();

  // Read file as base64
  const base64Data = await fileToBase64(file);
  const base64Body = base64Data.split(',')[1]; // Remove data URL prefix

  const metadata = {
    name: `expense_${Date.now()}_${file.name}`,
    mimeType: file.type,
    parents: [imagesFolderId],
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + file.type + '\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Body +
    close_delim;

  const accessToken = gapi.client.getToken().access_token;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"',
        'Authorization': 'Bearer ' + accessToken,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    throw new Error(`Drive upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  const fileId = data.id;

  // Make the file publicly accessible
  await makeFilePublic(fileId);

  // Return the direct image URL that works for public embedding
  // Using export=view to display inline instead of downloading
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Make a Drive file publicly accessible
async function makeFilePublic(fileId: string): Promise<void> {
  const accessToken = gapi.client.getToken().access_token;

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to make file public: ${response.statusText}`, errorText);
    throw new Error(`Failed to make file public: ${response.statusText}`);
  }

}

// Helper to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Extract file ID from Drive URL
export function extractFileIdFromUrl(url: string): string | null {
  if (!url) return null;
  
  // Match various Drive URL formats
  const patterns = [
    /drive\.google\.com\/uc\?export=view&id=([^&]+)/,
    /drive\.google\.com\/uc\?export=download&id=([^&]+)/,
    /drive\.google\.com\/thumbnail\?id=([^&]+)/,
    /drive\.usercontent\.google\.com\/download\?id=([^&]+)/,
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Delete a file from Google Drive
export async function deleteImageFromDrive(imageUrl: string): Promise<void> {
  const fileId = extractFileIdFromUrl(imageUrl);
  if (!fileId) {
    console.warn('Could not extract file ID from URL:', imageUrl);
    return;
  }

  const accessToken = gapi.client.getToken().access_token;

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
  );

  if (!response.ok) {
    console.error(`Failed to delete file ${fileId}:`, response.statusText);
    throw new Error(`Failed to delete file: ${response.statusText}`);
  }

}
