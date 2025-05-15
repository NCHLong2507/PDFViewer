import NavBar from "../../components/NavBar";
import SuccessVerify from "../../assets/verify-success.png";

export default function VerifyEmail() {
  return(
    <div>
      <NavBar/>
      <div className="flex justify-center items-center">
        <div className="w-[628px] h-[346px] absolute top-[184px] gap-[24px] flex flex-col justify-center items-center">
          <img src={SuccessVerify} className="w-[192px] h-[192px]"></img>
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">Well Done!!</p>
          <p className="text-[16px] leading-[1.4] text-[400]">You have verifies your email successfully</p>
          <button className="w-[309px] h-[38px] rounded-[8px] border-[1px] text-center items-center p-[12px] bg-[rgba(245,199,49,1)]">
            Go to my Document
          </button>
        </div>
      </div>
      
    </div>
  )
}