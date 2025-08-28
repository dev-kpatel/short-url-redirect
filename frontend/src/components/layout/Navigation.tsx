import { Link, useLocation } from "react-router-dom";
import { cn } from "@shared/lib/cn";
import { Menu, X } from "lucide-react";

const navigation:Array<{ name: string; href: string }> = [
  { name: 'Dashboard', href: '/' },
  { name: 'Redirect', href: '/app/redirect' },
  { name: 'AB Test', href: '/app/ab' },
  { name: 'Calendar Links', href: '/app/calendar' },
]

export const Navigation = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-full">
      <nav className="border-b bg-white shadow-sm">
        {/* <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="text-lg font-semibold text-indigo-600">
          Short URL Redirect
        </Link>
        <nav className="space-x-4 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/app/redirect" className="hover:underline">Redirect</Link>
          <Link to="/app/ab" className="hover:underline">AB Test</Link>
          <Link to="/app/calendar" className="hover:underline">Calendar Links</Link>
        </nav>
      </div> */}
        <div className="mx-start max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shuffle text-indigo" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5" />
                  <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192" />
                </svg>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={item.href == pathname ? 'page' : undefined}
                      className={cn(
                        item.href == pathname
                          ? 'bg-indigo-500 text-white'
                          : 'text-indigo-950 hover:bg-indigo-500 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}>{item.name}</Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <div className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-indigo-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Menu aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <X aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
