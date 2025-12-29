import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Lock } from 'lucide-react'

export function PasswordGate() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = login(password)
    
    if (!success) {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="bg-black border border-white/20 rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Studio Direction
          </h1>
          <p className="text-white/60 text-center mb-8">
            Enter password to access admin panel
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              error={error}
              className="mb-6"
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !password}
              className="w-full"
            >
              {isLoading ? 'Checking...' : 'Enter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

