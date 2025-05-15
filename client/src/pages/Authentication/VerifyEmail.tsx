import NavBar from "../../components/NavBar";
import EmailBox from "../../assets/email-box.png";

export default function VerifyEmail() {
  return(
    <div>
      <NavBar/>
      <div className="flex justify-center items-center">
        <div className="w-[628px] h-[346px] absolute top-[184px] gap-[24px] flex flex-col justify-center items-center">
          <img src={EmailBox} className="w-[192px] h-[192px]"></img>
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">Verify your email address</p>
          <p className="text-[16px] leading-[1.4] text-[400]">We’ve just sent a verification email to <span className="text-[600]">${`abc123@gmail.com .`}</span>Please check your inbox</p>
          <p className="text-[16px] leading-[1.4] text-[400]">Didn’t receive an email? <a className="font-bold text-yellow-500 inline"> Resend Verification Link</a></p>

          
        </div>
      </div>
      
    </div>
  )
}