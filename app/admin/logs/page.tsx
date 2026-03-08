'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ActivityLog } from '@/lib/types'

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, admin:profiles(full_name, phone)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) {
      setLogs(data as ActivityLog[])
    }
    setLoading(false)
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      approve: 'default',
      reject: 'destructive',
      block_user: 'destructive',
      unblock_user: 'default',
      feature: 'secondary',
    }
    return <Badge variant={variants[action] || 'secondary'}>{action.replace('_', ' ')}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">Track all admin actions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No activity logs yet
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString('en-PK', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </TableCell>
                    <TableCell>{log.admin?.full_name || log.admin?.phone || 'System'}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="capitalize">{log.entity_type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.details && typeof log.details === 'object' && 'reason' in log.details
                        ? (log.details as { reason: string }).reason
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
