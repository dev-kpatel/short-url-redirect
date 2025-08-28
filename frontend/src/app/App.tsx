import { Routes, Route } from "react-router-dom";
import { HomePage, RedirectLinkPage, AbLinkPage, CalendarLinkPage, RedirectPage  } from "@pages";
import { Shell } from "@components/layout/Shell";


export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Shell><HomePage /></Shell>} />
        <Route path="/app/redirect" element={<Shell><RedirectLinkPage /></Shell>} />
        <Route path="/app/ab" element={<Shell><AbLinkPage /></Shell>} />
        <Route path="/app/calendar" element={<Shell><CalendarLinkPage /></Shell>} />
        {/* Dynamic routes */}
        <Route path="/:slug" element={<RedirectPage />} />
        <Route path="/ab/:slug" element={<RedirectPage />} />
        <Route path="/c/:t/:slug" element={<RedirectPage />} />
      </Routes>
  );
}
