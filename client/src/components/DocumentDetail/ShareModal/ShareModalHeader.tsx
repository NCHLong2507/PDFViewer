import { useTranslation } from "react-i18next";
import type { Document } from "../../../interface/document";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setEmailInput,
  setMatchedUser,
} from "../../../store/documentDetailSlice/shareModalSlice";
import { isValidEmail } from "../../../pages/Authentication";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import documentDetailService from "../../../services/documentDetailService";

interface ShareModalHeaderProps {
  document: Document;
  action: string[] | undefined;
}

export default function ShareModalHeader({
  document,
  action,
}: ShareModalHeaderProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const emailInput = useSelector(
    (state: RootState) => state.docDetail.shareModal.emailInput
  );

  const debouncedFindUserByEmail = useMemo(
    () =>
      debounce(async (input: string) => {
        const email = input.trim().toLowerCase();
        if (email === "") {
          dispatch(setMatchedUser(null));
          return;
        }
        if (!isValidEmail(email)) {
          dispatch(setMatchedUser(null));
          return;
        }
        try {
          const result = await documentDetailService.findByEmail(email);
          dispatch(
            setMatchedUser(
              result.data.user || {
                name: t("Unregistered User"),
                email,
                picture: "",
              }
            )
          );
        } catch (err) {
          console.log(err);
        }
      }, 500),
    [dispatch, t]
  );

  useEffect(() => {
    debouncedFindUserByEmail(emailInput);
    return () => {
      debouncedFindUserByEmail.cancel();
    };
  }, [emailInput]);

  return (
    <>
      <h2 className="leading-[1.2] font-[600] tracking-tighter text-[rgba(22, 28, 33, 1)] text-[26px] mb-4 truncate">
        {t("docDetail.share")} “<span>{document.name}</span>”
      </h2>

      <input
        type="text"
        value={emailInput}
        onChange={(e) => dispatch(setEmailInput(e.target.value))}
        placeholder={t("docDetail.addPeople")}
        disabled={!action?.includes("ADD")}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm focus:outline-none focus:ring focus:ring-blue-100"
      />
    </>
  );
}
