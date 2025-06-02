import { FaBell, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName); 

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-200 flex justify-between items-center p-4 shadow-md">
      {/* Logo - Hidden on Mobile */}
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-headerText text-transparent bg-clip-text tracking-wide drop-shadow-md hidden sm:block">
        Vishal Transportations
      </h2>

      {/* Right Section */}
      <div className="flex items-center ml-auto">
        {/* Bell Icon - Hidden on Small Screens */}
        <FaBell className="mr-4 text-gray-600 hidden sm:block" size={20} />

        {/* User Info */}
        <div className="flex items-center mr-4">
          <FaUserCircle className="text-gray-600 mr-2" size={22} />
          <span className="font-semibold">{fullName || "Guest"}</span>
        </div>

        {/* Logout Button - Hidden on Mobile */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 text-white rounded hidden sm:block"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
