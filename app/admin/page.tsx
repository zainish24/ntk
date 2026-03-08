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
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground/80">Real-time overview of NTR Properties platform</p>
      </div>

      {/* Stats Grid - Light Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const bgColors = [
            'bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-300',
            'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 hover:border-yellow-300',
            'bg-gradient-to-br from-green-50 to-white border-green-200 hover:border-green-300',
            'bg-gradient-to-br from-red-50 to-white border-red-200 hover:border-red-300',
            'bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:border-purple-300',
            'bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-300'
          ]
          
          return (
            <div key={stat.title} className={`${bgColors[idx % bgColors.length]} rounded-xl p-6 border hover:shadow-md transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                </div>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl border border-border/40 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Submissions</h2>
            <p className="text-sm text-muted-foreground/80 mt-1">Latest property listings awaiting review</p>
          </div>
          <Link href="/admin/listings" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentListings?.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-4 rounded-xl bg-blue-50/30 hover:bg-blue-50/60 border border-border/40 hover:border-primary/40 transition-all">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">{listing.title}</h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {listing.phase?.name} • {listing.block?.name} • {listing.profile?.full_name || listing.profile?.phone}
                </p>
              </div>
              <Badge className={`ml-4 font-semibold ${
                listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                listing.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                'bg-red-100 text-red-800 border-red-200'
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
      </div>
    </div>
  )
}
