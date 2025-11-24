'use client'

import { useState } from 'react'
import ScoreForm from '../components/ScoreForm'
import RecentChecks from '../components/RecentChecks'
import ConvertedResult from '../components/ConvertedResult'

export default function Home() {
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConvert = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Conversion failed')
      const resultData = await res.json()
      setResult(resultData)
      // Refresh recent
      fetchRecent()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecent = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/recent`)
      const data = await res.json()
      setRecent(data)
    } catch (err) {
      console.error('Failed to fetch recent:', err)
    }
  }

  // Fetch recent on mount
  useState(() => {
    fetchRecent()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Global Wealth ID</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ScoreForm onSubmit={handleConvert} loading={loading} />
          {result && <ConvertedResult result={result} />}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div>
          <RecentChecks checks={recent} />
        </div>
      </div>
    </div>
  )
}