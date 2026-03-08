'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle, XCircle, Star, Search, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Listing } from '@/lib/types'
import Link from 'next/link'

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; listingId: string | null }>({ open: false, listingId: null })
  const [rejectionReason, setRejectionReason] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchListings()
  }, [statusFilter])

  const fetchListings = async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('listings')
      .select('*, phase:phases(name), block:blocks(name), profile:profiles(full_name, phone)')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (!error && data) {
      setListings(data as Listing[])
    }
    setLoading(false)
  }

  const handleApprove = async (listingId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('listings')
      .update({ status: 'approved' })
      .eq('id', listingId)

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      await supabase.from('activity_logs').insert({
        admin_id: '11111111-1111-1111-1111-111111111111',
        action: 'approve',
        entity_type: 'listing',
        entity_id: listingId,
        details: {}
      })
      toast({ title: 'Success', description: 'Listing approved' })
      fetchListings()
    }
  }

  const handleReject = async () => {
    if (!rejectDialog.listingId || !rejectionReason) return

    const supabase = createClient()
    const { error } = await supabase
      .from('listings')
      .update({ status: 'rejected', rejection_reason: rejectionReason })
      .eq('id', rejectDialog.listingId)

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      await supabase.from('activity_logs').insert({
        admin_id: '11111111-1111-1111-1111-111111111111',
        action: 'reject',
        entity_type: 'listing',
        entity_id: rejectDialog.listingId,
        details: { reason: rejectionReason }
      })
      toast({ title: 'Success', description: 'Listing rejected' })
      setRejectDialog({ open: false, listingId: null })
      setRejectionReason('')
      fetchListings()
    }
  }

  const handleFeature = async (listingId: string, isFeatured: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('listings')
      .update({ is_featured: !isFeatured })
      .eq('id', listingId)

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Success', description: isFeatured ? 'Removed from featured' : 'Added to featured' })
      fetchListings()
    }
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.phase?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.block?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Listings</h1>
        <p className="text-muted-foreground">Review and manage property listings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredListings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No listings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>{listing.phase?.name} - {listing.block?.name}</TableCell>
                    <TableCell className="capitalize">{listing.property_type.replace('_', ' ')}</TableCell>
                    <TableCell>PKR {listing.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        listing.status === 'pending' ? 'secondary' :
                        listing.status === 'approved' ? 'default' : 'destructive'
                      }>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/listings/${listing.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {listing.status === 'pending' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(listing.id)}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setRejectDialog({ open: true, listingId: listing.id })}>
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {listing.status === 'approved' && (
                          <Button size="sm" variant="ghost" onClick={() => handleFeature(listing.id, listing.is_featured)}>
                            <Star className={`h-4 w-4 ${listing.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, listingId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, listingId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
