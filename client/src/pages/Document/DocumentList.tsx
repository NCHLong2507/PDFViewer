import DocumentHeader from '../../components/DocumentHeader';
import DocumentContainer from '../../components/DocumentContainer';
export default function DocumentList() {
  return (
    <div className="flex mt-[16px] flex-col justify-center items-center mx-[32px] gap-[24px] ">
      <DocumentHeader/>
      <DocumentContainer/>
    </div>
  )
}

