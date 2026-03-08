import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImageGallery } from '@/components/image-gallery'
import { ContactReveal } from '@/components/contact-reveal'
import { EnhancedPropertyCard } from '@/components/enhanced-property-card'
import { 
  MapPin, 
  Phone, 
  MessageCircle,
  Maximize,
  Bed,
  Bath,
  CornerUpRight,
  Trees,
  Sun,
  Route,
  Hammer,
  Calendar,
  Eye,
  Share2,
  ArrowLeft,
  Building2,
  CheckCircle
} from 'lucide-react'
import type { Metadata } from 'next'

interface ListingPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: listing } = await supabase
    .from('listings')
    .select('title, description, price, phase:phases(name), block:blocks(name)')
    .eq('id', id)
    .single()

  if (!listing) {
    return { title: 'Property Not Found' }
  }

  return {
    title: listing.title,
    description: listing.description || `Property in ${listing.block?.name}, ${listing.phase?.name}`,
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      phase:phases(*),
      block:blocks(*),
      images:listing_images(*)
    `)
    .eq('id', id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Increment view count (fire and forget)
  supabase
    .from('listings')
    .update({ views_count: (listing.views_count || 0) + 1 })
    .eq('id', id)
    .then(() => {})

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(2)} Crore`
    } else if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(2)} Lac`
    }
    return `Rs. ${price.toLocaleString()}`
  }

  const getSize = () => {
    if (listing.property_type === 'residential_plot' && listing.plot_size_sqyd) {
      return `${listing.plot_size_sqyd} Square Yards`
    }
    if (listing.property_type === 'commercial_shop' && listing.shop_size_sqft) {
      return `${listing.shop_size_sqft} Square Feet`
    }
    return null
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sortedImages = listing.images?.sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  }) || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link 
            href="/listings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <ImageGallery images={sortedImages} title={listing.title} />

              {/* Title & Location */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {listing.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                  </Badge>
                  <Badge variant="secondary">
                    {listing.property_type === 'residential_plot' ? 'Residential Plot' : 'Commercial Shop'}
                  </Badge>
                  {listing.is_featured && (
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-3">{listing.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{listing.block?.name}, {listing.phase?.name}, North Town Residency</span>
                </div>
              </div>

              {/* Price */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</span>
                    {listing.price_type === 'negotiable' && (
                      <Badge variant="outline">Negotiable</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Size */}
                    {getSize() && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Maximize className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Size</div>
                          <div className="font-medium">{getSize()}</div>
                        </div>
                      </div>
                    )}

                    {/* Bedrooms */}
                    {listing.has_construction && listing.bedrooms && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bed className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Bedrooms</div>
                          <div className="font-medium">{listing.bedrooms}</div>
                        </div>
                      </div>
                    )}

                    {/* Bathrooms */}
                    {listing.has_construction && listing.bathrooms && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bath className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Bathrooms</div>
                          <div className="font-medium">{listing.bathrooms}</div>
                        </div>
                      </div>
                    )}

                    {/* Construction Status */}
                    {listing.has_construction && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Hammer className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Construction</div>
                          <div className="font-medium capitalize">{listing.construction_status.replace('_', ' ')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Position Features */}
              {(listing.is_corner || listing.is_road_facing || listing.is_park_facing || listing.is_west_open) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Position Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {listing.is_corner && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent">
                          <CornerUpRight className="h-5 w-5" />
                          <span className="font-medium">Corner Plot</span>
                        </div>
                      )}
                      {listing.is_road_facing && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                          <Route className="h-5 w-5" />
                          <span className="font-medium">Road Facing</span>
                        </div>
                      )}
                      {listing.is_park_facing && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent">
                          <Trees className="h-5 w-5" />
                          <span className="font-medium">Park Facing</span>
                        </div>
                      )}
                      {listing.is_west_open && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                          <Sun className="h-5 w-5" />
                          <span className="font-medium">West Open</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {listing.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {listing.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Address Details */}
              {listing.address_details && (
                <Card>
                  <CardHeader>
                    <CardTitle>Address Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{listing.address_details}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <ContactReveal 
                listingId={listing.id}
                listingTitle={listing.title}
                listingPrice={formatPrice(listing.price)}
              />

              {/* Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{listing.views_count || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {formatDate(listing.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Safety Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Verify property documents before payment</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Meet in public places for viewings</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Never share personal financial info</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="container mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fetch similar properties based on phase/block */}
            {await (async () => {
              const { data: similarListings } = await supabase
                .from('listings')
                .select(`
                  *,
                  phase:phases(*),
                  block:blocks(*),
                  images:listing_images(*)
                `)
                .eq('phase_id', listing.phase_id)
                .neq('id', listing.id)
                .limit(3)
              
              return similarListings?.map((similar) => (
                <EnhancedPropertyCard key={similar.id} listing={similar} />
              ))
            })()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
