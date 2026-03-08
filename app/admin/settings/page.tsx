'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Phase, Block } from '@/lib/types'

export default function AdminSettingsPage() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [phaseDialog, setPhaseDialog] = useState(false)
  const [blockDialog, setBlockDialog] = useState(false)
  const [phaseForm, setPhaseForm] = useState({ name: '', location: '' })
  const [blockForm, setBlockForm] = useState({ phase_id: '', name: '', block_type: 'residential' as 'residential' | 'commercial' | 'mixed' })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const [phasesRes, blocksRes] = await Promise.all([
      supabase.from('phases').select('*').order('display_order'),
      supabase.from('blocks').select('*, phase:phases(name)').order('created_at')
    ])
    if (phasesRes.data) setPhases(phasesRes.data)
    if (blocksRes.data) setBlocks(blocksRes.data as Block[])
  }

  const handleAddPhase = async () => {
    if (!phaseForm.name) return
    const supabase = createClient()
    const { error } = await supabase.from('phases').insert({
      name: phaseForm.name,
      location: phaseForm.location,
      display_order: phases.length + 1,
      is_active: true
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Success', description: 'Phase added' })
      setPhaseDialog(false)
      setPhaseForm({ name: '', location: '' })
      fetchData()
    }
  }

  const handleAddBlock = async () => {
    if (!blockForm.phase_id || !blockForm.name) return
    const supabase = createClient()
    const { error } = await supabase.from('blocks').insert({
      phase_id: blockForm.phase_id,
      name: blockForm.name,
      block_type: blockForm.block_type,
      is_active: true
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Success', description: 'Block added' })
      setBlockDialog(false)
      setBlockForm({ phase_id: '', name: '', block_type: 'residential' })
      fetchData()
    }
  }

  const handleTogglePhase = async (id: string, isActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from('phases').update({ is_active: !isActive }).eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Success', description: isActive ? 'Phase deactivated' : 'Phase activated' })
      fetchData()
    }
  }

  const handleToggleBlock = async (id: string, isActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from('blocks').update({ is_active: !isActive }).eq('id', id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Success', description: isActive ? 'Block deactivated' : 'Block activated' })
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Phases & Blocks</h1>
        <p className="text-muted-foreground">Manage NTR phases and blocks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Phases</CardTitle>
            <Button size="sm" onClick={() => setPhaseDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Phase
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((phase) => (
                <div key={phase.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{phase.name}</div>
                    <div className="text-sm text-muted-foreground">{phase.location}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={phase.is_active ? 'default' : 'secondary'}>
                      {phase.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleTogglePhase(phase.id, phase.is_active)}>
                      {phase.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Blocks</CardTitle>
            <Button size="sm" onClick={() => setBlockDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Block
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blocks.map((block) => (
                <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{block.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {block.phase?.name} • {block.block_type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={block.is_active ? 'default' : 'secondary'}>
                      {block.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleToggleBlock(block.id, block.is_active)}>
                      {block.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={phaseDialog} onOpenChange={setPhaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Phase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Phase Name</Label>
              <Input
                placeholder="e.g., Phase 1"
                value={phaseForm.name}
                onChange={(e) => setPhaseForm({ ...phaseForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                placeholder="e.g., Near 4K Chowrangi"
                value={phaseForm.location}
                onChange={(e) => setPhaseForm({ ...phaseForm, location: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhaseDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPhase}>Add Phase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockDialog} onOpenChange={setBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Phase</Label>
              <Select value={blockForm.phase_id} onValueChange={(v) => setBlockForm({ ...blockForm, phase_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>{phase.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Block Name</Label>
              <Input
                placeholder="e.g., Titanium Block"
                value={blockForm.name}
                onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Block Type</Label>
              <Select value={blockForm.block_type} onValueChange={(v: any) => setBlockForm({ ...blockForm, block_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialog(false)}>Cancel</Button>
            <Button onClick={handleAddBlock}>Add Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
