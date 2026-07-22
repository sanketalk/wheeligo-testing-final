import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-heading font-bold text-gradient block mb-4">WHEELIGO</span>
            <p className="text-muted-foreground">Experience luxury and performance with our premium self-drive car rental service.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/fleet" className="hover:text-primary">Our Fleet</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/corporate" className="hover:text-primary">Corporate Rentals</Link></li>
              <li><Link href="/membership" className="hover:text-primary">Memberships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>support@wheeligo.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wheeligo. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
