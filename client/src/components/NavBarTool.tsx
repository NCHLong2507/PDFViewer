import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";

export default function NavBarTool() {

  const {userInfor, logout} = useAuth();
  const [isMenuOpen, setIsMenuOpen]  = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  }

return (
  <>
    {userInfor && (
      <div className="flex-1 h-full flex justify-end items-center gap-[32px]">
        <div className="w-full h-auto pr-[24px] gap-[16px] flex justify-end items-center">
          <div className="h-full w-[280px] flex justify-end items-center gap-[16px]">
            <div className="leading-[1.4] text-base text-[rgba(30, 30, 30, 1)]">
              {`Good morning, ${userInfor.name}`}
            </div>
            <div className="w-[1px] h-[40px] bg-[rgba(227,232,239,1)]"></div>
              <div className="relative">
                <div
                  className="cursor-pointer w-[40px] h-[40px] rounded-full border border-[rgba(227,232,239,1)] p-[4px] flex items-center justify-center"
                  onClick={()=>setIsMenuOpen((prev) => !prev)}
                >
                  <FaRegCircleUser className="w-6 h-6" />
                </div>

                {isMenuOpen && (
                  <div className="absolute top-[44px] right-0 z-50 w-[190px] h-[62px] rounded-lg bg-white border-[1px] border-[rgba(217,217,217,1)] menudropdown">
                    <div className="w-[180px] h-full flex items-center justify-center">
                      <button
                      onClick={handleLogout}
                      className="w-[148px] text-left px-4 py-3 text-[rgba(30,30,30,1)] hover:bg-[rgba(245,245,245,1)] transition-colors duration-200"
                      >
                       Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}