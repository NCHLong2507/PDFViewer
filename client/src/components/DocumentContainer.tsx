import EmptyDocument from '../assets/EmptyDocument.png';
import UploadButton from './Uploadbutton';
import { IoMdArrowDropdown, IoMdArrowDropup  } from "react-icons/io";
import { RiAlertLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { useState } from 'react';

export default function DocumentContainer() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);
  const isEmpty = false;
  const documents = [
    {
      fileName: "Letter of Acceptance of Payment Plan",
      ownerName: "Elton Le (You)",
      lastUpdatedDate: "Dec 22, 2025",
      lastUpdatedTime: "5:06:07AM"
    },
    {
      fileName: "Notice of Default on Settlement Offer",
      ownerName: "Savannah Nguyen",
      lastUpdatedDate: "Nov 14, 2024",
      lastUpdatedTime: "12:06:07PM"
    },
    // Thêm các dòng khác tương tự
  ];

   

  return (
    <section className="w-full h-[638px] flex justify-center items-center rounded-[12px] border-[1px] border-[rgba(217,217,217,1)]">
      {isEmpty ? (
        <div className="w-[232px] h-[308px] gap-[24px] flex flex-col items-center justify-center">
          <img src={EmptyDocument} className='w-[192px] h-[192px]' alt="Empty Document" />
          <p className="w-full h-[22px] leading-[1.4] text-base text-center text-[rgba(75,85,101,1)]">
            There is no document founded
          </p>
          <UploadButton />
        </div>
      ) : (
        <div className="overflow-x-auto w-full min-h-full bg-white rounded border border-gray-300">
          {
            showAlert && (
              <div className="absolute flex top-[670px] left-[1092px] w-[392px] bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-[8px] items-start gap-3" role="alert">
                <div className="pt-1">
                  <RiAlertLine className='w-5 h-5 text-red-600'/>
                </div>

                <div className="flex-1">
                  <strong className="font-bold block">Cannot Upload This File</strong>
                  <span className="block mt-1">Please ensure the upload file does not require password</span>
                </div>

                <button onClick={()=> setShowAlert(false)} className="absolute top-0 right-0 px-4 py-3" aria-label="Close alert">
                  <IoClose className='h-[24px] w-[24px] text-red-700'/>
                </button>
              </div>
            )
          }
          {
            showSuccess && (
              <div className="flex absolute top-[695px] left-[1092px] items-center justify-between w-[392px] bg-green-50 border-[1px] border-green-400 text-green-700 px-4 py-3 rounded-[8px] shadow-md">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="font-medium">Uploaded successfully</span>
                </div>
                <button onClick={()=> setShowSuccess(false)} className="top-0 right-0">
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            )
          }
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="w-[986px] h-[40px] px-8 py-4 text-left text-sm font-normal tracking-wider"
                >
                  File name
                </th>
                <th
                  scope="col"
                  className="w-[420px] h-[40px] px-8 py-4 text-left text-sm font-normal tracking-wider"
                >
                  Document owner
                </th>
                <th
                  scope="col"
                  className="px-8 flex py-4 text-left text-sm font-normal relative  tracking-wider"
                >
                  Last updated
                  <div className='flex flex-col justify-center items-center'>
                    <IoMdArrowDropup className='absolute right-[80px] top-[8px] w-[24px] h-[24px]'/>
                    <IoMdArrowDropdown className='absolute right-[80px] bottom-[10px] w-[24px] h-[24px]'/>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-8 py-4 whitespace-nowrap text-base text-gray-900">
                    {doc.fileName}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap flex h-[77.36px] items-center text-base text-gray-900">
                    <span>{doc.ownerName}</span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-base  text-left">
                    <div>{doc.lastUpdatedDate}</div>
                    <div className="text-sm text-gray-500">{doc.lastUpdatedTime}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
    </section>
  );
}
