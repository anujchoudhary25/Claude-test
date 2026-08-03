const styles = {
  new: "bg-white/10 text-bone",
  sent: "bg-blue-500/20 text-blue-300",
  replied: "bg-lime/20 text-lime",
  bounced: "bg-red-500/20 text-red-300",
  unsubscribed: "bg-white/5 text-bone/40",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || styles.new}`}>
      {status}
    </span>
  );
}
