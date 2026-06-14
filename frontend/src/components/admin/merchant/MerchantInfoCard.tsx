type InfoItem = {
    label: string;
    value: string | number | null | undefined;
    highlight?: boolean;
  };
  
  type MerchantInfoCardProps = {
    title: string;
    icon: string;
    items: InfoItem[];
  };
  
  export default function MerchantInfoCard({
    title,
    icon,
    items,
  }: MerchantInfoCardProps) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-sm">
        <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          {title}
        </h3>
  
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="font-caption text-caption text-on-surface-variant">
                {item.label}
              </p>
              <p
                className={`font-body-medium text-body-medium break-words ${
                  item.highlight ? "text-primary" : "text-on-surface"
                }`}
              >
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }