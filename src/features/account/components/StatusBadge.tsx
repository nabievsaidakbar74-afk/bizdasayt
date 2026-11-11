import { STATUS_CLASS, STATUS_LABEL } from "../lib/orderStatus";

export default function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        STATUS_CLASS[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}
