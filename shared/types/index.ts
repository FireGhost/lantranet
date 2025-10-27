import z from "zod";

export const LanAnimationSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  adminUser: z.number(),
  lanDay: z.number(),
  startTime: z.string(),
});
export type LanAnimation = z.infer<typeof LanAnimationSchema>;

export const NewLanDaySchema = z.object({
  name: z.string().nonempty("String must not be empty"),
});
export type NewLanDay = z.infer<typeof NewLanDaySchema>;

export type SubscribePost = {
  subscribe: boolean;
};

export type TeamScorePost = {
  teamId: number;
  score: number;
};

export type PlayerScorePost = {
  playerId: number;
  score: number;
};

export const UserLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});
export type UserLogin = z.infer<typeof UserLoginSchema>;

export type CartItem = {
  menuItemId: number;
  name: string;
  price: number;
  comment: string;
};
