import Link from 'next/link'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-foreground">NTR Properties</span>
                <span className="text-xs text-muted-foreground">North Town</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Your trusted platform for buying, selling, and renting premium properties in North Town Residency, Karachi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/listings" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/listings?property_type=residential_plot" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/listings?property_type=commercial_shop" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Commercial Shops
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Post Your Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">NTR Phases</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/listings?phase=phase-1" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Phase 1
                </Link>
              </li>
              <li>
                <Link href="/listings?phase=phase-2" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Phase 2
                </Link>
              </li>
              <li>
                <Link href="/listings?phase=phase-4" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
                  Phase 4
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground/80 hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 mt-1 shrink-0 text-primary" />
                <span className="font-medium">North Town Residency, Karachi</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/80 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/80 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="font-medium">info@ntrproperties.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground/80 font-medium">
            {new Date().getFullYear()} NTR Properties. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
            <Link href="/privacy" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground/80 hover:text-primary transition-colors font-medium">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
