import React, { useRef } from "react";
import { isDarkMode } from "../store/darkMode";
import Menubar from "../components/Menubar";
import Topbar from "../components/Topbar";
import Typography from "../components/Typography";
import Input from "../components/Input";
import { BsCameraFill } from "react-icons/bs";
import Button from "../components/Button";
import { HiOutlineUser, HiOutlinePencil, HiOutlineMail } from "react-icons/hi";
import { FiPhoneCall } from "react-icons/fi";
import Select from "../components/Select";
import { useSignal } from "@preact/signals-react";
import { BiLogOutCircle } from "react-icons/bi";
import { googleLogout } from "@react-oauth/google";
import { authToken } from "../store/authToken";
import user from "../api/user";
import { langMode } from "../store/langMode";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const readOnlyInputId = useSignal(null);
  const formRef = useRef(null);
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const { i18n } = useTranslation("translation");

  const handleSave = async (e) => {
    e.preventDefault();
    isLoading.value = true;
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { full_name, email, phone } = formDataObj;

        const res = await user.updateUser({
          name: full_name.toString(),
          email: email.toString(),
          phone: phone.toString(),
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleLogout = () => {
    // googleLogout();
    authToken.value = null;
    localStorage.removeItem("token");
  };

  const handleLang = (e) => {
    langMode.value = e.target.value;
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", JSON.stringify(langMode.value));
  };

  return (
    <div
      className={`w-full sm:max-w-calc ml-auto bg-gradient-to-b ${
        isDarkMode.value
          ? "from-gray-800 to-slate-950"
          : "from-gray-300 to-slate-400"
      }   `}
    >
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <form
          className={`flex flex-col gap-4  p-4 rounded-xl ${
            isDarkMode.value ? "bg-primary-700" : "bg-white"
          } `}
          onSubmit={handleSave}
          ref={formRef}
        >
          <div className="w-full flex flex-col items-center justify-center gap-2 my-4 relative">
            <Button
              type="button"
              variant="icon"
              title={"Logout".toUpperCase()}
              className="text-primary-50 w-10 h-10 bg-teritary-600 block sm:hidden absolute top-0 right-0 !rounded-full"
              onClick={handleLogout}
            >
              <BiLogOutCircle className="w-full h-full" />
            </Button>
            <div className="relative w-20 h-20 border-2 rounded-full">
              <img
                src={"/images/placeholderUser.svg"}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
              {/* <Button
                variant="icon"
                className="absolute right-0 -bottom-2 !rounded-full bg-primary-600 text-white"
              >
                <BsCameraFill />
              </Button> */}
            </div>
            <Typography
              size="h6/bold"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {user.data.value?.name}
            </Typography>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              name="full_name"
              label="Full Name"
              defaultValue={user.data.value?.name}
              placeholder="Full Name"
              leftAdornment={<HiOutlineUser />}
              rightAdornment={<HiOutlinePencil />}
              readOnlyInputId={readOnlyInputId}
            />

            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              defaultValue={user.data.value?.phone}
              placeholder="Phone number"
              leftAdornment={<FiPhoneCall />}
              rightAdornment={<HiOutlinePencil />}
              readOnlyInputId={readOnlyInputId}
            />
            <Input
              type="email"
              name="email"
              label="Email "
              defaultValue={user.data.value?.email}
              placeholder="Email"
              leftAdornment={<HiOutlineMail />}
              rightAdornment={<HiOutlinePencil />}
              readOnlyInputId={readOnlyInputId}
            />

            <Select
              name="language"
              label={"Language"}
              options={[
                { label: "English", value: "en" },
                { label: "Norwegian", value: "no" },
              ]}
              defaultValue={langMode.value}
              onClick={handleLang}
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            className="capitalize !rounded-xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
          >
            {isLoading.value ? "Please wait..." : "Save"}
          </Button>
          {errorMessage.value ? (
            <Typography variant="error" className="my-4">
              {errorMessage.value}
            </Typography>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default Profile;
