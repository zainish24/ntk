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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/post">
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Listing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
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
