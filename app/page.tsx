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
        {/* Full-Width Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-border/40 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-64 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold px-4 py-2">
                    Welcome to North Town
                  </Badge>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                    Find Your <span className="text-primary">Perfect</span> <span className="text-secondary">Property</span>
                  </h1>
                  <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl">
                    Discover premium residential plots and commercial spaces in North Town Residency, Karachi's most sought-after community.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg">
                    <Link href="/listings" className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary/10 font-bold py-3 px-8 rounded-lg">
                    <Link href="/auth/login" className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Post Property
                    </Link>
                  </Button>
                </div>

                <div className="flex gap-12 pt-8 border-t border-border">
                  <div>
                    <div className="text-3xl font-bold text-primary">{totalListings || 0}+</div>
                    <p className="text-sm text-muted-foreground font-medium">Active Properties</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">3</div>
                    <p className="text-sm text-muted-foreground font-medium">Phases</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">1000+</div>
                    <p className="text-sm text-muted-foreground font-medium">Happy Clients</p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden glass-effect border border-border">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=500&fit=crop"
                  alt="North Town Properties"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
              

            </div>
          </div>
        </section>


        {/* Advanced Search Bar Section */}
        <section className="bg-white border-b border-border/40">
          <div className="container mx-auto px-4 py-12">
            <div className="glass-effect rounded-2xl p-8 border border-border/40">
              <h2 className="text-2xl font-bold text-foreground mb-6">Advanced Search</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter location or block" 
                    className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Property Type</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    <option>All Types</option>
                    <option>Residential Plot</option>
                    <option>Commercial Shop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phase</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    <option>All Phases</option>
                    <option>Phase 1</option>
                    <option>Phase 2</option>
                    <option>Phase 4</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg py-2.5">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information & Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🏆', title: 'Award Winning', desc: 'Recognized community' },
                { icon: '🔒', title: '24/7 Security', desc: 'Safe environment' },
                { icon: '🌳', title: 'Green Spaces', desc: 'Parks & recreation' },
                { icon: '📍', title: 'Prime Location', desc: 'Easy access' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-border/40 hover:shadow-md transition-all">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats - Light Theme Cards */}
        <section className="py-16 bg-white border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: totalListings || 0, label: 'Active Properties', icon: '🏠' },
                { number: 3, label: 'Phases', icon: '📍' },
                { number: '100%', label: 'Verified', icon: '✓' },
                { number: '1000+', label: 'Happy Buyers', icon: '👥' }
              ].map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-6 border border-primary/20 hover:border-primary/40 hover:shadow-md transition-all text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Locations Section */}
        <section className="py-20 bg-white border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-2">Popular Locations</h2>
              <p className="text-muted-foreground/80">Explore premium properties across all phases</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Phase 1', count: '450+' },
                { name: 'Phase 2', count: '320+' },
                { name: 'Phase 4', count: '280+' },
                { name: 'Titanium', count: '150+' },
                { name: 'Diamond', count: '200+' },
                { name: 'Emerald', count: '180+' }
              ].map((location) => (
                <Link key={location.name} href={`/listings?phase=${location.name}`} className="group">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">{location.name}</h3>
                    <p className="text-sm text-muted-foreground/70">{location.count} properties</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* North Town About Section - WordPress Style */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Images - Left Sidebar */}
              <div className="grid grid-cols-1 gap-4">
                <div className="h-72 rounded-xl overflow-hidden border border-border shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop" 
                    alt="North Town Main" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-48 rounded-lg overflow-hidden border border-border shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=250&fit=crop" 
                      alt="Residential" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="h-48 rounded-lg overflow-hidden border border-border shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=250&fit=crop" 
                      alt="Commercial" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <span className="inline-block px-4 py-2 rounded-full bg-secondary/15 text-secondary font-semibold text-sm mb-4">About North Town</span>
                  <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                    Discover <span className="text-primary">North Town</span> Residency
                  </h2>
                  <p className="text-lg text-muted-foreground/80 leading-relaxed mb-6">
                    North Town Residency stands as Karachi's premier residential destination, offering an exceptional blend of modern living, security, and community values. With carefully planned phases featuring residential plots and commercial spaces, it's where dreams become reality.
                  </p>
                  <p className="text-lg text-muted-foreground/80 leading-relaxed">
                    Every property in North Town is a testament to quality construction, strategic location, and investment potential.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: '🏆', title: 'Award Winning', desc: 'Recognized excellence' },
                    { icon: '🔒', title: '24/7 Security', desc: 'Complete protection' },
                    { icon: '🌳', title: 'Green Spaces', desc: 'Beautiful parks' },
                    { icon: '📍', title: 'Prime Location', desc: 'Easy accessibility' }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white rounded-lg p-5 border border-border/40 hover:border-primary/40 hover:shadow-md transition-all">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className="font-bold text-foreground text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg w-full sm:w-fit">
                  <Link href="/listings" className="flex items-center justify-center gap-2">
                    Explore Properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Property Types Section */}
        <section className="py-20 bg-white border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-2">Property Types</h2>
              <p className="text-muted-foreground/80">Explore our diverse property offerings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/listings?property_type=residential_plot">
                <div className="group bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl p-10 border border-primary/20 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-8">
                    <div className="h-16 w-16 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <ArrowRight className="h-6 w-6 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">Residential Plots</h3>
                  <p className="text-muted-foreground/80 mb-4">Premium plots in various sizes including 80, 100, and 120 Sq Yd</p>
                  <div className="text-sm font-semibold text-primary">450+ Available</div>
                </div>
              </Link>

              <Link href="/listings?property_type=commercial_shop">
                <div className="group bg-gradient-to-br from-secondary/10 to-green-50 rounded-2xl p-10 border border-secondary/20 hover:border-secondary hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-8">
                    <div className="h-16 w-16 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <Store className="h-8 w-8 text-secondary" />
                    </div>
                    <ArrowRight className="h-6 w-6 text-secondary/50 group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-3 group-hover:text-secondary transition-colors">Commercial Shops</h3>
                  <p className="text-muted-foreground/80 mb-4">Prime business locations ideal for retail, offices, and commercial ventures</p>
                  <div className="text-sm font-semibold text-secondary">200+ Available</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        {listings && listings.length > 0 && (
          <section className="py-20 bg-blue-50 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-8">
                <div>
                  <span className="inline-block px-4 py-2 rounded-full bg-primary/15 text-primary font-semibold text-sm mb-4">Featured Listings</span>
                  <h2 className="text-5xl font-bold text-foreground mb-3">Latest Properties</h2>
                  <p className="text-lg text-muted-foreground/80">Handpicked premium properties for our clients</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg w-full lg:w-fit">
                  <Link href="/listings" className="flex items-center justify-center lg:justify-start gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <EnhancedPropertyCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - WordPress Style */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-2xl p-12 md:p-16 text-white relative overflow-hidden shadow-lg">
              {/* Decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              
              <div className="max-w-3xl relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Have a Property to Sell?
                </h2>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Join thousands of satisfied property owners on North Town Properties. List your residential plots or commercial spaces completely free and connect with serious buyers in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-white hover:bg-white/95 text-primary font-bold py-3 px-8 rounded-lg">
                    <Link href="/auth/login">Post Your Property Free</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg">
                    <Link href="/listings">Browse Properties</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
