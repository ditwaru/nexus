import { User } from "@/app/lib/types";

export const hasPermission = (user: User | null, tableName: string) => {
  if (!user || !user.groups) return false;
  return user.groups.includes(tableName);
};
