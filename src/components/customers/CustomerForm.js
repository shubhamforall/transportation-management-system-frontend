import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../redux/slices/customerSlice";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const CustomerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // customer_type: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const [topErrors, setTopErrors] = useState([]);

  const validateForm = () => {
    const newErrors = {};
    const errorMessages = [];

    // if (!formData.customer_type.trim()) {
    //   newErrors.customer_type = "Customer type is required";
    //   errorMessages.push("Please select the customer type.");
    // }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
      errorMessages.push("Please enter the first name.");
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
      errorMessages.push("Please enter the last name.");
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
      errorMessages.push("Please enter the mobile number.");
    } else if (!/^[0-9]{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
      errorMessages.push("Mobile number must be exactly 10 digits.");
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      errorMessages.push("Please enter the email.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      errorMessages.push("Please enter a valid email address.");
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      errorMessages.push("Please enter the address.");
    }

    setErrors(newErrors);
    setTopErrors(errorMessages);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setGeneralError("");
    setTopErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(addCustomer(formData)).unwrap();
      navigate("/customers");
    } catch (error) {
      let newErrors = {};
      if (error.error?.errors?.length) {
        const collectedMessages = [];
        error.error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
            collectedMessages.push(err.message);
          }
        });
        setTopErrors(collectedMessages);
      } else if (error.message) {
        setGeneralError(error.message);
      }
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full h-full px-6 py-4 bg-white shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-6">New Customer</h2>

          {topErrors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <ul className="list-disc pl-5">
                {topErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {generalError && <p className="text-red-500 mb-4">{generalError}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Type */}
            <div className="w-1/2  flex items-center space-x-4">
              <label className="w-40">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-8">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customer_type"
                    value="Business"
                    // checked={formData.customer_type === "Business"}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Business</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customer_type"
                    value="Individual"
                    // checked={formData.customer_type === "Individual"}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Individual</span>
                </label>
              </div>
            </div>

            {/* First Name */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Last Name */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mobile Number */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter 10-digit number"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div className="w-1/2 flex items-start space-x-4">
              <label className="w-40 pt-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="w-1/2 flex  space-x-5">
              <button
                type="submit"
                className="px-5 py-2 rounded bg-activeNavigationMenu text-white hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="px-5 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
