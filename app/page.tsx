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
        {/* Hero Section - Modern WordPress Style with Image Gallery */}
        <section className="relative bg-white overflow-hidden">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Content - 5 columns */}
              <div className="lg:col-span-5 space-y-6">
                <Badge className="bg-primary text-white text-sm px-4 py-2 font-semibold">
                  🏘️ Premium Housing Society
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  North Town
                  <br />
                  <span className="text-primary">Residency</span>
                </h1>
                <p className="text-xl font-semibold text-foreground">Your Dream Home in Karachi</p>
                <p className="text-base text-muted-foreground">
                  Premium Residential & Commercial Plots in Phase 1, 2 & 4
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white font-bold">
                    <Link href="/listings">
                      <Search className="h-5 w-5 mr-2" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold">
                    <Link href="/auth/login">
                      <Building2 className="h-5 w-5 mr-2" />
                      Post Ad Free
                    </Link>
                  </Button>
                </div>

                {/* Inline Stats */}
                <div className="flex gap-8 pt-4 border-t">
                  <div>
                    <div className="text-3xl font-bold text-primary">{totalListings || 0}+</div>
                    <div className="text-sm text-muted-foreground">Properties</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Phases</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                </div>
              </div>

              {/* Right - Image Gallery Grid - 7 columns */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-3 h-[450px]">
                  {/* Large Image */}
                  <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
                      }}
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <Badge className="bg-accent text-foreground font-bold">Phase 1 - Titanium Block</Badge>
                    </div>
                  </div>

                  {/* Small Images */}
                  <div className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800")',
                      }}
                    />
                    <div className="absolute bottom-2 left-2 z-20">
                      <Badge className="bg-white/90 text-foreground text-xs">Phase 2</Badge>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800")',
                      }}
                    />
                    <div className="absolute bottom-2 left-2 z-20">
                      <Badge className="bg-white/90 text-foreground text-xs">Phase 4</Badge>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800")',
                      }}
                    />
                    <div className="absolute bottom-2 left-2 z-20">
                      <Badge className="bg-white/90 text-foreground text-xs">Commercial</Badge>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800")',
                      }}
                    />
                    <div className="absolute bottom-2 left-2 z-20">
                      <Badge className="bg-white/90 text-foreground text-xs">Residential</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar Below Hero */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 py-6 border-t">
            <div className="container mx-auto px-4">
              {phases && blocks && (
                <HeroSearch phases={phases} blocks={blocks} />
              )}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">100% Verified</div>
                  <div className="text-sm text-muted-foreground">Listings</div>
                </div>
              </div>
              <div className="flex items-center gap-3 animate-fade-in animation-delay-100">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="font-bold text-foreground">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
              </div>
              <div className="flex items-center gap-3 animate-fade-in animation-delay-200">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Award Winning</div>
                  <div className="text-sm text-muted-foreground">Society</div>
                </div>
              </div>
              <div className="flex items-center gap-3 animate-fade-in animation-delay-300">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">4.8/5</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Types - Large Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-4 bg-accent/10 text-accent">PROPERTY TYPES</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">What Are You Looking For?</h2>
              <p className="text-xl text-muted-foreground">Choose from residential plots or commercial spaces</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Link href="/listings?property_type=residential_plot">
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full border-2 hover:border-primary animate-slide-right">
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/50 z-10 group-hover:from-primary/80 transition-all" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
                      }}
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-8">
                      <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Home className="h-10 w-10" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">Residential Plots</h3>
                      <p className="text-lg text-center mb-6 text-white/90">
                        80, 100, 120 Sq Yd plots for your dream home
                      </p>
                      <Button size="lg" variant="secondary" className="group-hover:scale-105 transition-transform">
                        Explore Plots
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/listings?property_type=commercial_shop">
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full border-2 hover:border-accent animate-slide-left">
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-accent/50 z-10 group-hover:from-accent/80 transition-all" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
                      }}
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-8">
                      <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Store className="h-10 w-10" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">Commercial Shops</h3>
                      <p className="text-lg text-center mb-6 text-white/90">
                        Prime commercial spaces for your business
                      </p>
                      <Button size="lg" variant="secondary" className="group-hover:scale-105 transition-transform">
                        Explore Shops
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Properties */}
        {listings && listings.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-white to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-fade-in">
                <Badge className="mb-4 bg-primary/10 text-primary">LATEST LISTINGS</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Featured Properties</h2>
                <p className="text-xl text-muted-foreground">Handpicked properties just for you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <EnhancedPropertyCard listing={listing} />
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center animate-fade-in animation-delay-600">
                <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-transform">
                  <Link href="/listings">
                    View All Properties
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        <section className="py-20 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <Badge className="mb-4 bg-accent text-foreground">WHY CHOOSE US</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why NTR Properties?</h2>
              <p className="text-xl text-white/90">Your trusted partner in real estate</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Verified Listings', desc: '100% authentic properties' },
                { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive market rates' },
                { icon: Clock, title: '24/7 Support', desc: 'Always here to help' },
                { icon: Award, title: 'Trusted Platform', desc: '1000+ happy clients' }
              ].map((item, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                      <item.icon className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/80">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-accent via-accent to-accent/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to Find Your Dream Property?</h2>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied clients who found their perfect property with NTR Properties
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 hover:scale-105 transition-transform">
                <Link href="/listings">
                  <Search className="h-5 w-5" />
                  Browse Properties
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-accent font-bold text-lg px-10 hover:scale-105 transition-transform">
                <Link href="/auth/login">
                  <Building2 className="h-5 w-5" />
                  List Your Property
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
