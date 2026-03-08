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
        {/* Hero Section - Premium Real Estate Design */}
        <section className="relative bg-gradient-to-br from-background via-card to-secondary/20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80px_80px_at_50%_-20%,rgba(196,119,90,0.3),rgba(255,255,255,0))]" />
          </div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content - 5 columns */}
              <div className="lg:col-span-5 space-y-8 animate-fade-in">
                <Badge className="bg-primary/20 text-primary text-sm px-4 py-2.5 font-semibold border border-primary/30 w-fit">
                  ✨ Premium Housing Society
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-foreground">
                  North Town
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Residency</span>
                </h1>
                <p className="text-2xl font-semibold text-foreground">Your Dream Home in Karachi</p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Premium Residential & Commercial Plots in Phase 1, 2 & 4
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:scale-105 smooth-transition">
                    <Link href="/listings">
                      <Search className="h-5 w-5 mr-2" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 font-bold smooth-transition">
                    <Link href="/auth/login">
                      <Building2 className="h-5 w-5 mr-2" />
                      Post Ad Free
                    </Link>
                  </Button>
                </div>

                {/* Inline Stats */}
                <div className="flex gap-12 pt-8 border-t-2 border-border/50">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{totalListings || 0}+</div>
                    <div className="text-sm font-semibold text-muted-foreground">Properties</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">3</div>
                    <div className="text-sm font-semibold text-muted-foreground">Phases</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">100%</div>
                    <div className="text-sm font-semibold text-muted-foreground">Verified</div>
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
        <section className="py-16 bg-gradient-to-r from-card to-secondary/50 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
              <div className="flex items-center gap-4 animate-fade-in group">
                <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 smooth-transition">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">100% Verified</div>
                  <div className="text-sm text-muted-foreground font-medium">Listings</div>
                </div>
              </div>
              <div className="flex items-center gap-4 animate-fade-in animation-delay-100 group">
                <div className="h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 smooth-transition">
                  <Users className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">1000+</div>
                  <div className="text-sm text-muted-foreground font-medium">Happy Clients</div>
                </div>
              </div>
              <div className="flex items-center gap-4 animate-fade-in animation-delay-200 group">
                <div className="h-14 w-14 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 smooth-transition">
                  <Award className="h-7 w-7 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">Award Winning</div>
                  <div className="text-sm text-muted-foreground font-medium">Society</div>
                </div>
              </div>
              <div className="flex items-center gap-4 animate-fade-in animation-delay-300 group">
                <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 smooth-transition">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">4.8/5</div>
                  <div className="text-sm text-muted-foreground font-medium">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Types - Large Cards */}
        <section className="py-24 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 space-y-4 animate-fade-in">
              <Badge className="mb-4 bg-accent/20 text-accent font-semibold px-4 py-2">PROPERTY TYPES</Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">What Are You Looking For?</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Choose from premium residential plots or commercial spaces tailored for your lifestyle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              <Link href="/listings?property_type=residential_plot">
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full border-2 border-border hover:border-primary animate-slide-right">
                  <div className="relative h-96 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40 z-10 group-hover:from-primary/90 group-hover:via-primary/60 transition-all duration-700" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                      style={{
                        backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
                      }}
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-8">
                      <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 group-hover:scale-125 group-hover:bg-white/30 transition-all duration-500">
                        <Home className="h-12 w-12" />
                      </div>
                      <h3 className="text-4xl font-bold mb-4 text-center">Residential Plots</h3>
                      <p className="text-lg text-center mb-8 text-white/95 font-medium">
                        80, 100, 120 Sq Yd plots for your dream home
                      </p>
                      <Button size="lg" variant="secondary" className="group-hover:scale-110 smooth-transition font-semibold">
                        Explore Plots
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/listings?property_type=commercial_shop">
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full border-2 border-border hover:border-accent animate-slide-left">
                  <div className="relative h-96 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/95 via-accent/70 to-accent/40 z-10 group-hover:from-accent/90 group-hover:via-accent/60 transition-all duration-700" />
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"
                      style={{
                        backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
                      }}
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-8">
                      <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 group-hover:scale-125 group-hover:bg-white/30 transition-all duration-500">
                        <Store className="h-12 w-12" />
                      </div>
                      <h3 className="text-4xl font-bold mb-4 text-center">Commercial Shops</h3>
                      <p className="text-lg text-center mb-8 text-white/95 font-medium">
                        Prime commercial spaces for your business
                      </p>
                      <Button size="lg" variant="secondary" className="group-hover:scale-110 smooth-transition font-semibold">
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
          <section className="py-24 bg-gradient-to-br from-card via-background to-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-20 space-y-4 animate-fade-in">
                <Badge className="mb-4 bg-primary/20 text-primary font-semibold px-4 py-2">LATEST LISTINGS</Badge>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Featured Properties</h2>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Handpicked premium properties curated just for you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Why Choose Us */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20 space-y-4 animate-fade-in">
              <Badge className="mb-4 bg-white/20 text-white font-semibold px-4 py-2 border border-white/30">WHY CHOOSE US</Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Why NTR Properties?</h2>
              <p className="text-2xl text-white/95 font-medium">Your trusted partner in real estate excellence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Verified Listings', desc: '100% authentic properties you can trust' },
                { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive market rates guaranteed' },
                { icon: Clock, title: '24/7 Support', desc: 'Always here to assist and support you' },
                { icon: Award, title: 'Trusted Platform', desc: '1000+ happy clients nationwide' }
              ].map((item, index) => (
                <Card key={index} className="bg-white/15 backdrop-blur-md border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-500 animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-8 text-center">
                    <div className="h-18 w-18 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 smooth-transition animate-bounce-slow">
                      <item.icon className="h-9 w-9 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-white/90 font-medium leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 bg-gradient-to-r from-accent via-accent/95 to-accent/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-8">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-md"
              style={{
                backgroundImage: 'url("http://manahilestate.com/wp-content/uploads/2018/04/North-Town-Residency-Karachi.jpg")',
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10 space-y-8 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Ready to Find Your Dream Property?</h2>
            <p className="text-2xl text-foreground/90 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied clients who found their perfect property with NTR Properties
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 hover:scale-110 shadow-xl hover:shadow-2xl smooth-transition">
                <Link href="/listings">
                  <Search className="h-5 w-5" />
                  Browse Properties
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 border-2 border-foreground text-foreground hover:bg-foreground/10 hover:border-foreground/80 font-bold text-lg px-12 hover:scale-110 smooth-transition">
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
