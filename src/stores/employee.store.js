import { defineStore } from "pinia";
import EmployeeService from "@/services/employee.service";

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    pendingUsers: [],
    activeUsers: [],
    isLoading: false,
    isProcessingApproval: false,
    isCreatingAccount: false,
  }),

  actions: {
    async fetchData() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const [pendingRes, activeRes] = await Promise.all([
          EmployeeService.getPendingRegistrations(),
          EmployeeService.getActiveCustomers(),
        ]);
        this.pendingUsers = pendingRes.data;
        this.activeUsers = activeRes.data;
      } catch (err) {
        console.error("Failed to sync employee store lists:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async approveUser(userId) {
      if (this.isProcessingApproval) {
        console.warn("Blocked a duplicate approveUser trigger for ID:", userId);
        return;
      }

      this.isProcessingApproval = true;
      try {
        await EmployeeService.approveUser(userId);
        await this.fetchData();
      } catch (err) {
        console.error("Error during employee approval execution process:", err);
      } finally {
        this.isProcessingApproval = false;
      }
    },

    async denyUser(userId) {
      try {
        await EmployeeService.denyUser(userId);
        await this.fetchData();
      } catch (err) {
        console.error("Error during employee deny execution process:", err);
      }
    },
    async createCustomerAccount(userId, accountType) {
      if (this.isCreatingAccount) return;
      this.isCreatingAccount = true;

      try {
        const response = await EmployeeService.createCustomerAccount(
          userId,
          accountType,
        );
        return response.data;
      } catch (err) {
        console.error(
          "Error during employee account generation action loop:",
          err,
        );
        throw err;
      } finally {
        this.isCreatingAccount = false;
      }
    },
  },
});
