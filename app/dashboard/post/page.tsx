'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react'
import type { Phase, Block } from '@/lib/types'

export default function PostListingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [phases, setPhases] = useState<Phase[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [images, setImages] = useState<File[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    phase_id: '',
    block_id: '',
    property_type: 'residential_plot' as 'residential_plot' | 'commercial_shop',
    listing_type: 'sale' as 'sale' | 'rent',
    plot_size_sqyd: '',
    shop_size_sqft: '',
    price: '',
    price_type: 'negotiable' as 'fixed' | 'negotiable',
    bedrooms: '',
    bathrooms: '',
    is_corner: false,
    is_road_facing: false,
    is_park_facing: false,
    is_west_open: false,
    has_construction: false,
    construction_status: 'empty' as 'empty' | 'under_construction' | 'completed',
    address_details: '',
  })

  useState(() => {
    const supabase = createClient()
    supabase.from('phases').select('*').eq('is_active', true).order('display_order').then(({ data }) => {
      if (data) setPhases(data)
    })
  })

  const loadBlocks = async (phaseId: string) => {
    const supabase = createClient()
    const { data } = await supabase.from('blocks').select('*').eq('phase_id', phaseId).eq('is_active', true)
    if (data) setBlocks(data)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 10 - images.length)
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Use first user for testing
      const { data: firstProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single()

      console.log('Profile:', firstProfile, 'Error:', profileError)

      const userId = firstProfile?.id || '11111111-1111-1111-1111-111111111111'

      console.log('Using userId:', userId)

      const listingData = {
        user_id: userId,
        title: form.title,
        description: form.description,
        phase_id: form.phase_id,
        block_id: form.block_id,
        property_type: form.property_type,
        listing_type: form.listing_type,
        plot_size_sqyd: form.property_type === 'residential_plot' ? parseFloat(form.plot_size_sqyd) : null,
        shop_size_sqft: form.property_type === 'commercial_shop' ? parseFloat(form.shop_size_sqft) : null,
        price: parseFloat(form.price),
        price_type: form.price_type,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        is_corner: form.is_corner,
        is_road_facing: form.is_road_facing,
        is_park_facing: form.is_park_facing,
        is_west_open: form.is_west_open,
        has_construction: form.has_construction,
        construction_status: form.construction_status,
        address_details: form.address_details,
        status: 'approved', // Auto-approve listings
        views_count: 0,
        is_featured: false,
      }

      console.log('Submitting listing data:', listingData)

      const { data: listing, error } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .single()

      console.log('Insert result:', listing, 'Error:', error)

      if (error) throw error

      // Skip image upload for now - storage bucket issue
      // for (let i = 0; i < images.length; i++) {
      //   const file = images[i]
      //   const fileExt = file.name.split('.').pop()
      //   const fileName = `${userId}/${Date.now()}-${i}.${fileExt}`

      //   const { data: uploadData, error: uploadError } = await supabase.storage
      //     .from('property-images')
      //     .upload(fileName, file)

      //   if (uploadError) throw uploadError

      //   const { data: { publicUrl } } = supabase.storage
      //     .from('property-images')
      //     .getPublicUrl(uploadData.path)

      //   await supabase.from('listing_images').insert({
      //     listing_id: listing.id,
      //     image_url: publicUrl,
      //     is_primary: i === 0,
      //     display_order: i,
      //   })
      // }

      toast({ title: 'Success', description: 'Listing submitted for approval' })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post New Listing</h1>
        <p className="text-muted-foreground">Step {step} of 4</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Phase</Label>
              <Select value={form.phase_id} onValueChange={(v) => {
                setForm({ ...form, phase_id: v, block_id: '' })
                loadBlocks(v)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Block</Label>
              <Select value={form.block_id} onValueChange={(v) => setForm({ ...form, block_id: v })} disabled={!form.phase_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Property Type</Label>
              <Select value={form.property_type} onValueChange={(v: any) => setForm({ ...form, property_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential_plot">Residential Plot</SelectItem>
                  <SelectItem value="commercial_shop">Commercial Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Listing Type</Label>
              <Select value={form.listing_type} onValueChange={(v: any) => setForm({ ...form, listing_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Size & Price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.property_type === 'residential_plot' ? (
              <div>
                <Label>Plot Size (Sq Yards)</Label>
                <Input type="number" value={form.plot_size_sqyd} onChange={(e) => setForm({ ...form, plot_size_sqyd: e.target.value })} placeholder="e.g., 120" />
              </div>
            ) : (
              <div>
                <Label>Shop Size (Sq Ft)</Label>
                <Input type="number" value={form.shop_size_sqft} onChange={(e) => setForm({ ...form, shop_size_sqft: e.target.value })} placeholder="e.g., 80" />
              </div>
            )}
            <div>
              <Label>Price (PKR)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g., 5000000" />
            </div>
            <div>
              <Label>Price Type</Label>
              <Select value={form.price_type} onValueChange={(v: any) => setForm({ ...form, price_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Position Features</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.is_corner} onCheckedChange={(c) => setForm({ ...form, is_corner: !!c })} />
                  <label>Corner Plot</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.is_road_facing} onCheckedChange={(c) => setForm({ ...form, is_road_facing: !!c })} />
                  <label>Road Facing</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.is_park_facing} onCheckedChange={(c) => setForm({ ...form, is_park_facing: !!c })} />
                  <label>Park Facing</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.is_west_open} onCheckedChange={(c) => setForm({ ...form, is_west_open: !!c })} />
                  <label>West Open</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Description & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., 120 Sq Yd Corner Plot" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe your property..." />
            </div>
            <div>
              <Label>Address Details</Label>
              <Input value={form.address_details} onChange={(e) => setForm({ ...form, address_details: e.target.value })} placeholder="e.g., Near main gate" />
            </div>
            {form.property_type === 'residential_plot' && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.has_construction} onCheckedChange={(c) => setForm({ ...form, has_construction: !!c })} />
                  <label>Has Construction</label>
                </div>
                {form.has_construction && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bedrooms</Label>
                        <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                      </div>
                      <div>
                        <Label>Bathrooms</Label>
                        <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Construction Status</Label>
                      <Select value={form.construction_status} onValueChange={(v: any) => setForm({ ...form, construction_status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="empty">Empty</SelectItem>
                          <SelectItem value="under_construction">Under Construction</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Images/Videos (Max 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-32 object-cover rounded" />
                  <Button size="sm" variant="destructive" className="absolute top-1 right-1" onClick={() => removeImage(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="border-2 border-dashed rounded h-32 flex items-center justify-center cursor-pointer hover:bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Listing'}
          </Button>
        )}
      </div>
    </div>
  )
}
