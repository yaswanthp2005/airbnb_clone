import WhereOptionList, { type WhereOptionListProps } from "./WhereOptionList";

const WherePanel = (props: WhereOptionListProps) => (
  <div className="absolute left-0 top-full z-50 mt-3 w-[425px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[32px] bg-surface-raised py-6 shadow-menu">
    <WhereOptionList {...props} />
  </div>
);

export default WherePanel;
