// Type declarations for Google APIs
/// <reference types="gapi" />
/// <reference types="gapi.auth2" />

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClient {
        requestAccessToken(overrideConfig?: {
          prompt?: string;
          hint?: string;
          state?: string;
        }): void;
        callback?: (response: TokenResponse) => void;
      }

      interface TokenResponse {
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
        error_uri?: string;
      }

      interface InitTokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: Error) => void;
        state?: string;
      }

      function initTokenClient(config: InitTokenClientConfig): TokenClient;
      function revoke(token: string, callback?: () => void): void;
    }
  }
}

declare namespace gapi {
  namespace client {
    namespace sheets {
      namespace spreadsheets {
        interface GetOptions {
          spreadsheetId: string;
          fields?: string;
          includeGridData?: boolean;
          ranges?: string[];
        }

        interface BatchUpdateOptions {
          spreadsheetId: string;
          resource: {
            requests: any[];
            includeSpreadsheetInResponse?: boolean;
            responseRanges?: string[];
            responseIncludeGridData?: boolean;
          };
        }

        function get(options: GetOptions): Promise<{ result: any }>;
        function batchUpdate(options: BatchUpdateOptions): Promise<{ result: any }>;

        namespace values {
          interface GetOptions {
            spreadsheetId: string;
            range: string;
            majorDimension?: string;
            valueRenderOption?: string;
            dateTimeRenderOption?: string;
          }

          interface AppendOptions {
            spreadsheetId: string;
            range: string;
            valueInputOption: string;
            resource: {
              values: any[][];
              majorDimension?: string;
            };
            insertDataOption?: string;
            includeValuesInResponse?: boolean;
            responseValueRenderOption?: string;
            responseDateTimeRenderOption?: string;
          }

          interface UpdateOptions {
            spreadsheetId: string;
            range: string;
            valueInputOption: string;
            resource: {
              values: any[][];
              majorDimension?: string;
            };
            includeValuesInResponse?: boolean;
            responseValueRenderOption?: string;
            responseDateTimeRenderOption?: string;
          }

          function get(options: GetOptions): Promise<{ result: any }>;
          function append(options: AppendOptions): Promise<{ result: any }>;
          function update(options: UpdateOptions): Promise<{ result: any }>;
        }
      }
    }
  }
}
