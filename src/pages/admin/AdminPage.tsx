import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AdminUser {
  id?: number
  username: string
  email: string
  plan?: string
  is_admin?: boolean
  trial_ends_at?: string | null
  max_instances?: number
  is_active?: boolean
  monthly_price_usd?: number
  max_sessions_per_instance?: number
  next_billing_at?: string | null
}

const getApiBase = () => {
  const raw = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app'
  const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`)
  return withProtocol(String(raw)).replace(/\/$/, '')
}

export default function AdminPage() {
  const [me, setMe] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminOldPassword, setAdminOldPassword] = useState('')
  const [adminNewPassword, setAdminNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPlan, setNewPlan] = useState('starter')
  const [creating, setCreating] = useState(false)

  const [filterUsername, setFilterUsername] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})
  const [isRenewingMap, setIsRenewingMap] = useState<Record<number, boolean>>({})
  const [isDisablingTrialMap, setIsDisablingTrialMap] = useState<Record<number, boolean>>({})
  const [isSettingActiveMap, setIsSettingActiveMap] = useState<Record<number, boolean>>({})
  const [adjustModalForUser, setAdjustModalForUser] = useState<AdminUser | null>(null)
  const [addInstances, setAddInstances] = useState<number>(0)
  const [priceDelta, setPriceDelta] = useState<number>(0)
  const [adjustSessionsUser, setAdjustSessionsUser] = useState<AdminUser | null>(null)
  const [addNumbers, setAddNumbers] = useState<number>(0)
  const [priceDeltaSessions, setPriceDeltaSessions] = useState<number>(0)

  useEffect(() => {
    setMe(localStorage.getItem('auth_username') || '')
    // optional: if backend exposes a key in storage
    const storedKey = localStorage.getItem('admin_api_key') || ''
    const fallbackToken = localStorage.getItem('auth_token') || ''
    setApiKey(storedKey || fallbackToken)
  }, [])

  const logout = () => {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_token_type')
      localStorage.removeItem('auth_username')
      localStorage.removeItem('auth_is_admin')
      localStorage.removeItem('auth_plan')
      localStorage.removeItem('auth_max_instances')
      localStorage.removeItem('auth_trial_ends_at')
      sessionStorage.clear()
    } catch {}
    window.location.href = '/login'
  }

  const changeAdminPassword = async () => {
    try {
      setChangingPassword(true)
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
        body: JSON.stringify({ email: adminEmail, old_password: adminOldPassword, new_password: adminNewPassword })
      })
      if (!res.ok) throw new Error('request-failed')
      toast({ title: 'Password updated', description: 'You will be logged out now' })
      logout()
    } catch {
      toast({ title: 'Error', description: 'Could not change password', variant: 'destructive' })
    } finally {
      setChangingPassword(false)
    }
  }

  const createUser = async () => {
    try {
      setCreating(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' })
        return
      }
      const url = `${getApiBase()}/api/auth/register`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ username: newUsername, email: newEmail, password: newPassword, plan: newPlan })
      })
      if (!res.ok) throw new Error('request-failed')
      toast({ title: 'User created', description: `${newUsername} was created successfully` })
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      fetchUsers()
    } catch {
      toast({ title: 'Error', description: 'Could not create user', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const token = localStorage.getItem('auth_token')
      if (!token) return
      const q: string[] = []
      if (filterUsername) q.push(`username=${encodeURIComponent(filterUsername)}`)
      if (filterEmail) q.push(`email=${encodeURIComponent(filterEmail)}`)
      const url = `${getApiBase()}/api/auth/admin/users${q.length ? `?${q.join('&')}` : ''}`
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })
      const data = await res.json().catch(() => [])
      if (!res.ok || !Array.isArray(data)) return
      const mapped: AdminUser[] = data.map((u: any) => ({
        id: Number(u?.id ?? 0),
        username: String(u?.username || ''),
        email: String(u?.email || ''),
        plan: String(u?.plan || ''),
        is_admin: Boolean(u?.is_admin),
        trial_ends_at: u?.trial_ends_at ?? null,
        max_instances: typeof u?.max_instances === 'number' ? u.max_instances : undefined,
        is_active: u?.is_active === undefined ? undefined : Boolean(u?.is_active),
        monthly_price_usd: typeof u?.monthly_price_usd === 'number' ? u?.monthly_price_usd : undefined,
        max_sessions_per_instance: typeof u?.max_sessions_per_instance === 'number' ? u?.max_sessions_per_instance : undefined,
        next_billing_at: u?.next_billing_at ?? null,
      }))
      setUsers(mapped)
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>

      {/* API Key for automations */}
      <Card>
        <CardHeader>
          <CardTitle>API KEY FOR AUTOMATIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 items-center">
            <Input readOnly type={showKey ? 'text' : 'password'} value={apiKey} placeholder="No API key available" className="flex-1" />
            <Button variant="outline" onClick={() => setShowKey(!showKey)}>{showKey ? 'Hide' : 'Show'}</Button>
            <Button variant="outline" onClick={() => apiKey && navigator.clipboard.writeText(apiKey)}>Copy</Button>
          </div>
          <p className="text-xs text-muted-foreground">Use this key in your automation tools. Keep it secret.</p>
        </CardContent>
      </Card>

      {/* Change admin password */}
      <Card>
        <CardHeader>
          <CardTitle>Change admin password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" value={adminOldPassword} onChange={(e) => setAdminOldPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" value={adminNewPassword} onChange={(e) => setAdminNewPassword(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={changeAdminPassword} disabled={changingPassword || !adminEmail || !adminOldPassword || !adminNewPassword}>
              {changingPassword ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create user */}
      <Card>
        <CardHeader>
          <CardTitle>Create new user</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="jdoe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={newPlan} onValueChange={setNewPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={createUser} disabled={creating || !newUsername || !newEmail || !newPassword}> {creating ? 'Creating…' : 'Create user'} </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users list */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input className="w-56" placeholder="Filter by username" value={filterUsername} onChange={(e) => setFilterUsername(e.target.value)} />
            <Input className="w-64" placeholder="Filter by email" value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} />
            <Button variant="outline" onClick={fetchUsers} disabled={loadingUsers}>{loadingUsers ? 'Loading…' : 'Search'}</Button>
          </div>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <>
                  <TableRow key={`${u.id}-${u.username}`} className="cursor-pointer" onClick={() => u.id && setExpandedRows(prev => ({ ...prev, [u.id as number]: !prev[u.id as number] }))}>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.plan || '—'}</TableCell>
                    <TableCell>{u.is_admin ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  {u.id && expandedRows[u.id] && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground">Active</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className={`text-sm ${u.is_active ? 'text-green-600' : 'text-gray-500'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                                {u.id && (
                                  <Button size="sm" variant="outline" disabled={u.is_active || !!isSettingActiveMap[u.id as number]} onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      setIsSettingActiveMap(prev => ({ ...prev, [u.id as number]: true }))
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) return
                                      const url = `${getApiBase()}/api/auth/admin/users/set-active`
                                      const res = await fetch(url, {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json',
                                          'ngrok-skip-browser-warning': 'true'
                                        },
                                        body: JSON.stringify({ user_ids: [u.id], is_active: true, apply_to_all: false })
                                      })
                                      if (!res.ok) throw new Error('request-failed')
                                      toast({ title: 'Activated', description: 'Account activated successfully' })
                                      fetchUsers()
                                    } catch {
                                      toast({ title: 'Error', description: 'Could not activate account', variant: 'destructive' })
                                    } finally {
                                      setIsSettingActiveMap(prev => ({ ...prev, [u.id as number]: false }))
                                    }
                                  }}>{isSettingActiveMap[u.id as number] ? 'Activating…' : 'Activate'}</Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Trial ends at</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-sm">{u.trial_ends_at ? new Date(u.trial_ends_at).toLocaleString() : '—'}</div>
                                {u.id && (
                                  <Button size="sm" variant="outline" disabled={!u.trial_ends_at || !!isDisablingTrialMap[u.id as number]} onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      setIsDisablingTrialMap(prev => ({ ...prev, [u.id as number]: true }))
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) return
                                      const url = `${getApiBase()}/api/auth/admin/users/disable-trial`
                                      const res = await fetch(url, {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json',
                                          'ngrok-skip-browser-warning': 'true'
                                        },
                                        body: JSON.stringify({ user_ids: [u.id], apply_to_all: false })
                                      })
                                      if (!res.ok) throw new Error('request-failed')
                                      toast({ title: 'Trial disabled', description: 'Free trial disabled and account deactivated' })
                                      fetchUsers()
                                    } catch {
                                      toast({ title: 'Error', description: 'Could not disable trial', variant: 'destructive' })
                                    } finally {
                                      setIsDisablingTrialMap(prev => ({ ...prev, [u.id as number]: false }))
                                    }
                                  }}>{isDisablingTrialMap[u.id as number] ? 'Disabling…' : 'Disable trial'}</Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Max instances</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-sm">{u.max_instances ?? '—'}</div>
                                {u.id && (
                                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setAdjustModalForUser(u); setAddInstances(0); setPriceDelta(0); }}>Adjust</Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Monthly price (USD)</div>
                              <div className="text-sm mt-1">{u.monthly_price_usd !== undefined ? `$${u.monthly_price_usd}` : '—'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Max sessions per instance</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-sm">{u.max_sessions_per_instance ?? '—'}</div>
                                {u.id && (
                                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setAdjustSessionsUser(u); setAddNumbers(0); setPriceDeltaSessions(0); }}>Adjust</Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Next billing at</div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-sm">{u.next_billing_at ? new Date(u.next_billing_at).toLocaleString() : '—'}</div>
                                {u.id && (
                                  <Button size="sm" variant="outline" onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      setIsRenewingMap(prev => ({ ...prev, [u.id as number]: true }))
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) return
                                      const url = `${getApiBase()}/api/auth/admin/billing/renew`
                                      await fetch(url, {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json',
                                          'ngrok-skip-browser-warning': 'true'
                                        },
                                        body: JSON.stringify({ user_ids: [u.id], days: 30 })
                                      })
                                      toast({ title: 'Renewed', description: 'Next billing moved successfully' })
                                      fetchUsers()
                                    } catch {
                                      toast({ title: 'Error', description: 'Could not renew billing', variant: 'destructive' })
                                    } finally {
                                      setIsRenewingMap(prev => ({ ...prev, [u.id as number]: false }))
                                    }
                                  }} disabled={isRenewingMap[u.id as number]}>
                                    {isRenewingMap[u.id as number] ? 'Renewing…' : 'Renew'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust instances/price modal */}
      <Dialog open={!!adjustModalForUser} onOpenChange={(open) => { if (!open) setAdjustModalForUser(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust instances and price</DialogTitle>
            <DialogDescription>
              Update max instances and monthly price delta for {adjustModalForUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Add instances</Label>
              <Input type="number" value={addInstances} onChange={(e) => setAddInstances(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Monthly price delta (USD)</Label>
              <Input type="number" value={priceDelta} onChange={(e) => setPriceDelta(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustModalForUser(null)}>Cancel</Button>
            <Button onClick={async () => {
              if (!adjustModalForUser?.id) return;
              try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const url = `${getApiBase()}/api/auth/admin/users/add-instances`;
                const res = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  },
                  body: JSON.stringify({ user_ids: [adjustModalForUser.id], add_instances: addInstances, monthly_price_delta_usd: priceDelta })
                });
                if (!res.ok) throw new Error('request-failed');
                toast({ title: 'Updated', description: 'Instances and price adjusted' });
                setAdjustModalForUser(null);
                fetchUsers();
              } catch {
                toast({ title: 'Error', description: 'Could not update', variant: 'destructive' });
              }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust sessions per instance modal */}
      <Dialog open={!!adjustSessionsUser} onOpenChange={(open) => { if (!open) setAdjustSessionsUser(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust max sessions per instance</DialogTitle>
            <DialogDescription>
              Update sessions per instance and monthly price delta for {adjustSessionsUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Add numbers</Label>
              <Input type="number" value={addNumbers} onChange={(e) => setAddNumbers(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Monthly price delta (USD)</Label>
              <Input type="number" value={priceDeltaSessions} onChange={(e) => setPriceDeltaSessions(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustSessionsUser(null)}>Cancel</Button>
            <Button onClick={async () => {
              if (!adjustSessionsUser?.id) return;
              try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const url = `${getApiBase()}/api/auth/admin/users/add-numbers`;
                const res = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  },
                  body: JSON.stringify({ user_ids: [adjustSessionsUser.id], add_numbers: addNumbers, monthly_price_delta_usd: priceDeltaSessions })
                });
                if (!res.ok) throw new Error('request-failed');
                toast({ title: 'Updated', description: 'Sessions per instance and price adjusted' });
                setAdjustSessionsUser(null);
                fetchUsers();
              } catch {
                toast({ title: 'Error', description: 'Could not update', variant: 'destructive' });
              }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
