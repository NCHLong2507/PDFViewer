import UploadButton from "./Uploadbutton"
interface DocumentHeaderProps {
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
}
export default function DocumentHeader({ setShowAlert, setShowSuccess, setAlertMessage }: DocumentHeaderProps) {
  return (
    <div className="h-[52px] w-full flex justify-between items-center py-[8px]">
      <div className="w-[322px] h-[38px] flex gap-[12px]">
        <strong className="w-[190px] h-full text-[28px] flex justify-center items-center font-bold">My Document</strong>
        <div className="w-[1px] h-full bg-[rgba(227,232,239,1)]"></div>
        <div className="flex items-center justify-start">
          <p className="w-[68px] h-[26px] leading-[1.4] text-[14px] text-[rgba(117,117,117,1)] flex justify-start items-center text-center">Total 78</p>
        </div>
      </div>
      <UploadButton setShowAlert={setShowAlert} setShowSuccess={setShowSuccess} setAlertMessage={setAlertMessage}/>
    </div>
  )
}