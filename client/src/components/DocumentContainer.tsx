import EmptyDocument from '../assets/EmptyDocument.png';
import UploadButton from './Uploadbutton';
import { IoMdArrowDropdown, IoMdArrowDropup  } from "react-icons/io";

export default function DocumentContainer() {
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
          <div className="max-w-md mx-auto absolute top-[20px] bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a1.5 1.5 0 001.28 2.25h16a1.5 1.5 0 001.28-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Cannot Upload This File
            </strong>
            <span className="block sm:inline mt-1">Please ensure the upload file does not require password</span>
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close alert">
              <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 5.652a.75.75 0 00-1.06 0L10 8.94 6.712 5.652a.75.75 0 10-1.06 1.06L8.94 10l-3.288 3.288a.75.75 0 101.06 1.06L10 11.06l3.288 3.288a.75.75 0 101.06-1.06L11.06 10l3.288-3.288a.75.75 0 000-1.06z" />
              </svg>
            </button>
          </div>
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
