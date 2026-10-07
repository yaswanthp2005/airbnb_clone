type StepperButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const StepperButton = ({ label, disabled, onClick, children }: StepperButtonProps) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="flex size-8 items-center justify-center rounded-full border border-ink-muted/60 text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:border-surface-strong disabled:text-surface-strong"
  >
    {children}
  </button>
);

export default StepperButton;
