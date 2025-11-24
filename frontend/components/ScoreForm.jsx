'use client'

import { useState } from 'react'

const countries = ['USA', 'UK', 'Germany', 'Japan', 'Australia']

export default function ScoreForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    score: '',
    fromCountry: 'USA',
    toCountry: 'UK',
    user: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      score: parseFloat(formData.score)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Convert Credit Score</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Credit Score</label>
        <input
          type="number"
          name="score"
          value={formData.score}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          placeholder="Enter score"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">From Country</label>
        <select
          name="fromCountry"
          value={formData.fromCountry}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">To Country</label>
        <select
          name="toCountry"
          value={formData.toCountry}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">User Name (Optional)</label>
        <input
          type="text"
          name="user"
          value={formData.user}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Your name"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert'}
      </button>
    </form>
  )
}