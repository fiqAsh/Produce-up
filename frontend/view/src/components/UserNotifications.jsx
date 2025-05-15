import React, { useEffect } from "react";
import { useNotificationStore } from "../stores/useNotificationStore";
import Loading from "./Loading";

const UserNotifications = () => {
  const { notifications, loading } = useNotificationStore();

  useEffect(() => {
    useNotificationStore.getState().getNotifications();
  }, []);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex justify-between items-center border p-4 rounded ${
              notification.isRead
                ? "bg-gray-300 text-gray-700"
                : "bg-white text-black"
            }`}
          >
            <div>
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserNotifications;
