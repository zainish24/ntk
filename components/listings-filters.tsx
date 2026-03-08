'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { Phase, Block } from '@/lib/types'
import { Filter, X, Search } from 'lucide-react'

interface ListingsFiltersProps {
  phases: Phase[]
  blocks: Block[]
}

export function ListingsFilters({ phases, blocks }: ListingsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    phase_id: searchParams.get('phase_id') || '',
    block_id: searchParams.get('block_id') || '',
    property_type: searchParams.get('property_type') || '',
    listing_type: searchParams.get('listing_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    is_corner: searchParams.get('is_corner') === 'true',
    is_road_facing: searchParams.get('is_road_facing') === 'true',
    is_park_facing: searchParams.get('is_park_facing') === 'true',
    is_west_open: searchParams.get('is_west_open') === 'true',
    has_construction: searchParams.get('has_construction') === 'true',
    search: searchParams.get('search') || '',
  })

  // Filter blocks based on selected phase
  const filteredBlocks = filters.phase_id 
    ? blocks.filter(b => b.phase_id === filters.phase_id)
    : blocks

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all' && value !== false) {
        params.set(key, String(value))
      }
    })

    router.push(`/listings?${params.toString()}`)
  }, [filters, router])

  const clearFilters = useCallback(() => {
    setFilters({
      phase_id: '',
      block_id: '',
      property_type: '',
      listing_type: '',
      min_price: '',
      max_price: '',
      is_corner: false,
      is_road_facing: false,
      is_park_facing: false,
      is_west_open: false,
      has_construction: false,
      search: '',
    })
    router.push('/listings')
  }, [router])

  const hasFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return false
    return value && value !== '' && value !== false
  })

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Location</h4>
          
          <div className="space-y-2">
            <Label>Phase</Label>
            <Select
              value={filters.phase_id || 'all'}
              onValueChange={(value) => setFilters({ ...filters, phase_id: value === 'all' ? '' : value, block_id: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Phases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Block</Label>
            <Select
              value={filters.block_id || 'all'}
              onValueChange={(value) => setFilters({ ...filters, block_id: value === 'all' ? '' : value })}
              disabled={!filters.phase_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.phase_id ? "All Blocks" : "Select phase first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                {filteredBlocks.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Property Type */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Property</h4>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={filters.property_type || 'all'}
              onValueChange={(value) => setFilters({ ...filters, property_type: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential_plot">Residential Plot</SelectItem>
                <SelectItem value="commercial_shop">Commercial Shop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>For</Label>
            <Select
              value={filters.listing_type || 'all'}
              onValueChange={(value) => setFilters({ ...filters, listing_type: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sale or Rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sale or Rent</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Price Range</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Min (Rs.)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Max (Rs.)</Label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Position Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Position Features</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_corner"
                checked={filters.is_corner}
                onCheckedChange={(checked) => setFilters({ ...filters, is_corner: !!checked })}
              />
              <Label htmlFor="is_corner" className="text-sm font-normal cursor-pointer">
                Corner Plot
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_road_facing"
                checked={filters.is_road_facing}
                onCheckedChange={(checked) => setFilters({ ...filters, is_road_facing: !!checked })}
              />
              <Label htmlFor="is_road_facing" className="text-sm font-normal cursor-pointer">
                Road Facing
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_park_facing"
                checked={filters.is_park_facing}
                onCheckedChange={(checked) => setFilters({ ...filters, is_park_facing: !!checked })}
              />
              <Label htmlFor="is_park_facing" className="text-sm font-normal cursor-pointer">
                Park Facing
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_west_open"
                checked={filters.is_west_open}
                onCheckedChange={(checked) => setFilters({ ...filters, is_west_open: !!checked })}
              />
              <Label htmlFor="is_west_open" className="text-sm font-normal cursor-pointer">
                West Open
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="has_construction"
                checked={filters.has_construction}
                onCheckedChange={(checked) => setFilters({ ...filters, has_construction: !!checked })}
              />
              <Label htmlFor="has_construction" className="text-sm font-normal cursor-pointer">
                Has Construction
              </Label>
            </div>
          </div>
        </div>

        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
