import { useState } from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentContainer from "./DocumentContainer";

export default function DocumentList() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const props = { showAlert, setShowAlert, showSuccess, setShowSuccess, alertMessage, setAlertMessage };
  const { showAlert: _, showSuccess: __, alertMessage: ___, ...headerProps } = props;

  return (
    <div className="flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]">
      <DocumentHeader {...headerProps} />
      <DocumentContainer {...props} />
    </div>
  );
}
