import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomer,
} from "../../redux/slices/customerSlice";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { FaSearch} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customers);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const menuRef = useRef();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.first_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (customer.last_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const toggleCustomer = (id) => {
    setSelectedCustomers((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      setSelectAll(newSet.size === filteredCustomers.length);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers(new Set());
      setSelectAll(false);
    } else {
      setSelectedCustomers(
        new Set(filteredCustomers.map((c) => c.customer_id))
      );
      setSelectAll(true);
    }
  };

  const confirmDelete = (id) => {
    setCustomerToDelete(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    dispatch(deleteCustomer(customerToDelete));
    setShowModal(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="bg-white rounded shadow mt-4">
          <div className="px-5 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Customers</h2>
            <button
              onClick={() => navigate("/customers/add")}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              + Add Customer
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

          <table className="w-full table-fixed border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-tableHeader text-xs font-normal uppercase">
                <th className="pl-10 w-1/4 align-middle">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                    <span>NAME</span>
                  </div>
                </th>
                <th className="p-2 w-1/6 text-center align-middle">
                  MOBILE NO
                </th>
                <th className="p-2 w-1/4 text-center align-middle">EMAIL</th>
                <th className="p-2 w-1/4 text-center align-middle">ADDRESS</th>
                <th className="p-2 w-1/12 text-center align-middle">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="hover:bg-gray-50 relative"
                  >
                    <td className="pl-10 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.has(customer.customer_id)}
                          onChange={() => toggleCustomer(customer.customer_id)}
                        />
                        <span className="text-indigo-700 font-mono tracking-wide">
                          {customer.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      {customer.mobile_number}
                    </td>
                    <td className="p-2 text-center">{customer.email}</td>
                    <td className="p-2 text-center">{customer.address}</td>
                    <td className="p-2 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === customer.customer_id
                              ? null
                              : customer.customer_id
                          )
                        }
                        className="text-gray-600 hover:text-black text-lg"
                      >
                        ⋮
                      </button>
                      {openMenuId === customer.customer_id && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-8 bg-white border rounded shadow-md z-10 w-28"
                        >
                          <button
                            onClick={() => {
                              navigate(
                                `/customers/edit/${customer.customer_id}`
                              );
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmDelete(customer.customer_id);
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this customer?
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

export default CustomerList;
