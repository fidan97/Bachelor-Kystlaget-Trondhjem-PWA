import { useSignal } from "@preact/signals-react";
import React, { useEffect } from "react";
import Button from "../Button";
import { listUsers } from "../../api/user/listUsers";
import Typography from "../Typography";
import { authToken } from "../../store/authToken";
import Loading from "../Loading";

const UsersTable = () => {
  const dummyUsers = [
    {
      id: "3003be8c-092d-463e-8591-8c43ec7c690f",
      name: "Test",
      phone: "92506202",
      email: "stringG@gmail.com",
      roles: ["Member"],
      numberOfBookings: 0,
      isActive: true,
    },
  ];
  const allUser = useSignal([]);
  const selectedRole = useSignal(null);
  const statusMessage = useSignal(null);
  const isFetching = useSignal(false);

  // get all users details
  const getAllUser = async () => {
    isFetching.value = true;
    try {
      allUser.value = dummyUsers;
      const res = await listUsers();
      if (!res.ok) {
        throw Error("Failed to fetch");
      }
      const data = await res.json();
      console.log(res);
      allUser.value = data.items;
    } catch (error) {
      console.log(error);
    } finally {
      isFetching.value = false;
    }
  };
  useEffect(() => {
    getAllUser();
  }, []);

  const handleUpdate = async (user) => {
    if (!selectedRole.value) return;
    try {
      statusMessage.value = `Updating role of ${user.name}`;
      await fetch(`/api/User/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.value}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email,
          isActive: true,
          role: selectedRole.value,
          bookingIDs: [0],
        }),
      });
      statusMessage.value = `Role updated for ${user.name}`;
      getAllUser();
    } catch (error) {
      console.log(error);
      statusMessage.value = error.message;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-4  p-4 rounded-xl bg-container_light dark:bg-container_dark shadow">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-primary-100">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-primary-100">
            A list of all the users including their name, title, email and role.
          </p>
        </div>
      </div>
      <div className="mt-4 flow-root">
        {statusMessage.value ? (
          <Typography
            size="body2/normal"
            className="text-center dark:text-primary-100"
          >
            {statusMessage.value}
          </Typography>
        ) : null}
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {!isFetching.value ? (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 dark:text-primary-100"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-primary-100"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">update</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {allUser.value.map((user, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 dark:text-primary-100">
                        {user.name}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-primary-100">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-primary-100">
                        <select
                          title="select role"
                          className="pr-2 dark:bg-container_dark"
                          defaultValue={user.roles[0]}
                          onChange={(e) =>
                            (selectedRole.value = e.target.value)
                          }
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                        </select>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Button
                          type="button"
                          className="!text-xs !p-1.5"
                          onClick={() => handleUpdate(user)}
                        >
                          Update Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Loading loadingText={"loading"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
