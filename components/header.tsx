'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Shield, Home, Building2, PlusCircle } from 'lucide-react'

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        console.log('User profile:', profile)
        setProfile(profile)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user)
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profile)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    console.log('Sign out clicked')
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    alert('Signed out successfully')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/98 backdrop-blur-sm supports-[backdrop-filter]:bg-card/95 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group hover:scale-105 smooth-transition">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none text-foreground group-hover:text-primary smooth-transition">NTR Properties</span>
              <span className="text-xs text-muted-foreground">North Town Residency</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/listings" 
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Building2 className="h-4 w-4" />
              Properties
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/post" 
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <PlusCircle className="h-4 w-4" />
              Post Ad
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button onClick={handleSignOut} className="gap-2 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg smooth-transition">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/listings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Properties
              </Link>
              <Link 
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/dashboard/post"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Post Ad
              </Link>
              <Link 
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
