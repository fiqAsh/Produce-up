import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserInfo from "../components/UserInfo";
import { useAuthStore } from "../stores/useAuthStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import UserNotifications from "../components/UserNotifications";
import ApplyForManager from "../components/ManagerApplication";
import ApplyForDeliveryman from "../components/DeliveryManApplication";
import HandleManager from "../components/HandleManager";
import HandleDeliveryman from "../components/HandleDeliveryman";

const Profile = () => {
  const { user } = useAuthStore();
  const { getNotifications, notifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState("info");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isAdmin = user?.user?.role === "admin";
  const isManager = user?.user?.role === "manager";

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <hr />

      {/* User Info */}
      <div className="w-full bg-white py-4 px-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold text">Hello, {user.user.name}</h2>

        <p className="text">
          Joined on{" "}
          {new Date(user.user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <hr />

      {/* {tabs section} */}

      <div className="w-4/5 mx-auto bg-base-100 mt-6 p-4 border border-gray-300 rounded-lg shadow-sm">
        <div className="flex justify-center space-x-6 pb-3">
          {/* Profile tab (Always visible) */}
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "info"
                ? "text border-b-2 border-accent-content"
                : "text-warning hover:text-warning-content"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "notifications"
                ? "text border-b-2 border-accent-content"
                : "text-warning hover:text-warning-content"
            }`}
          >
            Notifications
            {unreadCount > 0 && (
              <div className="badge badge-xs badge-secondary ml-1 rounded ">
                {unreadCount}
              </div>
            )}
          </button>
          {!isAdmin && !isManager && (
            <>
              <button
                onClick={() => setActiveTab("managerRequest")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "managerRequest"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Apply for Manager
              </button>
              <button
                onClick={() => setActiveTab("deliverymanRequest")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "deliverymanRequest"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Apply for DeliveryMan
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("handlemanager")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "handlemanager"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Manager Requests
              </button>
            </>
          )}
          {isManager && (
            <>
              <button
                onClick={() => setActiveTab("handledeliveryman")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "handledeliveryman"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Delivery Man Requests
              </button>
            </>
          )}
        </div>

        {/* tabcontent */}

        <div className="mt-6">
          {activeTab === "info" && <UserInfo user={user} />}

          {activeTab === "notifications" && (
            <UserNotifications userId={user.user._id} />
          )}
          {!isAdmin && !isManager && (
            <>
              {activeTab === "managerRequest" && <ApplyForManager />}
              {activeTab === "deliverymanRequest" && <ApplyForDeliveryman />}
            </>
          )}
          {isAdmin && activeTab === "handlemanager" && <HandleManager />}
          {isManager && activeTab === "handledeliveryman" && (
            <HandleDeliveryman />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
