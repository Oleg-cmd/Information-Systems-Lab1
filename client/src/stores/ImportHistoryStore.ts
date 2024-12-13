// stores/ImportHistoryStore.ts
import { makeAutoObservable } from "mobx";
import axiosInstance from "../instance/axiosInstance";
import { toast } from "react-toastify";
import userStore from "./UserStore";

export interface ImportHistory {
  id: number;
  userId: number;
  status: "SUCCESS" | "ERROR";
  successCount: number;
  timestamp: string;
}

class ImportHistoryStore {
  history: ImportHistory[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortField: keyof ImportHistory = "timestamp";
  sortDirection: "asc" | "desc" = "desc";
  filterStatus: "" | "SUCCESS" | "ERROR" | "all" = "all";
  filterUserId: string = "";

  constructor() {
    makeAutoObservable(this);
    this.fetchHistory();
  }

  async fetchHistory() {
    this.loading = true;
    try {
      const endpoint =
        userStore.user?.role === "ADMIN"
          ? "/import-history/all"
          : `/user/${userStore.user?.id}/import-history`;
      const response = await axiosInstance.get(endpoint);
      this.history = response.data;
    } catch (error) {
      toast.error("Failed to fetch import history");
      console.error("Error fetching import history:", error);
    } finally {
      this.loading = false;
    }
  }

  sortHistory(field: keyof ImportHistory) {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortField = field;
      this.sortDirection = "asc";
    }
  }

  filterHistory() {
    return this.history.filter(
      (item) =>
        (this.filterStatus === "all" || item.status === this.filterStatus) &&
        (this.filterUserId === "" ||
          item.userId.toString() === this.filterUserId)
    );
  }

  getCurrentHistory() {
    const filteredHistory = this.filterHistory();
    const sortedHistory = [...filteredHistory].sort((a, b) => {
      if (a[this.sortField] < b[this.sortField])
        return this.sortDirection === "asc" ? -1 : 1;
      if (a[this.sortField] > b[this.sortField])
        return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return sortedHistory.slice(indexOfFirstItem, indexOfLastItem);
  }

  paginate(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  setFilterStatus(status: "" | "SUCCESS" | "ERROR" | "all") {
    this.filterStatus = status;
  }

  setFilterUserId(userId: string) {
    this.filterUserId = userId;
  }
}

const importHistoryStore = new ImportHistoryStore();
export default importHistoryStore;
