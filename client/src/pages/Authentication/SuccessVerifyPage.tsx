import { useEffect } from 'react';
import Logo from '../../assets/DSV.logo.png';
import SuccessVerify from "../../assets/verify-success.png";
import { useNavigate } from "react-router-dom";
export default function VerifyEmail() {
  useEffect(()=>{
    localStorage.removeItem('email');
  });
  const navigate = useNavigate();
  return(
    <div>
      <div className="w-[100vw] h-[64px] flex gap-[4px] shadow-md-custom bg-white border-[0.5px]  border-[#E3E8EF]" >
        <div className="w-[300px] h-[100%] pl-[24px] flex items-center justify-start gap-[12px]">
          <img src={Logo} className='w-[32px] h-[32px]'></img>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[628px] h-[346px] absolute top-[184px] gap-[24px] flex flex-col justify-center items-center">
          <img src={SuccessVerify} className="w-[192px] h-[192px]"></img>
          <p className="w-[398px] h-[38px] text-center leading-[1.2] text-[rgba(30,30,30,1)] text-[32px] font-bold">Well Done!!</p>
          <p className="text-[18px] leading-[1.4] text-[400]">You have verifies your email successfully</p>
          <button onClick={()=>navigate('/document/documentlist') } className="w-[316px] h-[38px] rounded-[8px] border-[1px] font-[600] text-center items-center p-[6px] hover:bg-[#e6b800] bg-[rgba(245,199,49,1)]">
            Go to my Document
          </button>
        </div>
      </div>
      
    </div>
  )
}