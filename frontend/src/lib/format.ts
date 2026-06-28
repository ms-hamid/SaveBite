
export function set_to_hour(timestamps: string) :string 
{
  return new Date(timestamps).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function format_price(price: number | string | null | undefined) {
  const value = Number(price ?? 0);

  return `Rp ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function get_close_text(close_time: string) : string {
  const now = new Date();
  const close = new Date(close_time);

  const diff_ms = close.getTime() - now.getTime();
  const diff_total_mnt = Math.floor(diff_ms / 1000 / 60);

  if (diff_total_mnt <= 0) {
    return "Ended";
  }

  if (diff_total_mnt < 60) {
    return `Ends in ${diff_total_mnt}m`;
  }

  const diff_hour = Math.floor(diff_total_mnt / 60);
  const mnt_left = diff_total_mnt % 60;

  return `Ends in ${diff_hour}h ${mnt_left}m`;
}
