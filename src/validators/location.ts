import { z } from "zod";

export const LocationSchema = z.object({
  location: z.string().min(3),
});
