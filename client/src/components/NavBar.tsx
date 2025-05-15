import Logo from '../assets/DSV.logo.png';
import NavBarTool from './NavBarTool';

export default function NavBar() {
  return (
    <div className="w-[100vw] h-[64px] flex gap-[4px] shadow-md-custom bg-white border-[0.5px]  border-[#E3E8EF]" >
      <div className="w-[300px] h-[100%] pl-[24px] flex items-center justify-start gap-[12px]">
        <img src={Logo} className='w-[32px] h-[32px]'></img>
      </div>
      <NavBarTool/>
    </div>
  )
}