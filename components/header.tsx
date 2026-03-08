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
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent text-white flex items-center justify-center font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
              NTR
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">NTR</span>
              <span className="text-xs text-muted-foreground/70">Properties</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-muted-foreground/80 hover:text-primary transition-colors duration-300">
              Home
            </Link>
            <Link href="/listings" className="text-sm font-semibold text-muted-foreground/80 hover:text-secondary transition-colors duration-300">
              Properties
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground/80 hover:text-accent transition-colors duration-300">
                  Dashboard
                </Link>
                <Link href="/admin" className="text-sm font-semibold text-muted-foreground/80 hover:text-primary transition-colors duration-300">
                  Admin
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button asChild size="sm" className="bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/50 text-foreground font-semibold transition-all">
                  <Link href="/dashboard/post">+ Post Property</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="gap-2 glass-effect hover:bg-primary/20 border-primary/30 text-foreground">
                      <UserIcon className="h-4 w-4" />
                      Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect border-primary/30">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 font-semibold">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
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
