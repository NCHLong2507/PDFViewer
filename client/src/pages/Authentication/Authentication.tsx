import { Outlet } from "react-router-dom";
import Logomark from '../../components/Logomark';

export default function Authentication() {

  return (
    <div className="bg-auth flex flex-row justify-between">
      <Logomark/>
      <Outlet/>
    </div>
  )
}