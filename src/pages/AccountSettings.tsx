import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

const getApiBase = () => {
  const raw = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app'
  const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`)
  return withProtocol(String(raw)).replace(/\/$/, '')
}

export default function AccountSettings() {
  const navigate = useNavigate()
  const [isSavingUsername, setIsSavingUsername] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const changeUsername = async () => {
    try {
      setIsSavingUsername(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' })
        return
      }
      const res = await fetch(`${getApiBase()}/api/auth/change-username`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ new_username: newUsername })
      })
      if (!res.ok) throw new Error('request-failed')
      toast({ title: 'Username updated', description: 'Your username has been changed' })
      setNewUsername('')
    } catch {
      toast({ title: 'Error', description: 'Could not change username', variant: 'destructive' })
    } finally {
      setIsSavingUsername(false)
    }
  }

  const changePassword = async () => {
    try {
      setIsSavingPassword(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' })
        return
      }
      const res = await fetch(`${getApiBase()}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email, old_password: oldPassword, new_password: newPassword })
      })
      if (!res.ok) throw new Error('request-failed')
      toast({ title: 'Password updated', description: 'You will be logged out now' })
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_token_type')
        localStorage.removeItem('auth_username')
        localStorage.removeItem('auth_plan')
        localStorage.removeItem('auth_max_instances')
        localStorage.removeItem('auth_trial_ends_at')
        sessionStorage.clear()
      } catch {}
      navigate('/login', { replace: true })
    } catch {
      toast({ title: 'Error', description: 'Could not change password', variant: 'destructive' })
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Account settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Change username</CardTitle>
          <CardDescription>Update the username displayed in your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-username">New username</Label>
            <Input id="new-username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="john.doe" />
          </div>
          <div className="flex justify-end">
            <Button onClick={changeUsername} disabled={isSavingUsername || !newUsername.trim()}>
              {isSavingUsername ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use your email and current password to set a new password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="old-password">Current password</Label>
            <Input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={changePassword} disabled={isSavingPassword || !email || !oldPassword || !newPassword}>
              {isSavingPassword ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
