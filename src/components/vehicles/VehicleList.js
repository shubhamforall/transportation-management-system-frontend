import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, deleteVehicle } from "../../redux/slices/vehicleSlice";
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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    dispatch(fetchVehicles());
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
    (vehicle.vehicle_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (id) => {
    setVehicleToDelete(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    dispatch(deleteVehicle(vehicleToDelete));
    setShowModal(false);
    setVehicleToDelete(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="bg-white rounded shadow mt-4">
          <div className="px-5 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Vehicle</h2>
            <button
              onClick={() => navigate("/vehicles/add")}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              + Add Vehicle
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
                        filteredVehicles.length > 0 &&
                        selectedVehicles.length === filteredVehicles.length
                      }
                      onChange={handleSelectAll}
                    />
                    <span>NAME</span>
                  </div>
                </th>
                <th className="p-2 w-1/5 text-center">NUMBER</th>
                <th className="p-2 w-1/6 text-center">TYPE</th>
                <th className="p-2 w-1/6 text-center">MODEL</th>
                <th className="p-2 w-1/12 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.vehicle_id}
                    className="hover:bg-gray-50 relative"
                  >
                    <td className="pl-10 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(
                            vehicle.vehicle_id
                          )}
                          onChange={() =>
                            handleSelectVehicle(vehicle.vehicle_id)
                          }
                        />
                        <span className="text-indigo-700 font-mono tracking-wide">
                          {vehicle.vehicle_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      {vehicle.vehicle_number}
                    </td>
                    <td className="p-2 text-center">{vehicle.vehicle_type}</td>
                    <td className="p-2 text-center">{vehicle.vehicle_model}</td>
                    <td className="p-2 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === vehicle.vehicle_id
                              ? null
                              : vehicle.vehicle_id
                          )
                        }
                        className="text-gray-600 hover:text-black text-lg"
                      >
                        ⋮
                      </button>
                      {openMenuId === vehicle.vehicle_id && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-8 bg-white border rounded shadow-md z-10 w-28"
                        >
                          <button
                            onClick={() => {
                              navigate(`/vehicles/edit/${vehicle.vehicle_id}`);
                              setOpenMenuId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmDelete(vehicle.vehicle_id);
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this vehicle?
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

export default VehicleList;
