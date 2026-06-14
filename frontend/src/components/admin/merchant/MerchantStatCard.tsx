type MerchantStatCardProps = {
    icon: string;
    label: string;
    value: string | number;
    trend?: string;
  };
  
  export default function MerchantStatCard({
    icon,
    label,
    value,
    trend,
  }: MerchantStatCardProps) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-unit-md shadow-sm border border-transparent hover:border-outline-variant transition-all hover:-translate-y-0.5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
  
          {trend && (
            <span className="text-primary font-label-bold text-caption flex items-center gap-0.5 bg-secondary-container px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[12px]">
                trending_up
              </span>
              {trend}
            </span>
          )}
        </div>
  
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
          {label}
        </p>
  
        <h3 className="font-section-title-sm text-section-title-sm text-on-surface">
          {value}
        </h3>
      </div>
    );
  }