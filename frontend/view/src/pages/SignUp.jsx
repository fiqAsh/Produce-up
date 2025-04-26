import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

import MapComponent from "../components/MapComponent";

const SignUp = () => {
  const navigate = useNavigate();

  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    latitude: null,
    longitude: null,
  });

  const [message, setMessage] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["phone"].includes(name) ? Number(value) || "" : value,
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(formData);
      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        latitude: null,
        longitude: null,
      });
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="grid grid-cols-2 gap-4">
          {/* left section */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="text-black border-2 rounded-lg p-2 shadow-sm"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="text-black border-2 rounded-lg p-2 shadow-sm"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* right section */}
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              className="text-black border-2 rounded-lg p-2 shadow-sm"
              required
              name="password"
              value={formData.password}
              min={6}
              onChange={handleChange}
            />
            <div className="flex items-center border-2 rounded-lg p-2 shadow-sm">
              <span className="text-gray-500 pr-2">+880</span>
              <input
                type="text"
                placeholder="1XXXXXXXXX"
                className="text-black flex-1 outline-none"
                required
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  // Remove non-numeric characters
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length > 10) value = value.slice(0, 10);

                  setFormData({ ...formData, phone: value });
                }}
              />
            </div>
          </div>
        </form>

        {/* map section */}
        <div className="mt-6">
          <h3
            className="text-lg font-semibold mb-2 cursor-pointer text-blue-500 hover:underline"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Hide Map" : "Select Your Location"}
          </h3>
          {showMap && (
            <div className="mt-4">
              <MapComponent onLocationSelect={handleLocationSelect} />
            </div>
          )}
        </div>
        {/* submit button */}
        <div className="flex flex-col items-center mt-6">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 w-full"
            type="submit"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <p className="mt-2 text-sm">
            Already signed up? Log in ➡{" "}
            <a href="/" className="text-blue-500 hover:underline">
              LOGIN
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
