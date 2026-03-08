'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { Phase, Block } from '@/lib/types'

interface HeroSearchProps {
  phases: Phase[]
  blocks: Block[]
}

export function HeroSearch({ phases, blocks }: HeroSearchProps) {
  const router = useRouter()
  const [phaseId, setPhaseId] = useState<string>('')
  const [blockId, setBlockId] = useState<string>('')
  const [propertyType, setPropertyType] = useState<string>('')
  const [listingType, setListingType] = useState<string>('')

  const filteredBlocks = phaseId
    ? blocks.filter((block) => block.phase_id === phaseId)
    : blocks

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (phaseId) params.set('phase_id', phaseId)
    if (blockId) params.set('block_id', blockId)
    if (propertyType) params.set('property_type', propertyType)
    if (listingType) params.set('listing_type', listingType)
    
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <Card className="p-4 shadow-xl border-border/50 bg-card/95 backdrop-blur">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Phase */}
        <Select value={phaseId} onValueChange={(value) => {
          setPhaseId(value)
          setBlockId('') // Reset block when phase changes
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Phase" />
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

        {/* Block */}
        <Select value={blockId} onValueChange={setBlockId} disabled={!phaseId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Block" />
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

        {/* Property Type */}
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="residential_plot">Residential Plot</SelectItem>
            <SelectItem value="commercial_shop">Commercial Shop</SelectItem>
          </SelectContent>
        </Select>

        {/* Listing Type */}
        <Select value={listingType} onValueChange={setListingType}>
          <SelectTrigger>
            <SelectValue placeholder="For Sale/Rent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sale & Rent</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button 
          size="lg" 
          className="gap-2 w-full"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </Card>
  )
}
