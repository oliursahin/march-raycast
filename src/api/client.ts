import { getPreferenceValues } from "@raycast/api";
import https from "https";

const API_HOST = "sage.march.cat";

interface MarchError {
  message: string;
  code?: string;
}

export interface MarchItem {
  id: string;
  title: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
  due_date?: string;
}

export async function createInboxItem(title: string, notes?: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const preferences = getPreferenceValues<{ accessToken: string }>();

    const data = JSON.stringify({
      title,
      notes,
    });

    const options = {
      hostname: API_HOST,
      path: "/api/inbox/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${preferences.accessToken}`,
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(JSON.parse(responseData));
        } else {
          const error: MarchError = {
            message: `Failed to create object: ${res.statusMessage}`,
            code: res.statusCode?.toString(),
          };
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject({
        message: `Request failed: ${error.message}`,
      });
    });

    req.write(data);
    req.end();
  });
}

export async function getTodayItems(): Promise<MarchItem[]> {
  return new Promise((resolve, reject) => {
    const preferences = getPreferenceValues<{ accessToken: string }>();
    console.log("Making request to /api/today");

    const options = {
      hostname: API_HOST,
      path: "/api/today",
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.accessToken}`,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            console.log("Today items response:", parsedData);
            
            if (parsedData.response?.todayItems) {
              const items = parsedData.response.todayItems;
              console.log("Found today items:", items.length);
              resolve(items.map((item: any) => ({
                id: item.uuid || item._id,
                title: item.title,
                notes: item.description,
                created_at: item.createdAt,
                completed_at: item.completedAt,
                due_date: item.dueDate,
              })));
            } else {
              console.log("No today items found");
              resolve([]);
            }
          } catch (parseError) {
            console.error("Failed to parse today response:", parseError);
            reject(new Error("Failed to parse response"));
          }
        } else {
          reject(new Error(`Failed to fetch today's objects: ${res.statusMessage}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

export async function getInboxItems(): Promise<MarchItem[]> {
  return new Promise((resolve, reject) => {
    const preferences = getPreferenceValues<{ accessToken: string }>();
    console.log("Making request to /api/inbox");

    const options = {
      hostname: API_HOST,
      path: "/api/inbox",
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.accessToken}`,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            console.log("Inbox response:", parsedData);
            
            // For inbox, items are directly in response array
            if (Array.isArray(parsedData.response)) {
              const items = parsedData.response;
              console.log("Found inbox items:", items.length);
              resolve(items.map((item: any) => ({
                id: item.uuid || item._id,
                title: item.title,
                notes: item.description,
                created_at: item.createdAt,
                completed_at: item.completedAt,
                due_date: item.dueDate,
              })));
            } else {
              console.log("No inbox items found");
              resolve([]);
            }
          } catch (parseError) {
            console.error("Failed to parse inbox response:", parseError);
            reject(new Error("Failed to parse response"));
          }
        } else {
          reject(new Error(`Failed to fetch inbox objects: ${res.statusMessage}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

export async function getAllItems(): Promise<MarchItem[]> {
  return new Promise((resolve, reject) => {
    const preferences = getPreferenceValues<{ accessToken: string }>();
    console.log("Making request to /api/items/all");

    const options = {
      hostname: API_HOST,
      path: "/api/items/all/",  
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.accessToken}`,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            console.log("All items response:", parsedData);
            
            if (parsedData.response) {
              const items = Array.isArray(parsedData.response) ? parsedData.response : [];
              console.log("Found all items:", items.length);
              resolve(items.map((item: any) => ({
                id: item.uuid || item._id,
                title: item.title,
                notes: item.description || "",
                created_at: item.createdAt || null,
                completed_at: item.completedAt || null,
                due_date: item.dueDate && item.dueDate !== "Invalid Date" ? item.dueDate : null,
              })));
            } else {
              console.log("No items found");
              resolve([]);
            }
          } catch (parseError) {
            console.error("Failed to parse all items response:", parseError);
            reject(new Error("Failed to parse response"));
          }
        } else {
          console.error("Failed to fetch all items:", res.statusCode, responseData);
          reject(new Error(`Failed to fetch all items: ${res.statusMessage || 'Unknown error'}`));
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

export async function searchObjects(query: string): Promise<MarchItem[]> {
  return new Promise((resolve, reject) => {
    const preferences = getPreferenceValues<{ accessToken: string }>();
    console.log("Making request to /api/items/search");

    const options = {
      hostname: API_HOST,
      path: `/api/items/search?q=${encodeURIComponent(query)}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.accessToken}`,
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(responseData);
            console.log("Search response:", parsedData);
            
            if (parsedData.response) {
              const items = Array.isArray(parsedData.response) ? parsedData.response : [];
              console.log("Found search results:", items.length);
              resolve(items.map((item: any) => ({
                id: item.uuid || item._id,
                title: item.title,
                notes: item.description,
                created_at: item.createdAt,
                completed_at: item.completedAt,
                due_date: item.dueDate,
              })));
            } else {
              console.log("No search results found");
              resolve([]);
            }
          } catch (parseError) {
            console.error("Failed to parse search response:", parseError);
            reject(new Error("Failed to parse response"));
          }
        } else {
          reject(new Error(`Failed to search objects: ${res.statusMessage}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}
