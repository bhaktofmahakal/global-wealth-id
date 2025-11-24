export default function ConvertedResult({ result }) {
  return (
    <div className="bg-green-100 p-4 rounded-lg mt-4">
      <h3 className="font-semibold">Converted Score</h3>
      <p>From {result.fromCountry}: {result.score} → To {result.toCountry}: {result.convertedScore}</p>
      <p className="text-sm text-gray-600">User: {result.user} | Time: {new Date(result.timestamp).toLocaleString()}</p>
    </div>
  )
}