import { z } from "zod";

// Shared memory for storage and database
const globalForMock = globalThis as any;

if (!globalForMock.mockStorage) {
  globalForMock.mockStorage = new Map<string, { bytes: Uint8Array; contentType: string }>();
}
if (!globalForMock.mockDb) {
  globalForMock.mockDb = {
    credits: [] as any[],
    uploads: [] as any[],
  };
}

export const mockDb = globalForMock.mockDb as { credits: any[]; uploads: any[] };

export const mockStorage = {
  async set(key: string, value: { bytes: Uint8Array; contentType: string }) {
    globalForMock.mockStorage.set(key, value);
  },
  async get(key: string) {
    return globalForMock.mockStorage.get(key) || null;
  }
};

// Initialize mock credits if they don't exist
export function initMockCredits(userId: string) {
  const existing = mockDb.credits.find((c) => c.user_id === userId);
  if (!existing) {
    mockDb.credits.push({
      user_id: userId,
      plan: "free",
      daily_used: 0,
      daily_limit: 5,
      pack_credits: 0,
      daily_reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}



const MOCK_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "user@example.com",
  user_metadata: {},
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

const MOCK_SESSION = {
  access_token: "mock-access-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: "mock-refresh-token",
  user: MOCK_USER,
};

class MockQueryBuilder {
  table: string;
  filters: Record<string, any> = {};
  orderByField?: string;
  orderByAscending?: boolean;
  limitCount?: number;
  insertData?: any;
  updateData?: any;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string) {
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByField = column;
    this.orderByAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  insert(values: any) {
    this.insertData = values;
    return this;
  }

  update(values: any) {
    this.updateData = values;
    return this;
  }

  private execute() {
    let dataList = mockDb[this.table as "credits" | "uploads"] || [];

    // Handle inserts
    if (this.insertData) {
      const itemsToInsert = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const inserted = itemsToInsert.map((item) => {
        const newItem = {
          id: item.id || crypto.randomUUID?.() || Math.random().toString(36).substring(2, 12),
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          ...item,
        };
        dataList.push(newItem);
        return newItem;
      });
      return inserted;
    }

    // Handle updates
    if (this.updateData) {
      const matched = dataList.filter((item) => {
        for (const [k, v] of Object.entries(this.filters)) {
          if (item[k] !== v) return false;
        }
        return true;
      });
      matched.forEach((item) => {
        Object.assign(item, this.updateData, { updated_at: new Date().toISOString() });
      });
      return matched;
    }

    // Handle selects
    let filtered = dataList.filter((item) => {
      for (const [k, v] of Object.entries(this.filters)) {
        if (item[k] !== v) return false;
      }
      return true;
    });

    if (this.orderByField) {
      const field = this.orderByField;
      const asc = this.orderByAscending ? 1 : -1;
      filtered.sort((a, b) => {
        if (a[field] < b[field]) return -1 * asc;
        if (a[field] > b[field]) return 1 * asc;
        return 0;
      });
    }

    if (this.limitCount !== undefined) {
      filtered = filtered.slice(0, this.limitCount);
    }

    // Deep clone to prevent direct mutations of db records on subsequent operations
    return JSON.parse(JSON.stringify(filtered));
  }

  // Promise-like behavior (thenable)
  async then(onfulfilled?: (value: any) => any) {
    const data = this.execute();
    const result = { data, error: null };
    return onfulfilled ? onfulfilled(result) : result;
  }

  async maybeSingle() {
    const data = this.execute();
    return { data: data.length > 0 ? data[0] : null, error: null };
  }

  async single() {
    const data = this.execute();
    if (data.length === 0) {
      return { data: null, error: { message: "Row not found in mock DB" } };
    }
    return { data: data[0], error: null };
  }
}

export function createMockSupabaseClient() {
  const getSessionFromStorage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mock_supabase_session");
      if (stored) {
        try {
          const session = JSON.parse(stored);
          initMockCredits(session.user.id);
          return session;
        } catch (_) {}
      }
    }
    return null;
  };

  const getSessionUser = () => {
    const s = getSessionFromStorage();
    return s ? s.user : null;
  };

  return {
    auth: {
      signUp: async ({ email, password }: any) => {
        const user = {
          ...MOCK_USER,
          id: "mock-user-" + Math.random().toString(36).substring(2, 10),
          email,
        };
        const token = `mock-token:${user.id}`;
        const session = { ...MOCK_SESSION, access_token: token, user };
        if (typeof window !== "undefined") {
          localStorage.setItem("mock_supabase_session", JSON.stringify(session));
        }
        initMockCredits(user.id);
        return { data: { user, session }, error: null };
      },

      signInWithPassword: async ({ email, password }: any) => {
        const user = {
          ...MOCK_USER,
          id: "mock-user-" + Math.random().toString(36).substring(2, 10),
          email,
        };
        const token = `mock-token:${user.id}`;
        const session = { ...MOCK_SESSION, access_token: token, user };
        if (typeof window !== "undefined") {
          localStorage.setItem("mock_supabase_session", JSON.stringify(session));
        }
        initMockCredits(user.id);
        return { data: { user, session }, error: null };
      },

      getSession: async () => {
        return { data: { session: getSessionFromStorage() }, error: null };
      },

      getUser: async () => {
        return { data: { user: getSessionUser() }, error: null };
      },

      onAuthStateChange: (callback: any) => {
        const session = getSessionFromStorage();
        setTimeout(() => {
          callback("SIGNED_IN", session);
        }, 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },

      signOut: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("mock_supabase_session");
        }
        return { error: null };
      },

      resetPasswordForEmail: async (email: string) => {
        return { error: null };
      },

      updateUser: async ({ password }: any) => {
        return { error: null };
      },

      getClaims: async (token: string) => {
        let userId = "mock-user-id";
        if (token && token.startsWith("mock-token:")) {
          userId = token.split(":")[1];
        }
        return {
          data: {
            claims: {
              sub: userId,
              email: "user@example.com",
              role: "authenticated",
            },
          },
          error: null,
        };
      },
    },

    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File | Blob, options?: any) => {
          let bytes: Uint8Array;
          if (file instanceof Blob) {
            bytes = new Uint8Array(await file.arrayBuffer());
          } else {
            bytes = file as any;
          }
          await mockStorage.set(path, { bytes, contentType: options?.contentType || file.type || "application/octet-stream" });
          return { data: { path }, error: null };
        },

        download: async (path: string) => {
          const file = await mockStorage.get(path);
          if (!file) {
            return { data: null, error: new Error(`File not found: ${path}`) };
          }
          const blob = new Blob([file.bytes], { type: file.contentType });
          return { data: blob, error: null };
        },

        createSignedUrl: async (path: string, expiry: number) => {
          const file = await mockStorage.get(path);
          if (!file) {
            return { data: null, error: new Error(`File not found: ${path}`) };
          }
          const blob = new Blob([file.bytes], { type: file.contentType });
          const signedUrl = URL.createObjectURL(blob);
          return { data: { signedUrl }, error: null };
        },
      }),
    },

    from: (table: string) => {
      return new MockQueryBuilder(table);
    },
  };
}
