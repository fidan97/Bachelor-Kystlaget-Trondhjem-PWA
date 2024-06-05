import React, { useEffect, useRef } from "react";
import { isDarkMode } from "../store/darkMode";
import Menubar from "../components/Menubar";
import Topbar from "../components/Topbar";
import Typography from "../components/Typography";
import Input from "../components/Input";
import Button from "../components/Button";
import { HiOutlineUser, HiOutlinePencil, HiOutlineMail } from "react-icons/hi";
import { FiPhoneCall } from "react-icons/fi";
import Select from "../components/Select";
import { useSignal } from "@preact/signals-react";
import { BiLogOutCircle } from "react-icons/bi";
import { authToken } from "../store/authToken";
import user from "../api/user";
import { langMode, languages } from "../store/langMode";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { BsCameraFill } from "react-icons/bs";
import Loading from "../components/Loading";
import { convertToBase64 } from "../utils/convertToBase64";
import UsersTable from "../components/UsersTable";

const Profile = () => {
  const readOnlyInputId = useSignal(null);
  const formRef = useRef(null);
  const isLoading = useSignal(false);
  const errorMessage = useSignal(null);
  const { i18n } = useTranslation("translation");
  const isProfileUpdated = useSignal(false);

  const isUploading = useSignal(false);
  const uploadErrorMessage = useSignal(null);

  const uploadImage = async (selectedImage, base64Data) => {
    const myServerUrl = import.meta.env.VITE_PUBLIC_MYSERVER_URL;
    const username = user.data.value?.name;
    const userid = user.data.value?.id;
    try {
      isUploading.value = true;
      const response = await fetch(
        `${myServerUrl}/api/image-upload/${userid}/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: {
              name: selectedImage.name,
              type: selectedImage.type,
              data: base64Data,
            },
          }),
        }
      );
      const data = await response.json();
      user.refetch();
    } catch (error) {
      console.log(error);
      uploadErrorMessage.value = "Unable to upload image";
    } finally {
      isUploading.value = false;
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    uploadImage(file, base64);
  };

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
      isProfileUpdated.value = true;
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
    authToken.value = null;
    localStorage.removeItem("token");
  };

  const handleLang = (e) => {
    langMode.value = e;
    i18n.changeLanguage(e.value);
    localStorage.setItem("lang", JSON.stringify(e));
  };

  return (
    <div className={`w-full sm:max-w-calc ml-auto bg-gradient-to-b`}>
      <Menubar />
      <div className="w-full flex flex-col gap-8 p-8 mb-20 sm:mb-12">
        <Topbar />

        <div
          className={`flex flex-col gap-4  p-4 rounded-xl bg-container_light dark:bg-container_dark shadow`}
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
              {!isUploading.value ? (
                <img
                  src={user.image.value || "/images/placeholderUser.svg"}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Loading />
              )}
              <label
                htmlFor="file"
                className="block absolute right-0 -bottom-2 p-1.5 cursor-pointer rounded-full bg-primary-600 text-white"
              >
                <BsCameraFill />
                <input
                  type="file"
                  id="file"
                  onChange={handleFileSelect}
                  hidden
                  accept="image/png, image/jpg, image/jpeg"
                />
              </label>
            </div>

            {uploadErrorMessage.value ? (
              <Typography variant="error" className="my-4">
                {uploadErrorMessage.value}
              </Typography>
            ) : null}

            <Typography
              size="h6/bold"
              variant={isDarkMode.value ? "darkModeOn" : ""}
            >
              {user.data.value?.name}
            </Typography>
          </div>
          <form onSubmit={handleSave} ref={formRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              <Input
                type="text"
                name="full_name"
                label={t("Full Name")}
                defaultValue={user.data.value?.name}
                leftAdornment={<HiOutlineUser />}
                rightAdornment={<HiOutlinePencil />}
                readOnlyInputId={readOnlyInputId}
              />

              <Input
                type="tel"
                name="phone"
                label={t("Phone Number")}
                defaultValue={user.data.value?.phone}
                leftAdornment={<FiPhoneCall />}
                rightAdornment={<HiOutlinePencil />}
                readOnlyInputId={readOnlyInputId}
              />
              <Input
                type="email"
                name="email"
                label={t("Email")}
                defaultValue={user.data.value?.email}
                leftAdornment={<HiOutlineMail />}
                rightAdornment={<HiOutlinePencil />}
                readOnlyInputId={readOnlyInputId}
              />

              <Select
                name="language"
                label={"Language"}
                options={languages}
                defaultValue={langMode.value}
                placeholder="Select language"
                onChange={handleLang}
              />
            </div>
            {isProfileUpdated.value ? (
              <Typography className="my-2 text-teritary-600">
                {t("Your recent changes has been saved")}
              </Typography>
            ) : null}
            <Button
              type="submit"
              variant="secondary"
              title="submit"
              className="capitalize !rounded-3xl !px-6 !text-primary-600 bg-gradient-to-t from-secondary-500 to-secondary-200"
              disabled={!readOnlyInputId.value}
            >
              {isLoading.value ? t("Saving...") : t("Save")}
            </Button>
          </form>
          {errorMessage.value ? (
            <Typography variant="error" className="my-4">
              {errorMessage.value}
            </Typography>
          ) : null}
        </div>

        {user.data.value?.role === "Admin" ? <UsersTable /> : null}
      </div>
    </div>
  );
};

export default Profile;
