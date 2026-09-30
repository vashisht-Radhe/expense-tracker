const SummaryCard = ({
  title,
  value,
  icon: Icon,
  description,
  change,
  changeIcon: ChangeIcon,
  changeColor = "text-secondary",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-light bg-surface p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
            <Icon
              size={20}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <p className="text-sm font-medium text-text-secondary">{title}</p>
        </div>

        {ChangeIcon && <ChangeIcon size={20} className={changeColor} />}
      </div>

      <h2
        className="
          relative mt-3
          text-2xl font-semibold text-heading
          transition-colors duration-300
          group-hover:text-primary
        "
      >
        {value}
      </h2>

      {(change || description) && (
        <div className="relative mt-3 flex items-center gap-2 text-sm">
          {change && (
            <span
              className={`font-medium ${changeColor} transition-transform duration-300 group-hover:translate-x-0.5`}
            >
              {change}
            </span>
          )}

          {description && (
            <span className="text-text-secondary">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
