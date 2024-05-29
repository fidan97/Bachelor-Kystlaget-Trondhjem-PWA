import { signal } from "@preact/signals-react";
import { authToken } from "../../store/authToken";
import { googleLogout } from "@react-oauth/google";

class User {
  state = signal("loading");
  data = signal(null);

  constructor() {
    // initially call user
    this.refetch();
  }

  async refetch() {
    try {
      // user is logged in
      // const response = await fetch(
      //   `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${authToken.value}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${authToken.value}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const response = await fetch(`/api/User/Profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.value}`,
        },
        credentials: "include",
      });
      if (response.status === 401) {
        return (
          // googleLogout(),
          (authToken.value = null), localStorage.removeItem("token")
        );
      }
      const data = await response.json();
      this.data.value = data;
      this.state.value = "authenticated";
    } catch (response) {
      const errorJson = response.toJSON?.();
      // user is unauthenticated
      if (errorJson.status === 401) {
        this.state.value = "unauthenticated";
      }
    }
  }

  async updateUser({ name, phone, email, role, bookingIDs }) {
    const userId = this.data.value?.id;
    const response = await fetch(`/api/User/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.value}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        phone,
        email,
        role,
        bookingIDs,
        isActive: true,
      }),
    });
    return response;
  }
}

const user = new User();

export default user;
