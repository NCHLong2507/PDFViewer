import DocumentDetailedHeader from './DocumentDetailedHeader';
import DocumentDetailedContainer from './DocumentDetailedContainer';
export default function DocumentDetailed() {
  return (
    <div className='flex-col flex gap-[16px] px-[24px] pt-[24px] pb-[16px]'>
      <DocumentDetailedHeader/>
      <DocumentDetailedContainer/>
    </div>
  )
}