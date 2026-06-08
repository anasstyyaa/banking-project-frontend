import { defineStore } from "pinia";
import EmployeeService from "@/services/employee.service";

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    pending: { items: [], totalElements: 0, totalPages: 1 },
    active: { items: [], totalElements: 0, totalPages: 1 },
    isLoading: false,
    isProcessingApproval: false,
    isCreatingAccount: false,
  }),

  actions: {
    async fetchPending({ page = 0, size = 8, search = '' } = {}) {
      this.isLoading = true;
      try {
        const res = await EmployeeService.getRegistrations('PENDING', { page, size, search });
        this.pending = { items: res.data.content, totalElements: res.data.totalElements, totalPages: res.data.totalPages };
      } finally { this.isLoading = false; }
    },

    async fetchActive({ page = 0, size = 8, search = '' } = {}) {
      this.isLoading = true;
      try {
        const res = await EmployeeService.getRegistrations('APPROVED', { page, size, search });
        this.active = { items: res.data.content, totalElements: res.data.totalElements, totalPages: res.data.totalPages };
      } finally { this.isLoading = false; }
    },

    async updateRegistrationStatus(id, payload, refresh) {
      if (this.isProcessingApproval) return;
      this.isProcessingApproval = true;
      try {
        await EmployeeService.updateRegistrationStatus(id, payload);
        if (refresh) await refresh();
      } finally {
        this.isProcessingApproval = false;
      }
    },
    async createCustomerAccount(userId, payload) {
      if (this.isCreatingAccount) return;
      this.isCreatingAccount = true;

      try {
        const response = await EmployeeService.createCustomerAccount(
          userId,
          payload,
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
