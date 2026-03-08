import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Clock, CheckCircle, XCircle, HardDrive, Database } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalListings },
    { count: pendingListings },
    { count: approvedListings },
    { count: rejectedListings },
    { count: totalUsers },
    { data: recentListings },
    { data: storageData }
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*, phase:phases(name), block:blocks(name), profile:profiles(full_name, phone)').order('created_at', { ascending: false }).limit(5),
    supabase.storage.from('property-images').list()
  ])

  // Calculate storage usage
  const totalStorageBytes = storageData?.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) || 0
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2)
  const storageLimit = 1024 // 1 GB in MB
  const storagePercentage = ((parseFloat(totalStorageMB) / storageLimit) * 100).toFixed(1)

  const stats = [
    { title: 'Total Listings', value: totalListings || 0, icon: FileText, color: 'text-blue-600' },
    { title: 'Pending Approval', value: pendingListings || 0, icon: Clock, color: 'text-yellow-600' },
    { title: 'Approved', value: approvedListings || 0, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Rejected', value: rejectedListings || 0, icon: XCircle, color: 'text-red-600' },
    { title: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-purple-600' },
    { title: 'Storage Used', value: `${totalStorageMB} MB`, subtitle: `${storagePercentage}% of 1 GB`, icon: HardDrive, color: parseFloat(storagePercentage) > 80 ? 'text-red-600' : 'text-green-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of NTR Properties platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Submissions</CardTitle>
            <Link href="/admin/listings" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentListings?.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {listing.phase?.name} - {listing.block?.name} • {listing.profile?.full_name || listing.profile?.phone}
                  </div>
                </div>
                <Badge variant={
                  listing.status === 'pending' ? 'secondary' :
                  listing.status === 'approved' ? 'default' : 'destructive'
                }>
                  {listing.status}
                </Badge>
              </div>
            ))}
            {!recentListings?.length && (
              <div className="text-center text-muted-foreground py-8">
                No recent submissions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
