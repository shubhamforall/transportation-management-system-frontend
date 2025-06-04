import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import HomePage from "../pages/Home";
import CustomerList from "../components/customers/CustomerList";
import CustomerForm from "../components/customers/CustomerForm";
import VehicleList from "../components/vehicles/VehicleList";
import VehicleForm from "../components/vehicles/VehicleForm";
import InvoiceList from "../components/invoices/InvoiceList";
import InvoiceForm from "../components/invoices/InvoiceForm";
import PaymentList from "../components/payments/PaymentList";
import Dashboard from "../components/dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/add" element={<CustomerForm />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/vehicles/add" element={<VehicleForm />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/add" element={<InvoiceForm />} />
        <Route path="/payments" element={<PaymentList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
