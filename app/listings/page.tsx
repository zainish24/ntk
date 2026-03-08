import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnhancedPropertyCard } from '@/components/enhanced-property-card'
import { ListingsFilters } from '@/components/listings-filters'
import { Spinner } from '@/components/ui/spinner'
import { Building2 } from 'lucide-react'
import type { Listing, Phase, Block } from '@/lib/types'

interface ListingsPageProps {
  searchParams: Promise<{
    phase_id?: string
    block_id?: string
    property_type?: string
    listing_type?: string
    min_price?: string
    max_price?: string
    is_corner?: string
    is_road_facing?: string
    is_park_facing?: string
    is_west_open?: string
    has_construction?: string
    search?: string
    page?: string
  }>
}

async function ListingsContent({ searchParams }: ListingsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('listings')
    .select(`
      *,
      phase:phases(*),
      block:blocks(*),
      images:listing_images(*)
    `)
    // Removed status filter - show all listings

  // Apply filters
  if (params.phase_id) {
    query = query.eq('phase_id', params.phase_id)
  }
  if (params.block_id) {
    query = query.eq('block_id', params.block_id)
  }
  if (params.property_type) {
    query = query.eq('property_type', params.property_type)
  }
  if (params.listing_type) {
    query = query.eq('listing_type', params.listing_type)
  }
  if (params.min_price) {
    query = query.gte('price', parseInt(params.min_price))
  }
  if (params.max_price) {
    query = query.lte('price', parseInt(params.max_price))
  }
  if (params.is_corner === 'true') {
    query = query.eq('is_corner', true)
  }
  if (params.is_road_facing === 'true') {
    query = query.eq('is_road_facing', true)
  }
  if (params.is_park_facing === 'true') {
    query = query.eq('is_park_facing', true)
  }
  if (params.is_west_open === 'true') {
    query = query.eq('is_west_open', true)
  }
  if (params.has_construction === 'true') {
    query = query.eq('has_construction', true)
  }
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  // Pagination
  const page = parseInt(params.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  // Get total count
  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    // Removed status filter

  // Execute query
  const { data: listings, error } = await query
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching listings:', error)
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <>
      {listings && listings.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            Showing {listings.length} of {count || 0} properties
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: Listing) => (
              <EnhancedPropertyCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`?${new URLSearchParams({ ...params, page: pageNum.toString() }).toString()}`}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pageNum === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12">
          <div className="flex max-w-sm flex-col items-center gap-2 text-center">
            <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg mb-2">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="text-lg font-medium tracking-tight">No properties found</div>
            <p className="text-muted-foreground text-sm/relaxed">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default async function ListingsPage(props: ListingsPageProps) {
  const supabase = await createClient()

  // Fetch phases and blocks for filters
  const { data: phases } = await supabase
    .from('phases')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*, phase:phases(*)')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Properties in North Town Residency</h1>
            <p className="text-muted-foreground">
              Find your perfect property in NTR Karachi
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <ListingsFilters 
                phases={(phases || []) as Phase[]} 
                blocks={(blocks || []) as Block[]} 
              />
            </aside>

            {/* Listings Grid */}
            <div className="flex-1 min-w-0">
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="h-8 w-8" />
                  </div>
                }
              >
                <ListingsContent searchParams={props.searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
