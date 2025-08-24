const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-4">
          <p className="text-lg">
            &copy; 2025 Enterprise. La revolución en integración WhatsApp para GoHighLevel.
          </p>
          <p className="text-sm text-gray-400">
            Soporte:{' '}
            <a 
              href="mailto:info@enterprise.com" 
              className="text-whatsapp hover:text-whatsapp-light transition-colors"
            >
              info@enterprise.com
            </a>
            {' | '}
            WhatsApp:{' '}
            <a 
              href="https://wa.me/19292351350" 
              className="text-whatsapp hover:text-whatsapp-light transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              +1 (929) 235-1350
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;