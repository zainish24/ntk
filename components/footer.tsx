import Link from 'next/link'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Building2 className="h-4 w-4" />
              </div>
              NTR Properties
            </Link>
            <p className="text-sm text-muted-foreground/80">
              North Town Residency's property marketplace.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-foreground text-sm">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/listings" className="text-muted-foreground/80 hover:text-primary">All Properties</Link></li>
              <li><Link href="/listings?property_type=residential_plot" className="text-muted-foreground/80 hover:text-primary">Residential</Link></li>
              <li><Link href="/listings?property_type=commercial_shop" className="text-muted-foreground/80 hover:text-primary">Commercial</Link></li>
              <li><Link href="/auth/login" className="text-muted-foreground/80 hover:text-primary">Post Property</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-foreground text-sm">Contact</h4>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground/80">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>North Town, Karachi</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground/80">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground/80">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@ntrproperties.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex justify-between items-center text-xs text-muted-foreground/80">
          <p>{new Date().getFullYear()} NTR Properties. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
