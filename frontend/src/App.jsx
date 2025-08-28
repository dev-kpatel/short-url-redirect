import React, { useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Calendar,
  Link,
  ClipboardCheck,
} from 'lucide-react';

export default function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [redirectType, setRedirectType] = useState('standard');
  const [abUrls, setAbUrls] = useState({ url1: '', url2: '' });
  const [calendarUrls, setCalendarUrls] = useState({
    mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: ''
  });
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Function to handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShortenedUrl('');
    setIsCopied(false);

    let urlsData = {};
    if (redirectType === 'ab') {
      urlsData = abUrls;
    } else if (redirectType === 'calendar') {
      urlsData = calendarUrls;
    }

    const payload = {
      original_url: originalUrl,
      redirect_type: redirectType,
      urls: urlsData,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/shorten', payload);
      setShortenedUrl(`http://localhost:3001/${response.data.shortUrl}`);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error creating short URL:', error);
      setMessage('Failed to create short URL. Please try again.');
    }
  };

  // Function to copy the shortened URL to the clipboard.
  const copyToClipboard = () => {
    // This method is used as navigator.clipboard.writeText may not work in some sandboxed environments.
    const urlText = shortenedUrl;
    const textArea = document.createElement("textarea");
    textArea.value = urlText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
      // Fallback: inform the user to copy manually
      alert('Copying failed. Please manually copy the URL: ' + urlText);
    }
    document.body.removeChild(textArea);
  };

  // Helper function for rendering the icon based on the redirect type.
  const getIcon = (type) => {
    switch (type) {
      case 'redirect':
        return <Link className="w-5 h-5" />;
      case 'ab':
        return <Briefcase className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Short URL Redirect Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://www.example.com"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect Type
            </label>
            <div className="flex flex-wrap gap-4">
              {['standard', 'ab', 'calendar'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setRedirectType(type);
                    setMessage('');
                    setShortenedUrl('');
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 border rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                    redirectType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {getIcon(type)}
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional rendering for A/B redirect fields */}
          {redirectType === 'ab' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="abUrl1" className="block text-sm font-medium text-gray-700 mb-1">
                  A/B URL 1
                </label>
                <input
                  type="url"
                  id="abUrl1"
                  value={abUrls.url1}
                  onChange={(e) => setAbUrls({ ...abUrls, url1: e.target.value })}
                  placeholder="https://www.example.com/page-a"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="abUrl2" className="block text-sm font-medium text-gray-700 mb-1">
                  A/B URL 2
                </label>
                <input
                  type="url"
                  id="abUrl2"
                  value={abUrls.url2}
                  onChange={(e) => setAbUrls({ ...abUrls, url2: e.target.value })}
                  placeholder="https://www.example.com/page-b"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* Conditional rendering for Calendar redirect fields */}
          {redirectType === 'calendar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(calendarUrls).map((day) => (
                <div key={day}>
                  <label htmlFor={day} className="block text-sm font-medium text-gray-700 mb-1">
                    {day.charAt(0).toUpperCase() + day.slice(1)} URL
                  </label>
                  <input
                    type="url"
                    id={day}
                    value={calendarUrls[day]}
                    onChange={(e) => setCalendarUrls({ ...calendarUrls, [day]: e.target.value })}
                    placeholder={`URL for ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Create Short URL
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-md text-sm bg-blue-100 text-blue-800 border border-blue-200">
            {message}
          </div>
        )}

        {shortenedUrl && (
          <div className="mt-4 p-4 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-between">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline text-sm truncate"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-full ${isCopied ? 'bg-green-100' : 'bg-gray-200'} text-gray-600 hover:bg-gray-300 transition-colors`}
              aria-label="Copy to clipboard"
            >
              {isCopied ? <ClipboardCheck className="w-5 h-5 text-green-600" /> : <ClipboardCheck className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
