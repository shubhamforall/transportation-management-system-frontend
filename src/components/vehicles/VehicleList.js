import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../redux/slices/vehicleSlice";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VehicleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector((state) => state.vehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredVehicles.map((v) => v.vehicle_id);
      setSelectedVehicles(allIds);
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectVehicle = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="bg-white rounded shadow mt-4 mx-6 my-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Vehicles</h2>
            <button
              onClick={() => navigate("/vehicles/add")}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              + Add Vehicle
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
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
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100 text-tableHeader text-xs font-normal uppercase">
                <th className="pl-10 w-1/4 align-middle text-left">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={
                        filteredVehicles.length > 0 &&
                        selectedVehicles.length === filteredVehicles.length
                      }
                      onChange={handleSelectAll}
                    />
                    <span>NAME</span>
                  </div>
                </th>
                <th className="p-2 w-1/5 text-center align-middle">NUMBER</th>
                <th className="p-2 w-1/6 text-center align-middle">TYPE</th>
                <th className="p-2 w-1/6 text-center align-middle">MODEL</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.vehicle_id} className="hover:bg-gray-50">
                    <td className="pl-10 py-2 align-middle text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(vehicle.vehicle_id)}
                          onChange={() => handleSelectVehicle(vehicle.vehicle_id)}
                        />
                        <span className="text-indigo-700 font-mono tracking-wide">
                          {vehicle.vehicle_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-center align-middle">{vehicle.vehicle_number}</td>
                    <td className="p-2 text-center align-middle">{vehicle.vehicle_type}</td>
                    <td className="p-2 text-center align-middle">{vehicle.vehicle_model}</td>
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

export default VehicleList;
