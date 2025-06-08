import { useState } from "react";
import useField from "../../../hooks/useField";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isValidEmail } from "../../../pages/Authentication/Authentication";
import { useAuth } from "../../../context/AuthContext";
import { setIsLoading } from "../../../store/documentDetailSlice/documentDetailSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
interface LoginFormProps {
  setGoogleError: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LoginForm({ setGoogleError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const emailField = useField("");
  const passwordField = useField("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, setUserInfor } = useAuth();

  const handleSignIn = async () => {
    let hasError = false;
    if (!emailField.value.trim()) {
      emailField.setError(t("auth.mandatoryField"));
      hasError = true;
    } else if (!isValidEmail(emailField.value)) {
      emailField.setError(t("auth.invalidEmail"));
      hasError = true;
    }
    if (!passwordField.value.trim()) {
      passwordField.setError(t("auth.mandatoryField"));
      hasError = true;
    }
    if (!hasError) {
      try {
        dispatch(setIsLoading(true));
        const result = await login(emailField.value, passwordField.value);
        if (result && result.success) {
          setUserInfor(result.user);
          const redirectPath =
            localStorage.getItem("redirectAfterLogin") ||
            "/document/documentlist";
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        } else {
          if (result && result.statusCode === 409) {
            setLoginError(t("auth.loginAccountGoogleError"));
          } else setLoginError(t("auth.incorrectEmailOrPassword"));
          emailField.setError("");
          passwordField.setError("");
        }
      } catch (err) {
        console.error("Login error:", err);
        setLoginError(t("An error occurred. Please try again."));
      } finally {
        dispatch(setIsLoading(false));
      }
    }
  };
  return (
    <form
      id="form-login"
      className="w-full min-h-[160px] flex flex-col gap-[16px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
    >
      <div className="w-full flex flex-col gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          Email
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <input
          {...emailField.bind}
          onChange={(e) => {
            emailField.bind.onChange(e);
            setLoginError("");
            setGoogleError(false);
          }}
          className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white
                ${
                  emailField.error || loginError
                    ? "border-[1.5px] border-[rgba(144,11,9,1)]"
                    : "border border-[#D9D9D9]"
                }`}
          placeholder={t("auth.inputEmail")}
        />
        {emailField.error && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {emailField.error}
          </p>
        )}
      </div>

      <div className="w-[100%] flex flex-col gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          {t("auth.password")}
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <div className="relative">
          <input
            {...passwordField.bind}
            onChange={(e) => {
              passwordField.bind.onChange(e);
              setLoginError("");
              setGoogleError(false);
            }}
            type={showPassword ? "text" : "password"}
            className={`py-[12px] pr-[40px] pl-[16px] h-[40px]   rounded-[8px] min-w-[240px] bg-white w-full 
                  ${
                    passwordField.error || loginError
                      ? "border-[1.5px] border-[rgba(144,11,9,1)]"
                      : "border border-[#D9D9D9]"
                  }`}
            placeholder={t("auth.inputPassword")}
          />
          <button
            type="button"
            className="absolute right-[12px] top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        {passwordField.error && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {passwordField.error}
          </p>
        )}
        {loginError && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {loginError}
          </p>
        )}
      </div>
    </form>
  );
}
