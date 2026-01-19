

export const InfoCard = ({ title, data }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item: any, i: number) => (
          <Info key={i} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  )
}

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
)

