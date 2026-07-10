export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="h-14 w-14 rounded-card bg-primary-50 flex items-center justify-center text-primary mb-4">
        {Icon && <Icon size={24} />}
      </div>
      <h2 className="text-[16px] font-semibold text-ink-900">{title}</h2>
      <p className="text-[13.5px] text-ink-500 mt-1.5 max-w-sm">{description}</p>
    </div>
  );
}
