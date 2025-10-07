import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import QRCodeGenerator from './components/QRCodeGenerator';

function App() {
  return (
    <div className="App">
      {/* SEO Content Section - Hidden but accessible to search engines */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <h1>Free QR Code Generator - Create Custom QR Codes Online</h1>
        <h2>Generate QR Codes for URLs, WiFi, SMS, vCard, Email, Phone, and Text</h2>
        <p>
          Our free QR code generator allows you to create high-quality QR codes for various purposes. 
          Generate QR codes for URLs, WiFi networks, SMS messages, vCard contacts, email addresses, 
          phone numbers, and plain text. Customize your QR codes with different colors, add your logo, 
          and download them in high resolution. No registration required - start creating QR codes instantly.
        </p>
        
        <h3>QR Code Types Supported</h3>
        <ul>
          <li><strong>URL QR Codes:</strong> Create QR codes that link to websites, landing pages, or online content</li>
          <li><strong>WiFi QR Codes:</strong> Generate QR codes that automatically connect devices to WiFi networks</li>
          <li><strong>SMS QR Codes:</strong> Create QR codes that open SMS composer with pre-filled message and recipient</li>
          <li><strong>vCard QR Codes:</strong> Generate QR codes containing contact information for easy sharing</li>
          <li><strong>Email QR Codes:</strong> Create QR codes that open email composer with pre-filled recipient and subject</li>
          <li><strong>Phone QR Codes:</strong> Generate QR codes that initiate phone calls when scanned</li>
          <li><strong>Text QR Codes:</strong> Create QR codes containing plain text messages or notes</li>
        </ul>
        
        <h3>Features</h3>
        <ul>
          <li>100% Free QR code generation</li>
          <li>No registration or signup required</li>
          <li>Custom colors and styling options</li>
          <li>Logo integration capability</li>
          <li>High-resolution download options</li>
          <li>Multiple QR code formats supported</li>
          <li>Mobile-friendly interface</li>
          <li>Instant generation and download</li>
        </ul>
        
        <h3>How to Use Our QR Code Generator</h3>
        <ol>
          <li>Select the type of QR code you want to create</li>
          <li>Enter the required information in the form</li>
          <li>Customize colors, size, and add logo if desired</li>
          <li>Click generate to create your QR code</li>
          <li>Download the QR code in your preferred format</li>
        </ol>
        
        <h3>Best Practices for QR Codes</h3>
        <ul>
          <li>Use high contrast colors for better scanning</li>
          <li>Test your QR code on different devices</li>
          <li>Keep the content concise and relevant</li>
          <li>Use appropriate error correction level</li>
          <li>Ensure sufficient white space around the QR code</li>
        </ul>
        
        <h3>Common Use Cases</h3>
        <ul>
          <li>Business cards and contact sharing</li>
          <li>Restaurant menus and ordering</li>
          <li>Event tickets and registration</li>
          <li>Product information and reviews</li>
          <li>Social media profile sharing</li>
          <li>WiFi network access sharing</li>
          <li>Marketing campaigns and promotions</li>
        </ul>
      </div>
      
      <QRCodeGenerator />
    </div>
  );
}

export default App;
