# Global Wealth ID — Prototype (Next.js + Node API)

This repository skeleton implements a mini-app that converts a credit score from one country's scale to another. It follows the interview brief: Next.js/React frontend + Node backend (serverless API route), Dockerfile for Azure, and a "Vibe Log" of AI prompts used with Cline / Roo-code.

---

## Project structure

```
global-wealth-id/
├─ README.md
├─ package.json
├─ next.config.js
├─ Dockerfile
├─ .dockerignore
├─ public/
│  └─ screenshot-placeholder.png
├─ pages/
│  ├─ index.jsx
│  └─ api/
│     └─ convert.js
├─ components/
│  ├─ ScoreForm.jsx
│  └─ RecentChecks.jsx
├─ lib/
│  └─ conversion.js
└─ vibes-log.md
```

---

## Key files (complete)

### package.json

```json
{
  "name": "global-wealth-id",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.4.10",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "cookie": "0.5.0"
  }
}
```

### pages/index.jsx

```jsx
import Head from 'next/head'
import { useState, useEffect } from 'react'
import ScoreForm from '../components/ScoreForm'
import RecentChecks from '../components/RecentChecks'

export default function Home() {
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConvert = async (data) => {
    setLoading(true)
    setError(null)
    try{
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })
      const dataRes = await res.json()
      if(!res.ok) throw new Error(dataRes?.message || 'Conversion failed')
      setResult(dataRes)
      // store recent checks in localStorage
      const existing = JSON.parse(localStorage.getItem('gwi_checks')||'[]')
      existing.unshift({...dataRes, ts: new Date().toISOString()})
      localStorage.setItem('gwi_checks', JSON.stringify(existing.slice(0,10)))
      window.dispatchEvent(new Event('gwi_checks_update'))
    }catch(err){
      setError(err.message)
    }finally{setLoading(false)}
  }

  const fetchRecent = async () => {
    try {
      const existing = JSON.parse(localStorage.getItem('gwi_checks')||'[]')
      setRecent(existing)
    } catch (err) {
      console.error('Failed to fetch recent:', err)
    }
  }

  useEffect(() => {
    fetchRecent()
  }, [])

  return (
    <div style={{fontFamily:'Inter, system-ui', maxWidth:900, margin:'32px auto'}}>
      <Head>
        <title>Global Wealth ID — Credit Score Converter</title>
      </Head>
      <h1>Global Wealth ID</h1>
      <p>A small prototype that converts credit scores between countries (mock logic).</p>
      <ScoreForm onSubmit={handleConvert} loading={loading} />
      {result && (
        <div style={{border:'1px solid #ddd', padding:12, margin:'12px 0'}}>
          <strong>Result</strong>
          <div>From: {result.from} ({result.input_scale})</div>
          <div>To: {result.to} ({result.output_scale})</div>
          <div>Converted score: <strong>{result.converted_score}</strong></div>
          <div>User: {result.user}</div>
          <div>Mapping details: {result.mapping_description}</div>
        </div>
      )}
      {error && <div style={{color:'red'}}>{error}</div>}
      <hr style={{margin:'24px 0'}}/>
      <RecentChecks />
    </div>
  )
}
```

### components/ScoreForm.jsx

```jsx
import { useState, useEffect } from 'react'

const countries = [
  { code: 'US', name: 'United States (FICO 300-850)' },
  { code: 'IN', name: 'India (CIBIL 300-900)' },
  { code: 'UK', name: 'United Kingdom (Experian 0-999)' },
  { code: 'BR', name: 'Brazil (Serasa 0-1000)' }
]

export default function ScoreForm({ onSubmit, loading }){
  const [from, setFrom] = useState('US')
  const [to, setTo] = useState('IN')
  const [score, setScore] = useState('700')
  const [user, setUser] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    onSubmit({ from, to, score: Number(score), user })
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid', gap:12}}>
      <div style={{display:'flex', gap:8}}>
        <label style={{flex:1}}>
          From
          <select value={from} onChange={e=>setFrom(e.target.value)} style={{width:'100%'}}>
            {countries.map(c=> <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label style={{flex:1}}>
          To
          <select value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%'}}>
            {countries.map(c=> <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
      </div>

      <label>
        Score input
        <input value={score} onChange={e=>setScore(e.target.value)} inputMode="numeric"/>
      </label>

      <label>
        User Name (Optional)
        <input value={user} onChange={e=>setUser(e.target.value)} />
      </label>

      <div>
        <button type="submit" disabled={loading}>{loading? 'Converting...':'Convert'}</button>
      </div>
    </form>
  )
}
```

### components/RecentChecks.jsx

```jsx
import { useEffect, useState } from 'react'

export default function RecentChecks(){
  const [items, setItems] = useState([])
  useEffect(()=>{
    const read = ()=> setItems(JSON.parse(localStorage.getItem('gwi_checks')||'[]'))
    read()
    window.addEventListener('gwi_checks_update', read)
    return ()=> window.removeEventListener('gwi_checks_update', read)
  },[])

  if(!items.length) return <div>No checks yet — try a conversion.</div>
  return (
    <div>
      <h3>Recent Checks</h3>
      <ul>
        {items.slice(0,10).map((it, i)=> (
          <li key={i} style={{marginBottom:8}}>
            <div><strong>{it.input_score}</strong> ({it.from}) ➜ <strong>{it.converted_score}</strong> ({it.to})</div>
            <div style={{fontSize:12, color:'#666'}}>User: {it.user} | {new Date(it.ts).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### lib/conversion.js

```js
// Mocked conversion logic. Keep everything deterministic and explainable.

const scales = {
  US: {min:300, max:850},
  IN: {min:300, max:900},
  UK: {min:0, max:999},
  BR: {min:0, max:1000}
}

function normalizeTo0to1(score, scale){
  const s = scales[scale]
  if(!s) throw new Error('unknown scale')
  return (score - s.min) / (s.max - s.min)
}

function denormalizeFrom0to1(norm, scale){
  const s = scales[scale]
  return Math.round(s.min + norm * (s.max - s.min))
}

export function convertScore({from, to, score}){
  const norm = Math.min(1, Math.max(0, normalizeTo0to1(score, from)))
  // apply a mocked country bias factor to simulate different risk models
  const biasMap = { US: 1.0, IN: 0.98, UK: 1.02, BR: 0.95 }
  const bias = (biasMap[to] || 1) / (biasMap[from] || 1)
  const adjusted = Math.min(1, Math.max(0, norm * bias))
  const converted = denormalizeFrom0to1(adjusted, to)
  return {
    input_scale: `${scales[from].min}-${scales[from].max}`,
    output_scale: `${scales[to].min}-${scales[to].max}`,
    converted_score: converted,
    mapping_description: `Normalized ${score} -> ${Math.round(norm*100)}% then applied bias ${bias.toFixed(3)}`
  }
}
```

### pages/api/convert.js

```js
import { convertScore } from '../../lib/conversion'

export default function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'})
  try{
    const {from, to, score, user} = req.body
    if(!from || !to || typeof score !== 'number') return res.status(400).json({message:'Invalid payload'})
    const out = convertScore({from, to, score})
    return res.status(200).json({from, to, input_score: score, user: user || 'Anonymous', ...out})
  }catch(err){
    return res.status(500).json({message:err.message})
  }
}
```

### Dockerfile

```Dockerfile
# Use official node image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
EXPOSE 3000
CMD ["npm","start"]
```

> This Dockerfile builds Next.js and runs it, suitable for Azure Container Apps. For static export + simple nginx, you could `next export` and serve from a lightweight static server, but using `next start` keeps serverless API routes working.

### .dockerignore

```
node_modules
.next/cache
.vscode
.DS_Store
.env
```

---

## vibes-log.md (prompt history example)

```
# Vibe Log — prompt history (example) — 3 entries

1) Prompt: "Using Cline (or Roo-code), generate a Next.js project skeleton with a single API route `/api/convert` that accepts {from,to,score} and returns a mocked conversion. Include components ScoreForm and RecentChecks that store history in localStorage. Create Dockerfile for Azure."
Response: Generated file list + skeleton. I requested the full code for ScoreForm.

2) Prompt: "Fix: When converted_score returns NaN for invalid input — validate the payload server-side and return 400. Also ensure client shows error messages." 
Response: Agent added guard clauses to `pages/api/convert.js` and client shows errors.

3) Prompt: "Improve UX: store recent checks in localStorage and make RecentChecks react to updates via window event." 
Response: Agent implemented storing to localStorage and RecentChecks listens to `gwi_checks_update`.

-- Bonus: A screenshot of the working prompt was captured during the run and attached to the submission (not included here).
```

---

## README (short)

Include in repo: purpose, run steps, Docker build & run, how to produce the 'vibe log' and attach a recording.


---
