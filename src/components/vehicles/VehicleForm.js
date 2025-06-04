import { useState } from "react";
import { useDispatch } from "react-redux";
import { addVehicle } from "../../redux/slices/vehicleSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const VehicleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_name: "",
    vehicle_number: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_color: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [topErrors, setTopErrors] = useState([]);

  const validate = () => {
    let newErrors = {};
    let errorMessages = [];

    if (!formData.vehicle_name.trim()) {
      newErrors.vehicle_name = "Vehicle name is required";
      errorMessages.push("Please enter the vehicle name.");
    }

    if (!formData.vehicle_number.trim()) {
      newErrors.vehicle_number = "Vehicle number is required";
      errorMessages.push("Please enter the vehicle number.");
    } else if (
      !formData.vehicle_number.match(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/)
    ) {
      newErrors.vehicle_number =
        "Enter a valid vehicle number (e.g., MH12AB1234)";
      errorMessages.push(
        "Vehicle number must be in format like MH12AB1234."
      );
    }

    if (!formData.vehicle_type.trim()) {
      newErrors.vehicle_type = "Vehicle type is required";
      errorMessages.push("Please enter the vehicle type.");
    }

    const currentYear = new Date().getFullYear();
    const modelYear = parseInt(formData.vehicle_model);
    if (!formData.vehicle_model) {
      newErrors.vehicle_model = "Model year is required";
      errorMessages.push("Please enter the model year.");
    } else if (isNaN(modelYear) || modelYear < 1900 || modelYear > currentYear) {
      newErrors.vehicle_model = `Model year must be between 1900 and ${currentYear}`;
      errorMessages.push(`Model year must be between 1900 and ${currentYear}.`);
    }

    if (!formData.vehicle_color.trim()) {
      newErrors.vehicle_color = "Colour is required";
      errorMessages.push("Please enter the colour.");
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
    if (!validate()) return;

    try {
      await dispatch(addVehicle(formData)).unwrap();
      navigate("/vehicles");
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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full h-full px-6 py-4 bg-white shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-6">Add Vehicle</h2>

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
            {/* Vehicle Name */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={handleChange}
                placeholder="Enter vehicle name"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Vehicle Number */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                placeholder="Enter vehicle number"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Vehicle Type */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                placeholder="Enter type (SUV, Sedan, etc.)"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Model Year */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Model Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="Enter model year"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Colour */}
            <div className="w-1/2 flex items-center space-x-4">
              <label className="w-40">
                Colour <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicle_color"
                value={formData.vehicle_color}
                onChange={handleChange}
                placeholder="Enter colour"
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="w-1/2 flex space-x-5">
              <button
                type="submit"
                className="px-5 py-2 rounded bg-activeNavigationMenu text-white hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate("/vehicles")}
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

export default VehicleForm;
