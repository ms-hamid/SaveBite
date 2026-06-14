import Link from "next/link";

export type CustomerRow = {
  full_name: string;
  exp: number | null;
  strike_count: number | null;
  user_id: string;

  // Placeholder karena tidak ada di tabel customers
  email: string;
  total_rescue: string;
  joined_date: string;

  status: "Active" | "Suspended";
  initials: string;
};

type CustomerTableRowProps = {
  customer: CustomerRow;
};

export default function CustomerTableRow({ customer }: CustomerTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="py-unit-md px-unit-lg">
        <div className="flex items-center gap-unit-md">
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-bold">
            {customer.initials}
          </div>

          <span className="font-medium text-on-background">
            {customer.full_name}
          </span>
        </div>
      </td>

      <td className="py-unit-md px-unit-lg text-on-surface-variant">
        {customer.email}
      </td>

      <td className="py-unit-md px-unit-lg text-on-background font-medium">
        {customer.total_rescue}
      </td>

      <td className="py-unit-md px-unit-lg text-on-surface-variant">
        {customer.joined_date}
      </td>

      <td className="py-unit-md px-unit-lg">
        <span
          className={`inline-flex items-center px-unit-sm py-[2px] rounded-full font-label-bold text-[10px] ${
            customer.status === "Suspended"
              ? "bg-error-container text-error"
              : "bg-secondary-container text-on-secondary-container"
          }`}
        >
          {customer.status}
        </span>
      </td>

      <td className="py-unit-md px-unit-lg text-right">
        <Link
          href={`/admin/customer/${customer.user_id}`}
          className="inline-block bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Detail
        </Link>
      </td>
    </tr>
  );
}