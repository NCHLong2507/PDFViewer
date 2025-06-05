import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useField from "../../../hooks/useField";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isValidEmail } from "../../../pages/Authentication/Authentication";
interface SignupFormProps {
  isChecked: boolean;
  setCheckError: React.Dispatch<React.SetStateAction<string>>;
  setGoogleError: React.Dispatch<React.SetStateAction<boolean>>;
  setGoogleErrorMesssage: React.Dispatch<React.SetStateAction<string>>;
}
export default function SignupForm({
  isChecked,
  setCheckError,
  setGoogleError,
  setGoogleErrorMesssage,
}: SignupFormProps) {
  const fullnameField = useField("");
  const emailField = useField("");
  const passwordField = useField("");
  const confirmPasswordField = useField("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitation_token = searchParams.get("invitation_token");
  const handleSignup = async () => {
    let hasError = false;
    if (!fullnameField.value.trim()) {
      fullnameField.setError(t("auth.mandatoryField"));
      hasError = true;
    }
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
    if (!confirmPasswordField.value.trim()) {
      confirmPasswordField.setError(t("auth.mandatoryField"));
      hasError = true;
    }
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        passwordField.setError(t("auth.passnotsame"));
        confirmPasswordField.setError(t("auth.passnotsame"));
        hasError = true;
      } else if (password.length < 8) {
        passwordField.setError(t("auth.minlengthpass"));
        confirmPasswordField.setError(t("auth.minlengthpass"));
        hasError = true;
      }
    }
    if (!isChecked) {
      setCheckError(t("auth.termerror"));
      hasError = true;
    }
    if (hasError) return;
    try {
      const result = await signup(
        {
          name: fullnameField.value,
          email: emailField.value,
          password: passwordField.value,
        },
        invitation_token
      );
      if (result && result.success) {
        navigate(`/verifyemail?user_id=${result.user_id}`);
      } else if (result.statusCode === 409) {
        emailField.setError(result.message as string);
      } else {
        setGoogleError(true);
        setGoogleErrorMesssage(result.message as string);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form
      id="form-signup"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
      className="w-full min-h-[336px] flex flex-col gap-[16px]"
    >
      <div className="w-full flex flex-col gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          {t("auth.fullName")}
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <input
          {...fullnameField.bind}
          onChange={(e) => {
            fullnameField.bind.onChange(e);
            setGoogleError(false);
          }}
          className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white
                 ${fullnameField.errorBorderClass}`}
          placeholder="Input full name"
        ></input>
        {fullnameField.error && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {fullnameField.error}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          Email
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <input
          {...emailField.bind}
          onChange={(e) => {
            emailField.bind.onChange(e);
            setGoogleError(false);
          }}
          className={`py-[12px] px-[16px] h-[40px]  rounded-[8px] min-w-[240px] bg-white 
              ${emailField.errorBorderClass}`}
          placeholder="Input email address"
        ></input>
        {emailField.error && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {emailField.error}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col  gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          {t("auth.password")}
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...passwordField.bind}
            onChange={(e) => {
              passwordField.bind.onChange(e);
              setGoogleError(false);
            }}
            className={`py-[12px] pr-[40px] pl-[16px] h-[40px] rounded-[8px] min-w-[240px] bg-white w-full
                    ${passwordField.errorBorderClass}`}
            placeholder="Input password"
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
      </div>
      <div className="w-[100%] flex flex-col gap-[8px] justify-between min-h-[70px]">
        <label className="leading-[1.4] h-[22px]">
          {t("auth.reconfirmPassword")}
          <span className="text-[#ff0101] ml-[4px]">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmpassword"
            type={showConfirmPassword ? "text" : "password"}
            {...confirmPasswordField.bind}
            onChange={(e) => {
              confirmPasswordField.bind.onChange(e);
              setGoogleError(false);
            }}
            className={`py-[12px] pr-[40px] pl-[16px] h-[40px] rounded-[8px] min-w-[240px] bg-white w-full
                    ${confirmPasswordField.errorBorderClass}`}
            placeholder="Re-confirm password"
          />
          <button
            type="button"
            className="absolute right-[12px] top-1/2 -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        {confirmPasswordField.error && (
          <p className="text-[rgba(144,11,9,1)] leading-[1.4] min-h-[20px] text-sm">
            {confirmPasswordField.error}
          </p>
        )}
      </div>
    </form>
  );
}
