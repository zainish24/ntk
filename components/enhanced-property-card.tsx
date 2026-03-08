'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Listing } from '@/lib/types'
import { MapPin, Maximize, Bed, Bath, CornerUpRight, Trees, Sun, Hammer, Heart, MessageCircle, Clock } from 'lucide-react'
import { useState } from 'react'

interface EnhancedPropertyCardProps {
  listing: Listing
  showStatus?: boolean
}

export function EnhancedPropertyCard({ listing, showStatus = false }: EnhancedPropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false)
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

  const getDaysPosted = () => {
    const days = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hi, I'm interested in your property: ${listing.title} - ${formatPrice(listing.price)}`
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
    // TODO: Save to localStorage or database
  }

  const getPositionBadges = () => {
    const badges = []
    if (listing.is_corner) badges.push({ icon: CornerUpRight, label: 'Corner' })
    if (listing.is_park_facing) badges.push({ icon: Trees, label: 'Park Facing' })
    if (listing.is_west_open) badges.push({ icon: Sun, label: 'West Open' })
    return badges
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full border border-border hover:border-primary/50 bg-card hover:bg-card/95">
      <Link href={`/listings/${listing.id}`}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-125 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Maximize className="h-12 w-12 opacity-30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className="bg-primary text-primary-foreground shadow-md font-semibold">
              {listing.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            {listing.is_featured && (
              <Badge className="bg-accent text-accent-foreground shadow-md font-semibold animate-pulse">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Save Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg hover:scale-125 transition-transform duration-300 bg-white/95 hover:bg-white"
            onClick={handleSave}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>

          {/* Days Posted */}
          <div className="absolute top-16 right-4">
            <Badge variant="secondary" className="bg-card/95 backdrop-blur-sm text-xs gap-1.5 shadow-md">
              <Clock className="h-3 w-3" />
              {getDaysPosted()}
            </Badge>
          </div>
          
          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-primary/95 text-primary-foreground backdrop-blur-sm text-lg font-bold shadow-lg py-2 px-3">
              {formatPrice(listing.price)}
              {listing.price_type === 'negotiable' && <span className="ml-2 font-normal opacity-80 text-xs">Neg.</span>}
            </Badge>
          </div>

          {/* WhatsApp Button */}
          <Button
            size="sm"
            className="absolute bottom-4 right-4 gap-1.5 bg-green-600 hover:bg-green-700 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Title */}
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1 font-medium">
              {listing.block?.name}, {listing.phase?.name}
            </span>
          </div>

          {/* Property Type & Size */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="font-semibold bg-primary/15 text-primary border-primary/20">
              {listing.property_type === 'residential_plot' ? 'Residential' : 'Commercial'}
            </Badge>
            {getSize() && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <Maximize className="h-4 w-4 text-primary" />
                {getSize()}
              </span>
            )}
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/30">
            {listing.has_construction && listing.bedrooms && (
              <span className="flex items-center gap-1.5 font-medium">
                <Bed className="h-4 w-4 text-primary" />
                {listing.bedrooms}
              </span>
            )}
            {listing.has_construction && listing.bathrooms && (
              <span className="flex items-center gap-1.5 font-medium">
                <Bath className="h-4 w-4 text-primary" />
                {listing.bathrooms}
              </span>
            )}
            {getPositionBadges().slice(0, 2).map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 font-medium">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs">{label}</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
