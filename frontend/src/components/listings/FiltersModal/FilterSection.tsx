type FilterSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const FilterSection = ({ title, description, children }: FilterSectionProps) => (
  <section className="border-b border-hairline py-8 last:border-b-0">
    <h3 className="text-[22px] font-semibold leading-tight text-ink">{title}</h3>
    {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
    <div className="mt-6">{children}</div>
  </section>
);

export default FilterSection;
