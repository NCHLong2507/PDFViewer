import NavBar from "../../components/NavBar";
import EmailBox from "../../assets/email-box.png";
import { useSearchParams } from "react-router-dom";
import api from '../../api/axios'; 
import { Toaster } from "react-hot-toast";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = localStorage.getItem('email');
  const user_id = searchParams.get('user_id');
  const handleResendEmail = async () => {
    try {
       await api.get(`/auth/resendEmail?user_id=${user_id}`)
    } catch(err) {
      const error = err as any;
      console.log(error);
    }
  }

  return(
    <div>
      <Toaster />
      <NavBar/>
      <div className="flex justify-center items-center">
        <div className="w-[688px] h-[346px] absolute top-[184px] gap-[24px] flex flex-col justify-center items-center">
          <img src={EmailBox} className="w-[192px] h-[192px]"></img>
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">Verify your email address</p>
          <p className="text-[16px] leading-[1.4] text-[400]">We’ve just sent a verification email to <span className="text-[600]">{`${email}.`}</span> Please check your inbox</p>
          <p className="text-[16px] leading-[1.4] text-[400]">Didn’t receive an email? <button onClick={handleResendEmail} className="font-bold text-yellow-500 hover:underline inline"> Resend Verification Link</button></p>
        </div>
      </div>
      
    </div>
  )
}