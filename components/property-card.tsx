import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Listing } from '@/lib/types'
import { MapPin, Maximize, Bed, Bath, CornerUpRight, Trees, Sun, Hammer } from 'lucide-react'

interface PropertyCardProps {
  listing: Listing
  showStatus?: boolean
}

export function PropertyCard({ listing, showStatus = false }: PropertyCardProps) {
  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0]
  
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(2)} Cr`
    } else if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(2)} Lac`
    }
    return `Rs. ${price.toLocaleString()}`
  }

  const getSize = () => {
    if (listing.property_type === 'residential_plot' && listing.plot_size_sqyd) {
      return `${listing.plot_size_sqyd} Sq Yd`
    }
    if (listing.property_type === 'commercial_shop' && listing.shop_size_sqft) {
      return `${listing.shop_size_sqft} Sq Ft`
    }
    return null
  }

  const getPositionBadges = () => {
    const badges = []
    if (listing.is_corner) badges.push({ icon: CornerUpRight, label: 'Corner' })
    if (listing.is_park_facing) badges.push({ icon: Trees, label: 'Park Facing' })
    if (listing.is_west_open) badges.push({ icon: Sun, label: 'West Open' })
    return badges
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-accent text-accent-foreground'
      case 'pending': return 'bg-yellow-500/20 text-yellow-700'
      case 'rejected': return 'bg-destructive/20 text-destructive'
      case 'sold': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Maximize className="h-12 w-12 opacity-50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-primary text-primary-foreground">
              {listing.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            {showStatus && (
              <Badge className={getStatusColor(listing.status)}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </Badge>
            )}
          </div>
          
          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-card/95 text-card-foreground backdrop-blur text-sm font-semibold">
              {formatPrice(listing.price)}
              {listing.price_type === 'negotiable' && <span className="ml-1 font-normal opacity-75">Neg.</span>}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {listing.block?.name}, {listing.phase?.name}
            </span>
          </div>

          {/* Property Type & Size */}
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="font-normal">
              {listing.property_type === 'residential_plot' ? 'Residential Plot' : 'Commercial Shop'}
            </Badge>
            {getSize() && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Maximize className="h-3.5 w-3.5" />
                {getSize()}
              </span>
            )}
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Built property features */}
            {listing.has_construction && (
              <>
                {listing.bedrooms && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Bed className="h-3.5 w-3.5" />
                    {listing.bedrooms} Bed
                  </span>
                )}
                {listing.bathrooms && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Bath className="h-3.5 w-3.5" />
                    {listing.bathrooms} Bath
                  </span>
                )}
                {listing.construction_status !== 'completed' && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Hammer className="h-3.5 w-3.5" />
                    Under Construction
                  </span>
                )}
              </>
            )}
            
            {/* Position badges */}
            {getPositionBadges().map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1 text-sm text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
