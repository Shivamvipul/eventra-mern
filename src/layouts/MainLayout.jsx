import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatbotWidget from '../components/common/ChatbotWidget';
import { useSocket } from '../hooks/useSocket';

export default function MainLayout() {
  useSocket();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
