import EmptyNetwork from '../../assets/empty_network.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function NoPermissionPage() {
  const navigate = useNavigate();
  const {userInfor} = useAuth();
  return(
    <div>
      <div className="flex justify-center items-center">
        <div className="w-[1028px] h-[346px] absolute top-[200px] gap-[24px] p-6 flex justify-center items-center">
          <img src={EmptyNetwork} className="w-[270px] h-[270px]"></img>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-start'>
              <p className='font-[700] leading-[1.2] text-5xl'>Oops,</p>
            </div>
            <p className='leading-[1.2] text-3xl'>You don't have permisson to access this file</p>
            <p>You are signed in as <span className='inline font-bold'>{userInfor?.email}</span></p>

            <button onClick={()=>navigate('/document/documentlist') } className="w-[190px] h-[40px] rounded-[8px] border-[1px] font-[600] text-center items-center p-[8px] bg-gray-300 hover:bg-gray-400 mt-10">
             Back to my Document
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  )
}