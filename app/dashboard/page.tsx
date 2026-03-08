import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit, Trash, Eye } from 'lucide-react'
import Link from 'next/link'
import type { Listing } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/auth/login')
  // }

  // Use first user for testing
  const { data: firstProfile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  const userId = firstProfile?.id || '11111111-1111-1111-1111-111111111111'

  const { data: listings } = await supabase
    .from('listings')
    .select('*, phase:phases(name), block:blocks(name), images:listing_images(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const stats = {
    total: listings?.length || 0,
    pending: listings?.filter(l => l.status === 'pending').length || 0,
    approved: listings?.filter(l => l.status === 'approved').length || 0,
    rejected: listings?.filter(l => l.status === 'rejected').length || 0,
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground/80 mt-2">Manage and track your property listings</p>
        </div>
        <Button asChild className="w-fit bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg py-3 px-6">
          <Link href="/dashboard/post" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Post New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Listings', value: stats.total, bg: 'bg-gradient-to-br from-blue-50 to-white border-blue-200', icon: '📊' },
          { label: 'Active Ads', value: stats.approved, bg: 'bg-gradient-to-br from-green-50 to-white border-green-200', icon: '✅' },
          { label: 'Pending Review', value: stats.pending, bg: 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200', icon: '⏳' },
          { label: 'Rejected', value: stats.rejected, bg: 'bg-gradient-to-br from-red-50 to-white border-red-200', icon: '❌' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-xl p-6 border hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Listings List */}
      <div className="space-y-4">
        {listings && listings.length > 0 ? (
          listings.map((listing: Listing) => (
            <div key={listing.id} className="bg-white border border-border/40 rounded-xl p-6 hover:shadow-md hover:border-primary/40 transition-all">
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-6 flex-1">
                  {listing.images?.[0] && (
                    <img
                      src={listing.images[0].image_url}
                      alt={listing.title}
                      className="w-28 h-28 object-cover rounded-lg border border-border/40"
                    />
                  )}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground/70">
                        {listing.phase?.name} • {listing.block?.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="font-bold text-primary">PKR {listing.price.toLocaleString()}</span>
                      <span className="text-muted-foreground/80">
                        {listing.property_type === 'residential_plot' 
                          ? `${listing.plot_size_sqyd} Sq Yd`
                          : `${listing.shop_size_sqft} Sq Ft`
                        }
                      </span>
                      <span className="text-muted-foreground/80 capitalize">
                        For {listing.listing_type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" asChild className="border-border hover:border-primary hover:bg-blue-50">
                    <Link href={`/listings/${listing.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="border-border hover:border-secondary hover:bg-green-50">
                    <Link href={`/dashboard/listings/${listing.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    await supabase.from('listings').delete().eq('id', listing.id)
                  }}>
                    <Button size="sm" variant="destructive" type="submit" className="border-0">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-border/40 rounded-xl p-12 text-center">
            <p className="text-muted-foreground mb-6 text-lg">You haven't posted any listings yet</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
              <Link href="/dashboard/post" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Post Your First Listing
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
