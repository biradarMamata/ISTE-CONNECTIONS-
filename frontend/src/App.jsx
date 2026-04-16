import { useMemo, useState } from 'react'
import atriaLogo from './assets/atria.png'
import isteLogo from './assets/iste-logo.svg'
import './App.css'
import Instructions from './Instructions'

const initialForm = {
  usn: '',
  fullName: '',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [entryId, setEntryId] = useState('')
  const [page, setPage] = useState('register')

  const isSubmitting = status === 'submitting'

  const readyLabel = useMemo(() => {
    if (status === 'submitting') return 'SENDING...'
    if (status === 'success') return 'ENTERED'
    return 'READY'
  }, [status])

  function updateField(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedUsn = form.usn.trim().toUpperCase()
    const trimmedName = form.fullName.trim()

    if (!trimmedUsn || !trimmedName) {
      setStatus('error')
      setMessage('Enter both your university seat number and full name.')
      return
    }

    setStatus('submitting')
    setMessage('')
    setEntryId('')

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usn: trimmedUsn,
          fullName: trimmedName,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Registration failed.')
      }

      setStatus('success')
      setMessage(payload.message)
      setEntryId(payload.entry.id)
      setForm(initialForm)
      setPage('instructions')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Something went wrong.')
    }
  }

  function handleStart() {
    // Navigate to game or something
    alert('Game starting!')
  }

  if (page === 'instructions') {
    return <Instructions onStart={handleStart} />
  }

  return (
    <main className="page-shell">
      <div className="backdrop backdrop-left" />
      <div className="backdrop backdrop-right" />

      <div className="page-brand page-brand--left">
        <img src={atriaLogo} alt="Atria Institute of Technology logo" />
      </div>

      <div className="page-brand page-brand--right">
        <img src={isteLogo} alt="ISTE logo" />
      </div>

      <section className="poster">
        <header className="poster__header" />

        <div className="poster__hero">
          <p className="eyebrow">The ultimate technical battle</p>
          <h1>Vigyaanrang Entry</h1>
          <p className="tagline">Where bytes and beats collide</p>
        </div>

        <form className="entry-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>University seat number</span>
            <div className="field__input">
              <span className="field__icon" aria-hidden="true">
                ◔
              </span>
              <input
                autoComplete="off"
                name="usn"
                onChange={updateField}
                placeholder="e.g. 1AT21CS001"
                value={form.usn}
              />
            </div>
          </label>

          <label className="field">
            <span>Full name</span>
            <div className="field__input">
              <span className="field__icon" aria-hidden="true">
                ☺
              </span>
              <input
                autoComplete="name"
                name="fullName"
                onChange={updateField}
                placeholder="John Doe"
                value={form.fullName}
              />
            </div>
          </label>

          <div className={`notice ${status === 'error' ? 'notice--error' : ''}`}>
            <span className="notice__mark" aria-hidden="true">
              i
            </span>
            <p>
              Ensure your USN is correct. It is used for the leaderboard and prize
              claims.
            </p>
          </div>

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            <span>{readyLabel}</span>
            <span aria-hidden="true" className="submit-button__bolt">
              ⚡
            </span>
          </button>

          <p className="helper-copy">
            By entering, you agree to the competition terms and fair play policy.
          </p>

          {message ? (
            <div
              className={`status-card ${status === 'success' ? 'status-card--success' : ''}`}
              role="status"
            >
              <p>{message}</p>
              {entryId ? <strong>Entry ID: {entryId}</strong> : null}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  )
}

}

export default App
