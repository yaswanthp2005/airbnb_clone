import type { GuestCounts, GuestKey } from "../constants";
import GuestSteppers from "../GuestSteppers";

type WhoPanelProps = {
  counts: GuestCounts;
  onChange: (key: GuestKey, delta: number) => void;
};

const WhoPanel = ({ counts, onChange }: WhoPanelProps) => (
  <div className="absolute right-0 top-full z-50 mt-3 w-[400px] max-w-[calc(100vw-3rem)] rounded-[32px] bg-white px-8 py-4 shadow-menu">
    <GuestSteppers counts={counts} onChange={onChange} />
  </div>
);

export default WhoPanel;
