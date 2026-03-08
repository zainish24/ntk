import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnhancedPropertyCard } from '@/components/enhanced-property-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Search, ArrowRight } from 'lucide-react'

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
        {/* CLEAN HERO - Simple Professional Design */}
        <section className="bg-white border-b border-border/40">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl">
              <Badge className="bg-primary/10 text-primary border-primary/30 font-semibold mb-4">
                North Town Residency
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Find Your Property in North Town
              </h1>
              <p className="text-xl text-muted-foreground/80 mb-8 max-w-2xl">
                Buy, sell, or rent residential plots and commercial properties. Safe, verified, and easy.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 text-lg rounded-lg">
                  <Link href="/listings" className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Browse Properties
                  </Link>
                </Button>
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-6 px-8 text-lg rounded-lg">
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Post Property
                  </Link>
                </Button>
              </div>
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

        {/* FEATURED PROPERTIES - Clean Grid */}
        {listings && listings.length > 0 && (
          <section className="py-16 bg-white border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-foreground">Latest Properties</h2>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg">
                  <Link href="/listings" className="flex items-center gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id}>
                    <EnhancedPropertyCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA SECTION - Simple Call to Action */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Have a Property to List?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of property owners. Post your property for free and reach serious buyers instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white hover:bg-white/95 text-primary font-bold py-3 px-8 rounded-lg">
                <Link href="/auth/login">Post Property Free</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg">
                <Link href="/listings">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
