import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Calculator by Suresh. All rights reserved.</p>
    </footer>
  );
}