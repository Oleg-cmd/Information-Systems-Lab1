// src/stores/UserStore.ts
import { makeAutoObservable } from "mobx";
import { loginUser } from "../api/login";
import { User } from "../types/User";

class UserStore {
  user: User | null = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.loadUser();
  }

  getUserId() {
    return this.user?.id;
  }

  // Load user from localStorage
  loadUser() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser); // Parse and set user
      this.isAuthenticated = true; // Set authentication status
    }
  }

  async login(username: string, password: string, role: string): Promise<void> {
    try {
      const user = await loginUser(username, password, role);
      this.user = user;
      this.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed");
      }
    }
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;

    // Remove user from localStorage
    localStorage.removeItem("user");
  }
}

const userStore = new UserStore();
export default userStore;
