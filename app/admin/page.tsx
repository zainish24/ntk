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
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin Dashboard</h1>
        <p className="text-muted-foreground/80">Real-time overview of NTR Properties platform</p>
      </div>

      {/* Stats Grid - Vibrant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const colors = [
            'from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50 hover:shadow-primary/20',
            'from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/50 hover:shadow-secondary/20',
            'from-accent/20 to-accent/5 border-accent/30 hover:border-accent/50 hover:shadow-accent/20',
            'from-primary/15 to-secondary/15 border-primary/20 hover:border-primary/40 hover:shadow-primary/15',
            'from-secondary/15 to-accent/15 border-secondary/20 hover:border-secondary/40 hover:shadow-secondary/15',
            'from-accent/15 to-primary/15 border-accent/20 hover:border-accent/40 hover:shadow-accent/15'
          ]
          
          return (
            <div key={stat.title} className={`glass-effect rounded-xl p-6 border ${colors[idx % colors.length]} hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">{stat.title}</p>
                </div>
                <Icon className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground/60">{stat.subtitle}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Recent Submissions */}
      <div className="glass-effect rounded-2xl border-border/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Submissions</h2>
            <p className="text-sm text-muted-foreground/70 mt-1">Latest property listings awaiting review</p>
          </div>
          <Link href="/admin/listings" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-lg hover:bg-primary/10">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentListings?.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-4 rounded-xl bg-card/30 hover:bg-card/50 border border-border/20 hover:border-primary/30 transition-all">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">{listing.title}</h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {listing.phase?.name} • {listing.block?.name} • {listing.profile?.full_name || listing.profile?.phone}
                </p>
              </div>
              <Badge className={`ml-4 font-semibold ${
                listing.status === 'pending' ? 'bg-amber-500/20 text-amber-200 border-amber-500/30' :
                listing.status === 'approved' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 
                'bg-red-500/20 text-red-200 border-red-500/30'
              } border`}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </Badge>
            </div>
          ))}
          {!recentListings?.length && (
            <div className="text-center text-muted-foreground py-12">
                No recent submissions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
