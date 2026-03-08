import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnhancedPropertyCard } from '@/components/enhanced-property-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Search, ArrowRight, MapPin, Home, Store, Shield, TrendingUp, Users, CheckCircle2 } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch listings with limited data first
  const { data: listings } = await supabase
    .from('listings')
    .select(`id, title, price, listing_type, property_type, plot_size_sqyd, shop_size_sqft, block_id, phase_id, created_at, block:blocks(name), phase:phases(name), images:listing_images(image_url, is_primary)`)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6)

  const { count: totalListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1">
        {/* PREMIUM HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-0 pb-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-96 -right-96 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-96 -left-96 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
              {/* Left Content */}
              <div className="space-y-8 animate-slide-right">
                <div className="space-y-4">
                  <Badge className="bg-primary/15 text-primary border border-primary/30 font-bold px-4 py-2 text-sm">
                    Welcome to North Town
                  </Badge>
                  <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="block text-foreground">Your Dream</span>
                    <span className="block gradient-text">Property Awaits</span>
                  </h1>
                  <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-lg">
                    Explore premium residential plots and commercial spaces in North Town Residency. Verified, transparent, and trusted by thousands.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl text-lg btn-premium">
                    <Link href="/listings" className="flex items-center justify-center gap-2">
                      <Search className="h-5 w-5" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button asChild className="border-2 border-primary text-primary hover:bg-primary/10 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300">
                    <Link href="/auth/login" className="flex items-center justify-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Post a Property
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/30">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-primary">{totalListings || 0}+</div>
                    <p className="text-sm text-muted-foreground font-medium">Properties</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-secondary">3</div>
                    <p className="text-sm text-muted-foreground font-medium">Phases</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-accent">100%</div>
                    <p className="text-sm text-muted-foreground font-medium">Verified</p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden shadow-2xl animate-slide-left">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1560488204-e02f11c3d0e2?w=800&h=600&fit=crop"
                  alt="Premium North Town Properties"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH BAR SECTION */}
        <section className="py-16 bg-white border-b border-border/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Find Your Perfect Property</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl border border-border/40">
                <input 
                  type="text" 
                  placeholder="Search by location or block..." 
                  className="px-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white font-medium"
                />
                <select className="px-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white font-medium">
                  <option>All Types</option>
                  <option>Residential Plot</option>
                  <option>Commercial Shop</option>
                </select>
                <select className="px-4 py-3.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white font-medium">
                  <option>Sale / Rent</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-3.5 btn-premium">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: totalListings || 0, label: 'Active Listings', icon: '🏠' },
                { number: 3, label: 'Premium Phases', icon: '📍' },
                { number: '100%', label: 'Verified Properties', icon: '✓' },
                { number: '1000+', label: 'Happy Clients', icon: '👥' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-border/40 hover:border-primary/40 hover:shadow-lg transition-all text-center card-hover">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
              

            </div>
          </div>
        </section>


        {/* QUICK SEARCH - Simple Search Bar */}
        <section className="bg-blue-50 border-b border-border/40">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Search Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text" 
                placeholder="Location or Block" 
                className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                <option>All Property Types</option>
                <option>Residential Plot</option>
                <option>Commercial Shop</option>
              </select>
              <select className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50">
                <option>For Sale / Rent</option>
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* STATS - Simple Stats Section */}
        <section className="py-12 bg-white border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">{totalListings || 0}+</div>
                <p className="text-sm text-muted-foreground mt-2">Active Properties</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary">3</div>
                <p className="text-sm text-muted-foreground mt-2">Phases</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">100%</div>
                <p className="text-sm text-muted-foreground mt-2">Verified</p>
              </div>
              <div className="hidden md:block">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <p className="text-sm text-muted-foreground mt-2">Happy Clients</p>
              </div>
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

        {/* WHY CHOOSE US SECTION */}
        <section className="py-20 bg-white border-b border-border/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-foreground mb-4">Why Choose North Town?</h2>
              <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
                Experience a transparent, secure, and trustworthy property marketplace
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: '100% Verified', desc: 'All properties are verified by our expert team' },
                { icon: TrendingUp, title: 'Best Prices', desc: 'Get market-competitive prices with no hidden fees' },
                { icon: Users, title: 'Trusted Community', desc: 'Join 1000+ satisfied buyers and sellers' },
                { icon: MapPin, title: 'Prime Location', desc: 'North Town - the most sought-after destination' },
                { icon: CheckCircle2, title: 'Easy Process', desc: 'Simple, transparent transaction process' },
                { icon: Home, title: '24/7 Support', desc: 'Expert support whenever you need us' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-border/40 hover:border-primary/40 hover:shadow-lg transition-all card-hover">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground/80">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES SECTION */}
        {listings && listings.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-background to-primary/5 border-b border-border/20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
                <div>
                  <h2 className="text-5xl font-bold text-foreground mb-3">Featured Properties</h2>
                  <p className="text-lg text-muted-foreground/80">Browse our latest premium listings</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl mt-6 md:mt-0 btn-premium">
                  <Link href="/listings" className="flex items-center gap-2">
                    View All Listings
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing, idx) => (
                  <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <EnhancedPropertyCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ABOUT NORTH TOWN SECTION */}
        <section className="py-20 bg-white border-b border-border/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=500&fit=crop"
                  alt="North Town Community"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <Badge className="bg-secondary/15 text-secondary border border-secondary/30 font-bold mb-4">
                    About North Town
                  </Badge>
                  <h2 className="text-5xl font-bold text-foreground mb-4 leading-tight">
                    Pakistan's Premier <span className="gradient-text">Residential Community</span>
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  North Town Residency represents the pinnacle of modern urban living in Karachi. With meticulously planned phases, world-class amenities, and a vibrant community, it's where aspirations meet reality.
                </p>
                <ul className="space-y-3">
                  {['Premium residential plots in multiple sizes', 'Commercial spaces for entrepreneurs', 'State-of-the-art security systems', 'Complete infrastructure and utilities', 'Parks, schools, and shopping areas'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
                      <span className="text-muted-foreground/80 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROPERTY TYPES SECTION */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50 border-b border-border/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-foreground mb-4">Property Types</h2>
              <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
                Choose from residential plots or commercial spaces
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { title: 'Residential Plots', desc: 'Premium plots in 80, 100, and 120 Sq Yd', icon: Home, color: 'primary', count: '450+' },
                { title: 'Commercial Shops', desc: 'Prime business locations for your ventures', icon: Store, color: 'secondary', count: '200+' }
              ].map((type, i) => {
                const Icon = type.icon;
                return (
                  <Link key={i} href={`/listings?property_type=${type.title.toLowerCase().replace(' ', '_')}`}>
                    <div className={`group bg-white rounded-2xl p-10 border-2 hover:border-${type.color} hover:shadow-2xl transition-all cursor-pointer card-hover`}>
                      <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-${type.color}/10 text-${type.color} mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{type.title}</h3>
                      <p className="text-muted-foreground/80 mb-4">{type.desc}</p>
                      <div className={`text-lg font-bold text-${type.color}`}>{type.count} Available</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary to-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-5xl font-bold mb-6">Ready to Find Your Property?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Browse thousands of verified properties or post your own. Join North Town's trusted community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white hover:bg-white/95 text-primary font-bold py-4 px-10 rounded-xl text-lg btn-premium">
                <Link href="/listings">Browse Properties</Link>
              </Button>
              <Button asChild className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300">
                <Link href="/auth/login">Post Your Property</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
