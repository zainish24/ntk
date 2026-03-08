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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">My Listings</h1>
          <p className="text-muted-foreground/80 mt-2">Manage and track your property listings</p>
        </div>
        <Button asChild className="w-fit bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/30 text-foreground font-semibold">
          <Link href="/dashboard/post" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Post New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Listings', value: stats.total, color: 'from-primary/20 to-primary/5 border-primary/30', icon: '📊' },
          { label: 'Active Ads', value: stats.approved, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30', icon: '✅' },
          { label: 'Pending Review', value: stats.pending, color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30', icon: '⏳' },
          { label: 'Rejected', value: stats.rejected, color: 'from-red-500/20 to-red-500/5 border-red-500/30', icon: '❌' }
        ].map((stat, idx) => (
          <div key={idx} className={`glass-effect rounded-xl p-6 border ${stat.color} hover:shadow-lg transition-all`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">{stat.label}</p>
                <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {listings && listings.length > 0 ? (
          listings.map((listing: Listing) => (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {listing.images?.[0] && (
                      <img
                        src={listing.images[0].image_url}
                        alt={listing.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.phase?.name} - {listing.block?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold">PKR {listing.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          {listing.property_type === 'residential_plot' 
                            ? `${listing.plot_size_sqyd} Sq Yd`
                            : `${listing.shop_size_sqft} Sq Ft`
                          }
                        </span>
                        <span className="text-muted-foreground capitalize">
                          For {listing.listing_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/listings/${listing.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      const supabase = await createClient()
                      await supabase.from('listings').delete().eq('id', listing.id)
                    }}>
                      <Button size="sm" variant="destructive" type="submit">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't posted any listings yet</p>
              <Button asChild>
                <Link href="/dashboard/post">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Post Your First Listing
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
