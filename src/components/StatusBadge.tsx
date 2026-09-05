type StatusStyle = { bg: string; text: string; dot: string; label: string };

const STATUS_STYLES: Record<string, StatusStyle> = {
  confirmed: { bg: "bg-[#EFEAD9]", text: "text-[#5C4A1E]", dot: "bg-[#B8935F]", label: "Confirmed" },
  paid: { bg: "bg-[#EFEAD9]", text: "text-[#5C4A1E]", dot: "bg-[#B8935F]", label: "Paid" },
  pending: { bg: "bg-[#F3E6DC]", text: "text-[#8A4E22]", dot: "bg-[#C97A3D]", label: "Pending" },
  "checked-in": { bg: "bg-[#E4EAE3]", text: "text-[#1B2E28]", dot: "bg-[#3C6152]", label: "Checked in" },
  "checked-out": { bg: "bg-[#EAE8E2]", text: "text-[#5A5548]", dot: "bg-[#8A8575]", label: "Checked out" },
  cancelled: { bg: "bg-[#F5E1DC]", text: "text-[#8A2E1D]", dot: "bg-[#B54834]", label: "Cancelled" },
  failed: { bg: "bg-[#F5E1DC]", text: "text-[#8A2E1D]", dot: "bg-[#B54834]", label: "Failed" },
  refunded: { bg: "bg-[#E4E8EE]", text: "text-[#2A3A52]", dot: "bg-[#4C6285]", label: "Refunded" },
};

export function StatusBadge({
  status,
  kind,
}: {
  status: string;
  kind: "reservation" | "payment";
}) {
  const style =
    STATUS_STYLES[status] ??
    ({ bg: "bg-[#EAE8E2]", text: "text-[#5A5548]", dot: "bg-[#8A8575]", label: status } as StatusStyle);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${style.bg} ${style.text} print:border print:border-current print:bg-transparent`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot} print:hidden`} aria-hidden="true" />
      {style.label}
      <span className="sr-only">
        {kind === "reservation" ? "Reservation status" : "Payment status"}
      </span>
    </span>
  );
}
