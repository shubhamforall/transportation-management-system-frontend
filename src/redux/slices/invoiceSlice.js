import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// Fetch all invoices
export const fetchInvoices = createAsyncThunk(
  "invoices/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/invoice");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch invoices"
      );
    }
  }
);

// Create a new invoice
export const createInvoice = createAsyncThunk(
  "invoices/create",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await API.post("/invoice", invoiceData);
      return response.data; // Response contains success message and invoice data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create invoice"
      );
    }
  }
);

// Update invoice status
export const updateInvoiceStatus = createAsyncThunk(
  "invoices/updateStatus",
  async ({ invoiceId, status }, { rejectWithValue }) => {
    try {
      const properStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      const response = await API.patch(`/invoice/${invoiceId}`, {
        status: properStatus,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update invoice status"
      );
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [],
    paidCount: 0,
    unpaidCount: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    loading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        const invoiceList = action.payload?.data?.list || [];
        state.invoices = invoiceList;

        // Calculate PAID and PENDING counts
        state.paidCount = invoiceList.filter(
          (inv) => inv.status === "PAID"
        ).length;
        state.unpaidCount = invoiceList.filter(
          (inv) => inv.status === "PENDING"
        ).length;

        // Calculate total PAID and PENDING amounts
        state.totalPaid = invoiceList
          .filter(
            (inv) =>
              inv.status === "PAID" &&
              typeof inv.total === "number" &&
              !isNaN(inv.total)
          )
          .reduce((acc, inv) => acc + inv.total, 0);

        state.totalUnpaid = invoiceList
          .filter(
            (inv) =>
              inv.status === "PENDING" &&
              typeof inv.total === "number" &&
              !isNaN(inv.total)
          )
          .reduce((acc, inv) => acc + inv.total, 0);
      })

      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.invoices.push(action.payload.invoice);

        const invoiceAmount = Number(action.payload.invoice.amount) || 0;

        if (action.payload.invoice.status === "PAID") {
          state.paidCount += 1;
          state.totalPaid += invoiceAmount;
        } else {
          state.unpaidCount += 1;
          state.totalUnpaid += invoiceAmount;
        }
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Invoice Status
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.invoices.findIndex((inv) => inv.id === updated.id);
        if (index !== -1) {
          const prevStatus = state.invoices[index].status;
          state.invoices[index] = updated;

          const invoiceAmount = Number(updated.amount) || 0;

          if (prevStatus === "PAID") {
            state.paidCount -= 1;
            state.totalPaid -= invoiceAmount;
          } else if (prevStatus === "PENDING") {
            state.unpaidCount -= 1;
            state.totalUnpaid -= invoiceAmount;
          }

          if (updated.status === "PAID") {
            state.paidCount += 1;
            state.totalPaid += invoiceAmount;
          } else if (updated.status === "PENDING") {
            state.unpaidCount += 1;
            state.totalUnpaid += invoiceAmount;
          }
        }
      })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = invoiceSlice.actions;
export default invoiceSlice.reducer;
