import { Comment, DailyData, MoodType, Note, UserProfile } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const restBase = `${supabaseUrl}/rest/v1`;

const authHeaders = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${restBase}${path}`, {
    ...init,
    headers: {
      ...authHeaders,
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST error (${res.status}): ${text}`);
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export const supabaseApi = {
  async getBenchStatus(): Promise<Record<UserProfile, boolean>> {
    const rows = await request<Array<{ knight_resting: boolean; hornet_resting: boolean }>>(
      '/bench_status?id=eq.1&select=knight_resting,hornet_resting'
    );

    const row = rows[0];
    return {
      Knight: row?.knight_resting ?? false,
      Hornet: row?.hornet_resting ?? false,
    };
  },

  async updateBenchStatus(user: UserProfile, resting: boolean): Promise<void> {
    const payload = user === 'Knight' ? { knight_resting: resting } : { hornet_resting: resting };
    await request('/bench_status?id=eq.1', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: { Prefer: 'return=minimal' },
    });
  },

  async getNotes(): Promise<Note[]> {
    const rows = await request<Array<{
      id: string;
      text: string;
      image_url: string | null;
      liked: boolean;
      timestamp_text: string;
      author: UserProfile;
      comments: Comment[] | null;
    }>>('/notes?select=id,text,image_url,liked,timestamp_text,author,comments&order=created_at.desc');

    return rows.map((item) => ({
      id: item.id,
      text: item.text,
      imageUrl: item.image_url || undefined,
      liked: item.liked,
      timestamp: item.timestamp_text,
      author: item.author,
      comments: item.comments || [],
    }));
  },

  async createNote(input: { text: string; imageUrl?: string | null; author: UserProfile; timestamp?: string }): Promise<Note> {
    const timestamp = input.timestamp || new Date().toLocaleString();

    const rows = await request<Array<{
      id: string;
      text: string;
      image_url: string | null;
      liked: boolean;
      timestamp_text: string;
      author: UserProfile;
      comments: Comment[] | null;
    }>>('/notes?select=id,text,image_url,liked,timestamp_text,author,comments', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        text: input.text,
        image_url: input.imageUrl || null,
        liked: false,
        timestamp_text: timestamp,
        author: input.author,
        comments: [],
      }),
    });

    const created = rows[0];
    return {
      id: created.id,
      text: created.text,
      imageUrl: created.image_url || undefined,
      liked: created.liked,
      timestamp: created.timestamp_text,
      author: created.author,
      comments: created.comments || [],
    };
  },

  async deleteNote(id: string): Promise<void> {
    await request(`/notes?id=eq.${id}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
  },

  async updateNote(id: string, patch: Partial<{ liked: boolean; comments: Comment[] }>): Promise<void> {
    await request(`/notes?id=eq.${id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
    });
  },

  async getCalendarEntries(currentUser: UserProfile, year: number): Promise<Record<string, DailyData>> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const rows = await request<Array<{ entry_date: string; mood: MoodType | null; journal: string | null }>>(
      `/calendar_entries?user_profile=eq.${currentUser}&entry_date=gte.${startDate}&entry_date=lte.${endDate}&select=entry_date,mood,journal`
    );

    const map: Record<string, DailyData> = {};
    rows.forEach((entry) => {
      map[entry.entry_date] = {
        mood: entry.mood || undefined,
        journal: entry.journal || undefined,
      };
    });

    return map;
  },

  async upsertCalendarEntry(currentUser: UserProfile, date: string, data: DailyData): Promise<void> {
    await request('/calendar_entries?on_conflict=user_profile,entry_date', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        user_profile: currentUser,
        entry_date: date,
        mood: data.mood || null,
        journal: data.journal || null,
      }),
    });
  },
};
