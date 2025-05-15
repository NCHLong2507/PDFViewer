import Logo from '../assets/DSV.logo.png';
export default function Logomark() {
  return (
    <>
      <div className="w-[274px] h-[96px] gap-[16px] flex flex-col justify-between top-[386px] left-[80px] absolute">
        <div className="w-[129px] h-[40px] px-[12px] py-[4px] rounded-[4px] flex justify-center items-center bg-white">
          <img src={Logo} className='w-[32px] h-[32px]'></img>
          <p className='w-[69px] h-[28px] font-bold leading-[1.4] flex justify-center items-center'>DI-PDF</p>
        </div>
        <div className="flex flex-wrap h-[40px] w-full text-sm leading-[1.4]">
          <p className="text-[#B3B3B3]">A world where document collaboration is</p>
          <span className="font-bold text-[#F3F3F3]">fast, fun and easy</span>
        </div>
      </div>
    </>
  )
}