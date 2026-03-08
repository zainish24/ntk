'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TestLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('03001234567')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      // For testing - just redirect without any checks
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Login failed: ' + (err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-none">NTR Properties</span>
          <span className="text-xs text-muted-foreground">Test Login</span>
        </div>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Login (No OTP)</CardTitle>
          <CardDescription>
            For development testing only. Auth is temporarily disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567"
            />
          </div>
          
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Default: 03001234567 (must exist in database)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
