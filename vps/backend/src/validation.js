import { z } from 'zod';

export const userProfileSchema = z.enum(['Knight', 'Hornet']);

export const moodSchema = z.enum(['happy', 'sad', 'angry', 'neutral', 'peaceful']);

export const patchBenchSchema = z.object({
  user: userProfileSchema,
  resting: z.boolean(),
});

export const createNoteSchema = z.object({
  text: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  author: userProfileSchema,
  timestamp: z.string().min(1).optional(),
});

export const updateNoteSchema = z
  .object({
    liked: z.boolean().optional(),
    comments: z.array(z.any()).optional(),
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: 'At least one field is required',
  });

export const calendarQuerySchema = z.object({
  user: userProfileSchema,
  year: z.coerce.number().int().min(1970).max(2100),
});

export const upsertCalendarSchema = z.object({
  user: userProfileSchema,
  mood: moodSchema.optional().nullable(),
  journal: z.string().optional().nullable(),
});
