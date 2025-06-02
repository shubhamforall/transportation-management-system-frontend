import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../redux/slices/customerSlice";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

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
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
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

          {/* Search Bar */}
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

          {/* Table */}
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
                <th className="p-2 w-1/3 text-center align-middle">ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="pl-10 w-1/4 text-left align-middle">
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
                    <td className="p-2 w-1/6 text-center align-middle">
                      {customer.mobile_number}
                    </td>
                    <td className="p-2 w-1/4 text-center align-middle">
                      {customer.email}
                    </td>
                    <td className="p-2 w-1/3 text-center align-middle">
                      {customer.address}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
