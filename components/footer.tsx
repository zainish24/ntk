import Link from 'next/link'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">NTR Properties</span>
                <span className="text-xs text-muted-foreground">North Town Residency</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted platform for buying, selling, and renting properties in North Town Residency, Karachi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/listings?property_type=residential_plot" className="text-muted-foreground hover:text-foreground transition-colors">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/listings?property_type=commercial_shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  Commercial Shops
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Post Your Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Phases */}
          <div>
            <h4 className="font-semibold mb-4">NTR Phases</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings?phase=phase-1" className="text-muted-foreground hover:text-foreground transition-colors">
                  Phase 1
                </Link>
              </li>
              <li>
                <Link href="/listings?phase=phase-2" className="text-muted-foreground hover:text-foreground transition-colors">
                  Phase 2
                </Link>
              </li>
              <li>
                <Link href="/listings?phase=phase-4" className="text-muted-foreground hover:text-foreground transition-colors">
                  Phase 4
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>North Town Residency, Main Superhighway, Karachi</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@ntrproperties.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} NTR Properties. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
