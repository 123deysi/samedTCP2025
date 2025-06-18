import React from "react";
import "../Styles/footer.css";
import { FaFacebook, FaWhatsapp, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo izquierda */}
        <div className="footer-side">
          <img src="/umss.png" alt="Logo Facultad" className="footer-logo" />
        </div>

        {/* Contenido central */}
        <div className="footer-center">
          {/* Íconos sociales */}
          <div className="footer-icons">
            <a
              href="https://www.facebook.com/tu-pagina"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://wa.me/59162994716"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com/tu-cuenta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="tel:+59171234567"
              aria-label="Llamar"
              title="Teléfono"
            >
              <FaPhoneAlt />
            </a>
            <a
              href="mailto:correo@iijp.org.bo"
              aria-label="Correo electrónico"
              title="Correo electrónico"
            >
              <IoMail />
            </a>
          </div>

          {/* Pie de texto */}
          <div className="footer-text">
            <p>
              © 2025 Instituto de Investigaciones Jurídicas y Políticas - Universidad Mayor de San Simón.
            </p>
          </div>
        </div>

        {/* Logo derecha */}
        <div className="footer-side">
          <img src="/iijp1.png" alt="Logo IIJP" className="footer-logo" />
        </div>
      </div>
    </footer>

  );
};

export default Footer;
