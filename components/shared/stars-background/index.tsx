// imported from https://github.com/nextauthjs/next-auth/blob/main/docs/pages/animated-stars.css
import './animated-stars.css'

export default function StarsBackground() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-0">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
    </div>
  )
}
