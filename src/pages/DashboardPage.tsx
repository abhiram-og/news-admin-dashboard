export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Stat title="Total Articles" value="1" />
      <Stat title="Published" value="1" />
      <Stat title="Drafts" value="0" />
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
