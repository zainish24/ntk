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
        {/* Hero Section - Premium Vibrant Design */}
        <section className="relative bg-gradient-to-b from-background via-card/50 to-background border-b border-border/30 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 font-semibold px-4 py-1.5">
                  ✨ Premium Real Estate Platform
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 leading-tight">
                  Find Your Perfect Property
                </h1>
                <p className="text-center text-muted-foreground/90 mb-10 text-lg max-w-2xl mx-auto">
                  Explore premium residential plots and commercial spaces in North Town Residency, Karachi
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-foreground/80 mb-2">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter location, phase, or block" 
                    className="w-full px-5 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all group-hover:border-primary/30"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-foreground/80 mb-2">Property Type</label>
                  <select className="w-full px-5 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all group-hover:border-secondary/30">
                    <option>All Types</option>
                    <option>Residential Plot</option>
                    <option>Commercial Shop</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-foreground/80 mb-2">Price Range</label>
                  <select className="w-full px-5 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-accent/30">
                    <option>Any Price</option>
                    <option>0 - 5M</option>
                    <option>5M - 10M</option>
                    <option>10M+</option>
                  </select>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-xl hover:shadow-primary/30 text-white font-bold py-3 text-lg rounded-xl transition-all">
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </section>


        {/* Quick Stats - Vibrant Cards */}
        <section className="py-16 bg-gradient-to-b from-background to-card/30 border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: totalListings || 0, label: 'Active Properties', icon: '🏠', color: 'from-primary to-primary/50' },
                { number: 3, label: 'Phases', icon: '📍', color: 'from-secondary to-secondary/50' },
                { number: '100%', label: 'Verified', icon: '✓', color: 'from-accent to-accent/50' },
                { number: '1000+', label: 'Happy Buyers', icon: '😊', color: 'from-primary via-secondary to-accent' }
              ].map((stat, i) => (
                <div key={i} className="glass-effect rounded-2xl p-6 text-center group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}+
                  </div>
                  <div className="text-sm text-muted-foreground/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Locations - Vibrant Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">Popular Locations in NTR</h2>
              <p className="text-muted-foreground/80">Explore premium properties across all phases and blocks</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Phase 1', count: '450+', color: 'from-primary/20 to-primary/5', border: 'border-primary/30' },
                { name: 'Phase 2', count: '320+', color: 'from-secondary/20 to-secondary/5', border: 'border-secondary/30' },
                { name: 'Phase 4', count: '280+', color: 'from-accent/20 to-accent/5', border: 'border-accent/30' },
                { name: 'Titanium', count: '150+', color: 'from-primary/15 to-secondary/15', border: 'border-primary/20' },
                { name: 'Diamond', count: '200+', color: 'from-secondary/15 to-accent/15', border: 'border-secondary/20' },
                { name: 'Emerald', count: '180+', color: 'from-accent/15 to-primary/15', border: 'border-accent/20' }
              ].map((location) => (
                <Link key={location.name} href={`/listings?phase=${location.name}`} className="group">
                  <div className={`bg-gradient-to-br ${location.color} p-5 rounded-xl border ${location.border} hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300`}>
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">{location.name}</div>
                    <div className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground">{location.count} properties</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* North Town Residency Showcase */}
        <section className="py-20 bg-gradient-to-b from-card/50 to-background border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 h-64 rounded-2xl overflow-hidden glass-effect border-border/30">
                  <img 
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop" 
                    alt="North Town Residency Main" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-48 rounded-xl overflow-hidden glass-effect border-border/30">
                  <img 
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop" 
                    alt="Residential Plot" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-48 rounded-xl overflow-hidden glass-effect border-border/30">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" 
                    alt="Commercial Space" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 font-semibold px-4 py-1.5">
                    About North Town
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    North Town Residency
                  </h2>
                  <p className="text-muted-foreground/80 text-lg leading-relaxed">
                    North Town Residency is one of Karachi's most sought-after residential communities, offering premium plots and commercial spaces across multiple phases.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: '🏘️', title: 'Premium Society', desc: 'Award-winning planned community' },
                    { icon: '🛡️', title: '24/7 Security', desc: 'State-of-the-art security systems' },
                    { icon: '🌳', title: 'Green Spaces', desc: 'Parks and recreational areas' },
                    { icon: '🚗', title: 'Prime Location', desc: 'Easy access to main highways' }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-bold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground/70">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-xl hover:shadow-primary/30 text-white font-bold py-3 text-base rounded-xl">
                  <Link href="/listings">Explore All Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Property Types - Premium Cards */}
        <section className="py-20 bg-background border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-2">Property Types</h2>
              <p className="text-muted-foreground/80">Choose from our diverse range of properties</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/listings?property_type=residential_plot">
                <div className="group glass-effect rounded-2xl p-8 border-border/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors mb-2">Residential Plots</h3>
                  <p className="text-muted-foreground/70">80, 100, 120 Sq Yd premium plots</p>
                </div>
              </Link>

              <Link href="/listings?property_type=commercial_shop">
                <div className="group glass-effect rounded-2xl p-8 border-border/30 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-accent/30 transition-all">
                      <Store className="h-8 w-8 text-accent" />
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground group-hover:text-accent transition-colors mb-2">Commercial Shops</h3>
                  <p className="text-muted-foreground/70">Prime business locations & spaces</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Properties - Premium Grid */}
        {listings && listings.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-background to-card/30 border-b border-border/30">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Featured Properties</h2>
                  <p className="text-muted-foreground/80">Discover premium listings handpicked for you</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/30 text-foreground font-semibold w-fit">
                  <Link href="/listings" className="flex items-center gap-2">
                    View All Properties
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

        {/* CTA Section - Premium */}
        <section className="py-20 bg-gradient-to-r from-background via-card/50 to-background border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="glass-effect rounded-3xl p-12 md:p-16 border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
              
              <div className="max-w-3xl relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Ready to List Your Property?
                </h2>
                <p className="text-lg text-muted-foreground/80 mb-8 leading-relaxed">
                  Join thousands of successful property owners who trust NTR Properties. List your residential plots and commercial spaces for free and reach thousands of potential buyers.
                </p>
                <Button asChild className="bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-xl hover:shadow-primary/40 text-white font-bold text-lg px-8 py-6 rounded-xl">
                  <Link href="/auth/login">Start Listing Now - It's Free!</Link>
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
