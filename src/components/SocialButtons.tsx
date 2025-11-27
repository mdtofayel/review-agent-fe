// src/components/SocialButtons.tsx

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M22 12a10 10 0 10-11.56 9.88v-7H8.1V12h2.34V9.8c0-2.3 1.37-3.58 3.47-3.58.7 0 1.44.12 1.44.12v2.37h-.81c-1.13 0-1.48.7-1.48 1.42V12h2.52l-.4 2.88h-2.12v7A10 10 0 0022 12z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M19.95 7.14c.01.17.01.33.01.5 0 5.1-3.88 10.97-10.97 10.97A10.9 10.9 0 010 17.6a7.74 7.74 0 005.7-1.6 3.87 3.87 0 01-3.61-2.68c.24.05.49.07.75.07.36 0 .72-.05 1.05-.14A3.86 3.86 0 01.76 9.5v-.05c.52.29 1.12.46 1.76.48A3.86 3.86 0 011.32 5.5a3.83 3.83 0 001.76.49A3.86 3.86 0 015.9 4a3.87 3.87 0 016.7 3.53 10.95 10.95 0 007.95-4.03 3.87 3.87 0 01-1.7 2.13 7.7 7.7 0 002.22-.61 8.25 8.25 0 01-1.12 1.12z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1111.5 17 4.5 4.5 0 0112 7.5zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zm4.75-3.25a1.25 1.25 0 11-1.25 1.25 1.25 1.25 0 011.25-1.25z"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M21.8 8.3a2.5 2.5 0 00-1.76-1.77C18.25 6 12 6 12 6s-6.25 0-8.04.53A2.5 2.5 0 002.2 8.3 26 26 0 002 12a26 26 0 00.2 3.7 2.5 2.5 0 001.76 1.77C5.75 18 12 18 12 18s6.25 0 8.04-.53a2.5 2.5 0 001.76-1.77A26 26 0 0022 12a26 26 0 00-.2-3.7zM10 14.5v-5l4 2.5z"
      />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M18.5 7.5a4.5 4.5 0 01-3.4-1.6V14a5 5 0 11-4.2-4.9v2.2a2.5 2.5 0 102.1 2.47V2h2.4A4.5 4.5 0 0018.5 6z"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 102.5 6 2.5 2.5 0 004.98 3.5zM3 8.5h4v12H3zM10 8.5h3.8v1.7h.05a4.1 4.1 0 013.7-2c4 0 4.7 2.6 4.7 5.9v6.4h-4v-5.7c0-1.36 0-3.1-1.9-3.1s-2.2 1.48-2.2 3v5.8h-4z"
      />
    </svg>
  );
}

export default function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <FacebookIcon />
        <span>Facebook</span>
      </button>
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <TwitterIcon />
        <span>Twitter</span>
      </button>
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <InstagramIcon />
        <span>Instagram</span>
      </button>
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <YoutubeIcon />
        <span>YouTube</span>
      </button>
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <TiktokIcon />
        <span>TikTok</span>
      </button>
      <button className="border rounded-sm px-2 py-2 flex items-center gap-2">
        <LinkedinIcon />
        <span>LinkedIn</span>
      </button>
    </div>
  );
}
