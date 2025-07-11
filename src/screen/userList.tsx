import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/ui/loader";
import { deleteUser, getAllUsers } from "@/redux/user.slice";
import type { User } from "@/redux/user.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  UsersIcon,
  UserIcon,
  EnvelopeIcon,
  TrashIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function UsersList() {
  const getAllUsersState = useSelector(
    (state: RootState) => state.getAllUsersReducer,
  );
  const deleteUserState = useSelector(
    (state: RootState) => state.deleteUserReducer,
  );
  const { users, loading, error } = getAllUsersState;
  const { loading: deleteLoading } = deleteUserState;

  const dispatch = useDispatch<AppDispatch>();

  const getUserId = (user: User): string => {
    return String(user.id || "N/A");
  };

  const getDisplayUserId = (user: User): string => {
    const id = getUserId(user);
    if (id === "N/A") return id;
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const resultAction = await dispatch(deleteUser(userId));
        if (deleteUser.fulfilled.match(resultAction)) {
          console.log("User deleted successfully");
          dispatch(getAllUsers());
        } else {
          console.error("Failed to delete user:", resultAction.payload);
          alert("Failed to delete user. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <UsersIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Unable to load users
          </h2>
          <p className="mb-4 text-gray-600">
            Something went wrong while fetching the users.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Users Management
          </h1>
          <p className="text-gray-600">
            Manage registered users and their accounts
          </p>
        </div>

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="hidden lg:block">
            <div className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                User ID
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Name
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Email
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Actions
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((user: User) => {
                  const userId = getUserId(user);
                  return (
                    <div
                      key={userId}
                      className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <IdentificationIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="truncate font-mono text-sm text-gray-900">
                          {getDisplayUserId(user)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="truncate text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="truncate text-sm text-gray-700">
                          {user.email}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDeleteUser(userId)}
                          disabled={deleteLoading}
                          className="flex items-center text-sm text-red-600 transition-colors hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete User"
                        >
                          <TrashIcon className="mr-1 h-4 w-4" />
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <UsersIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <div className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((user: User) => {
                  const userId = getUserId(user);
                  return (
                    <div
                      key={userId}
                      className="p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center">
                            <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="truncate text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                          <div className="mb-1 flex items-center">
                            <IdentificationIcon className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="truncate font-mono text-xs text-gray-500">
                              ID: {getDisplayUserId(user)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDeleteUser(userId)}
                            disabled={deleteLoading}
                            className="flex items-center text-sm text-red-600 transition-colors hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <TrashIcon className="mr-1 h-4 w-4" />
                            {deleteLoading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="truncate text-sm text-gray-700">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <UsersIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
