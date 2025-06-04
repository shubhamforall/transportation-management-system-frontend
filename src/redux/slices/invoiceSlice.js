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
      return response.data;
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
      const response = await API.patch(`/invoice/${invoiceId}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update invoice status"
      );
    }
  }
);

// Delete invoice
export const deleteInvoice = createAsyncThunk(
  "invoices/delete",
  async (invoiceId, { rejectWithValue }) => {
    try {
      await API.delete(`/invoice/${invoiceId}`);
      return invoiceId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete invoice"
      );
    }
  }
);

const initialState = {
  invoices: [],
  paidCount: 0,
  unpaidCount: 0,
  totalPaid: 0,
  totalUnpaid: 0,
  loading: false,
  error: null,
  successMessage: "",
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // === Fetch Invoices ===
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        const invoices = action.payload?.data?.list || [];
        state.invoices = invoices;

        const paid = invoices.filter((inv) => inv.status === "PAID");
        const unpaid = invoices.filter((inv) => inv.status === "PENDING");

        state.paidCount = paid.length;
        state.unpaidCount = unpaid.length;

        state.totalPaid = paid.reduce(
          (acc, inv) => acc + (Number(inv.total) || 0),
          0
        );
        state.totalUnpaid = unpaid.reduce(
          (acc, inv) => acc + (Number(inv.total) || 0),
          0
        );
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Create Invoice ===
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const newInvoice = action.payload.invoice;
        const amount = Number(newInvoice.total) || 0;

        state.invoices.push(newInvoice);
        state.successMessage = action.payload.message;

        if (newInvoice.status === "PAID") {
          state.paidCount += 1;
          state.totalPaid += amount;
        } else {
          state.unpaidCount += 1;
          state.totalUnpaid += amount;
        }
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Update Invoice Status ===
      .addCase(updateInvoiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInvoice = action.payload;

        // Make sure updatedInvoice has invoice_id
        const index = state.invoices.findIndex(
          (inv) => inv.invoice_id === updatedInvoice.invoice_id
        );

        if (index !== -1) {
          const oldInvoice = state.invoices[index];
          const oldAmount = Number(oldInvoice.total) || 0;

          // Adjust counts and totals based on old status
          if (oldInvoice.status === "PAID") {
            state.paidCount -= 1;
            state.totalPaid -= oldAmount;
          } else if (oldInvoice.status === "PENDING") {
            state.unpaidCount -= 1;
            state.totalUnpaid -= oldAmount;
          }

          // Replace with updated invoice (make sure updatedInvoice is complete)
          state.invoices[index] = updatedInvoice;

          // Adjust counts and totals based on new status
          const newAmount = Number(updatedInvoice.total) || 0;
          if (updatedInvoice.status === "PAID") {
            state.paidCount += 1;
            state.totalPaid += newAmount;
          } else if (updatedInvoice.status === "PENDING") {
            state.unpaidCount += 1;
            state.totalUnpaid += newAmount;
          }
        }
      })

      .addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Delete Invoice ===
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        const index = state.invoices.findIndex((inv) => inv.id === id);

        if (index !== -1) {
          const removed = state.invoices[index];
          const amount = Number(removed.total) || 0;

          if (removed.status === "PAID") {
            state.paidCount -= 1;
            state.totalPaid -= amount;
          } else if (removed.status === "PENDING") {
            state.unpaidCount -= 1;
            state.totalUnpaid -= amount;
          }

          state.invoices.splice(index, 1);
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = invoiceSlice.actions;
export default invoiceSlice.reducer;
