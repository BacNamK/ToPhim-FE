import type { UsersResponse, UserItem } from "../types";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const get_users = async (page: number = 1): Promise<UsersResponse> => {
  const response = await fetch(`${baseUrl}/manage/users?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
};

export const search_users = async (username: string): Promise<UserItem[]> => {
  const response = await fetch(`${baseUrl}/manage/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Failed to search users");
  }

  const data = await response.json();
  return data.users || [];
};
