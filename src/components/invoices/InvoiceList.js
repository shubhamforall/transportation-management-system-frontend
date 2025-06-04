import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  deleteInvoice,
  updateInvoiceStatus,
} from "../../redux/slices/invoiceSlice";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoices);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredInvoices.map((inv) => inv.invoice_id);
      setSelectedInvoices(allIds);
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const confirmDelete = (id) => {
    setInvoiceToDelete(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    dispatch(deleteInvoice(invoiceToDelete));
    setShowModal(false);
    setInvoiceToDelete(null);
  };

  const handleStatusChange = (invoiceId, status) => {
    dispatch(updateInvoiceStatus({ invoiceId, status }));
  };

  const filteredInvoices = invoices.filter((inv) => {
    const name = inv.customer?.full_name?.toLowerCase() || "";
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="bg-white rounded shadow mt-4">
          <div className="px-5 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Invoices</h2>
            <button
              onClick={() => navigate("/invoices/add")}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              + Add Invoice
            </button>
          </div>

          <div className="px-8 mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 p-2 border w-full rounded"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100 text-tableHeader text-xs font-normal uppercase">
                <th className="pl-10 w-1/4 text-left">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={
                        filteredInvoices.length > 0 &&
                        selectedInvoices.length === filteredInvoices.length
                      }
                      onChange={handleSelectAll}
                    />
                    <span>Invoice</span>
                  </div>
                </th>
                <th className="p-2 w-1/5 text-center">Date</th>
                <th className="p-2 w-1/5 text-center">Customer</th>
                <th className="p-2 w-1/6 text-center">Amount</th>
                <th className="p-2 w-1/6 text-center">Status</th>
                <th className="p-2 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.invoice_id}
                    className="hover:bg-gray-50 relative"
                  >
                    <td className="pl-10 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(
                            invoice.invoice_id
                          )}
                          onChange={() =>
                            handleSelectInvoice(invoice.invoice_id)
                          }
                        />
                        <span className="text-indigo-700 font-mono tracking-wide">
                          IN:
                          {invoice.invoice_id
                            ? invoice.invoice_id.slice(-6).toUpperCase()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-center">{invoice.date}</td>
                    <td className="p-2 text-center">
                      {invoice.customer?.full_name || "—"}
                    </td>
                    <td className="p-2 text-center">
                      ₹{invoice.total}
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusChange(invoice.invoice_id, e.target.value)
                        }
                        className={`px-2 py-1 rounded font-medium cursor-pointer ${
                          invoice.status === "PAID"
                            ? "text-green-600"
                            : invoice.status === "PENDING"
                            ? "text-orange-500"
                            : "text-red-600"
                        }`}
                      >
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="UNPAID">UNPAID</option>
                      </select>
                    </td>
                    <td className="p-2 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === invoice.invoice_id
                              ? null
                              : invoice.invoice_id
                          )
                        }
                        className="text-gray-600 hover:text-black text-lg"
                      >
                        ⋮
                      </button>
                      {openMenuId === invoice.invoice_id && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-8 bg-white border rounded shadow-md z-10 w-28"
                        >
                          <button
                            onClick={() => {
                              navigate(`/invoices/edit/${invoice.invoice_id}`);
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmDelete(invoice.invoice_id);
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this invoice?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
