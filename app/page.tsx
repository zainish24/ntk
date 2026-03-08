import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnhancedPropertyCard } from '@/components/enhanced-property-card'
import { HeroSearch } from '@/components/hero-search'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  CheckCircle2,
  Home,
  Store,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Award,
  Star,
  Phone,
  Mail
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: listings } = await supabase
    .from('listings')
    .select(`*, phase:phases(*), block:blocks(*), images:listing_images(*)`)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6)

  const { data: phases } = await supabase
    .from('phases')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const { count: totalListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Clean Search First Design */}
        <section className="relative bg-white border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
                Find Your Perfect Property
              </h1>
              <p className="text-center text-muted-foreground mb-8 text-lg">
                Browse from thousands of residential plots and commercial properties in North Town Residency
              </p>
              
              {/* Search Bar */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                    <input 
                      type="text" 
                      placeholder="Enter location, phase, or block" 
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Property Type</label>
                    <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Types</option>
                      <option>Residential Plot</option>
                      <option>Commercial Shop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Price Range</label>
                    <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Any Price</option>
                      <option>0 - 5M</option>
                      <option>5M - 10M</option>
                      <option>10M+</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-3">
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Quick Stats */}
        <section className="py-8 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalListings || 0}+</div>
                <div className="text-sm text-muted-foreground font-medium">Active Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground font-medium">Phases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground font-medium">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground font-medium">Happy Buyers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Locations Section */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Popular Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Phase 1', count: '450+' },
                { name: 'Phase 2', count: '320+' },
                { name: 'Phase 4', count: '280+' },
                { name: 'Titanium Block', count: '150+' },
                { name: 'Diamond Block', count: '200+' },
                { name: 'Emerald Block', count: '180+' }
              ].map((location) => (
                <Link key={location.name} href={`/listings?phase=${location.name}`} className="group">
                  <div className="bg-white p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-300">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{location.name}</div>
                    <div className="text-sm text-muted-foreground">{location.count} properties</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Property Types - Simple Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Property Types</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/listings?property_type=residential_plot">
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full border border-border">
                  <div className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">Residential Plots</h3>
                      <p className="text-sm text-muted-foreground">80, 100, 120 Sq Yd</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link href="/listings?property_type=commercial_shop">
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full border border-border">
                  <div className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Store className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">Commercial Shops</h3>
                      <p className="text-sm text-muted-foreground">Prime business locations</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Properties */}
        {listings && listings.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Featured Properties</h2>
                <Button asChild variant="outline" className="text-primary border-primary">
                  <Link href="/listings">View All</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <EnhancedPropertyCard listing={listing} />
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center animate-fade-in animation-delay-600">
                <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110 shadow-lg hover:shadow-xl smooth-transition font-semibold text-lg px-8">
                  <Link href="/listings">
                    View All Properties
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-50 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="bg-primary text-white rounded-lg p-8 md:p-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">Want to List Your Property?</h2>
                <p className="text-lg text-white/90 mb-6">
                  Join thousands of property owners selling and renting their properties on NTR Properties
                </p>
                <Button asChild className="bg-white hover:bg-white/90 text-primary font-bold">
                  <Link href="/auth/login">Post Your Property Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
