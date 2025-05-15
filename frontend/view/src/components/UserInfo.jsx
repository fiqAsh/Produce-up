import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import Loading from "./Loading";
import MapComponent from "./MapComponent";
import { useAuthStore } from "../stores/useAuthStore";

const UserInfo = () => {
  const { user } = useAuthStore();
  const { updateUser, loading } = useUserStore();
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user.name || "",
        email: user.user.email || "",
        password: "",

        phone: user.user.phone || "",

        latitude: user.user.latitude || null,
        longitude: user.user.longitude || null,
      });
    }
  }, [user]);
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["phone"].includes(name) ? (value ? Number(value) : "") : value,
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
      const res = await updateUser(formData);
      setMessage("Profile updated successfully!");

      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
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
        <div className="col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="btn w-full btn-primary "
            onClick={handleSubmit}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
