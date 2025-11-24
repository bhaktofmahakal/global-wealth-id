export default function RecentChecks({ checks }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Checks</h2>
      {checks.length === 0 ? (
        <p className="text-gray-500">No recent checks</p>
      ) : (
        <ul className="space-y-2">
          {checks.map((check, index) => (
            <li key={index} className="border-b pb-2">
              <p>{check.fromCountry} {check.score} → {check.toCountry} {check.convertedScore}</p>
              <p className="text-sm text-gray-600">User: {check.user} | {new Date(check.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}