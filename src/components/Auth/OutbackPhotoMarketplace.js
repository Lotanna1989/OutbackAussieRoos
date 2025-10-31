import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, MapPin, DollarSign, Eye, Download, Heart, Share2, Tag, Filter, Search, Grid, List, CheckCircle, AlertCircle, Clock, Star, Users, TrendingUp, X, Wallet } from 'lucide-react';
import * as solanaWeb3 from '@solana/web3.js';

// Solana Configuration
const SOLANA_NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
const TREASURY_WALLET = 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH'; // Replace with your treasury wallet

const OutbackPhotoMarketplace = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState('marketplace');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'landscape',
    file: null,
    preview: null
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
        await updateWalletBalance(response.publicKey.toString());
      }
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { solana } = window;
      
      if (!solana || !solana.isPhantom) {
        alert('Please install Phantom Wallet!\n\nVisit: https://phantom.app');
        window.open('https://phantom.app', '_blank');
        return;
      }

      const response = await solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      await updateWalletBalance(address);
      
      console.log('Connected to wallet:', address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        await solana.disconnect();
        setWalletAddress('');
        setWalletBalance('0');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const updateWalletBalance = async (address) => {
    try {
      const response = await fetch(`https://api.${SOLANA_NETWORK}.solana.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });
      
      const data = await response.json();
      const balance = (data.result.value / 1e9).toFixed(4);
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Photos', icon: '📸', count: '2,847+' },
    { id: 'spiritual', name: 'Sacred Sites', icon: '🏛️', count: '426+' },
    { id: 'wildlife', name: 'Wildlife', icon: '🦘', count: '1,234+' },
    { id: 'landscape', name: 'Landscapes', icon: '🏜️', count: '892+' },
    { id: 'culture', name: 'Aboriginal Culture', icon: '🎨', count: '295+' },
    { id: 'astronomy', name: 'Night Sky', icon: '⭐', count: '178+' }
  ];

  const featuredPhotos = [
    {
      id: 1,
      title: "Uluru at Golden Hour",
      photographer: "Sarah Outback",
      photographerWallet: "8xK9...mN2p",
      location: "Uluru-Kata Tjuta National Park, NT",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      price: "0.5",
      currency: "SOL",
      views: 1247,
      likes: 89,
      category: "landscape",
      description: "Captured during the magical golden hour, this image shows Uluru in all its majestic glory.",
      tags: ["uluru", "sunset", "sacred", "outback"],
      resolution: "4K",
      uploadDate: "2024-03-15",
      verified: true
    },
    {
      id: 2,
      title: "Red Kangaroo Family",
      photographer: "Jack Bushman",
      photographerWallet: "7yJ8...kL3q",
      location: "Alice Springs, NT",
      image: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=600&h=400&fit=crop",
      price: "0.3",
      currency: "SOL",
      views: 892,
      likes: 67,
      category: "wildlife",
      description: "A mother kangaroo with her joey, photographed in their natural habitat.",
      tags: ["kangaroo", "wildlife", "family", "nature"],
      resolution: "6K",
      uploadDate: "2024-03-12",
      verified: true
    },
    {
      id: 3,
      title: "Ancient Rock Art",
      photographer: "Emma Dreaming",
      photographerWallet: "9zA7...pQ4r",
      location: "Kakadu National Park, NT",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      price: "0.8",
      currency: "SOL",
      views: 2134,
      likes: 156,
      category: "spiritual",
      description: "40,000-year-old Aboriginal rock art depicting Dreamtime stories.",
      tags: ["aboriginal", "rock-art", "ancient", "culture"],
      resolution: "8K",
      uploadDate: "2024-03-10",
      verified: true
    },
    {
      id: 4,
      title: "Milky Way over Outback",
      photographer: "Steve Stargazer",
      photographerWallet: "6xI9...nM5s",
      location: "Coober Pedy, SA",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=400&fit=crop",
      price: "0.6",
      currency: "SOL",
      views: 1456,
      likes: 98,
      category: "astronomy",
      description: "The Milky Way galaxy captured above the South Australian outback.",
      tags: ["milky-way", "stars", "astronomy", "night"],
      resolution: "12K",
      uploadDate: "2024-03-08",
      verified: true
    },
    {
      id: 5,
      title: "Devils Marbles Formation",
      photographer: "Mike Rockhopper",
      photographerWallet: "5wH8...oP6t",
      location: "Karlu Karlu, NT",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&h=400&fit=crop",
      price: "0.4",
      currency: "SOL",
      views: 743,
      likes: 52,
      category: "landscape",
      description: "The mysterious granite boulders known as Devils Marbles.",
      tags: ["devils-marbles", "granite", "formation", "geology"],
      resolution: "5K",
      uploadDate: "2024-03-05",
      verified: true
    },
    {
      id: 6,
      title: "Wedge-tailed Eagle",
      photographer: "Lisa Wingspan",
      photographerWallet: "4vG7...mO7u",
      location: "Flinders Ranges, SA",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
      price: "0.7",
      currency: "SOL",
      views: 1089,
      likes: 78,
      category: "wildlife",
      description: "Australia's largest bird of prey soaring over the Flinders Ranges.",
      tags: ["eagle", "bird", "prey", "flight"],
      resolution: "7K",
      uploadDate: "2024-03-02",
      verified: true
    }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadData({
        ...uploadData,
        file: file,
        preview: URL.createObjectURL(file)
      });
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!walletAddress) {
      alert('Please connect your Phantom Wallet first');
      return;
    }

    if (!uploadData.title || !uploadData.description || !uploadData.price || !uploadData.file) {
      alert('Please fill in all required fields and select an image');
      return;
    }

    setLoading(true);

    try {
      const { solana } = window;
      
      // Create transaction for listing fee
      const transaction = new solanaWeb3.Transaction();
      
      const listingFee = 0.001; // 0.001 SOL listing fee
      const lamports = listingFee * solanaWeb3.LAMPORTS_PER_SOL;
      
      transaction.add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: new solanaWeb3.PublicKey(walletAddress),
          toPubkey: new solanaWeb3.PublicKey(TREASURY_WALLET),
          lamports: lamports,
        })
      );

      // Get recent blockhash
      const response = await fetch(`https://api.${SOLANA_NETWORK}.solana.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getLatestBlockhash',
          params: []
        })
      });
      
      const data = await response.json();
      transaction.recentBlockhash = data.result.value.blockhash;
      transaction.feePayer = new solanaWeb3.PublicKey(walletAddress);

      // Sign and send transaction
      const signed = await solana.signAndSendTransaction(transaction);
      
      console.log('Photo listed! Transaction:', signed.signature);

      alert(`✅ Photo uploaded successfully!

Title: ${uploadData.title}
Location: ${uploadData.location}
Price: ${uploadData.price} SOL
Category: ${uploadData.category}

Transaction: ${signed.signature}

Your photo is now available for purchase in the marketplace!

View on Solana Explorer:
https://explorer.solana.com/tx/${signed.signature}?cluster=${SOLANA_NETWORK}`);

      setUploadData({
        title: '',
        description: '',
        price: '',
        location: '',
        category: 'landscape',
        file: null,
        preview: null
      });
      setShowUploadModal(false);
      await updateWalletBalance(walletAddress);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`❌ Failed to upload photo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (photo) => {
    if (!walletAddress) {
      alert('Please connect your Phantom Wallet first');
      return;
    }

    setLoading(true);

    try {
      const { solana } = window;
      
      // Load Solana web3.js from CDN if not already loaded
      if (typeof solanaWeb3 === 'undefined') {
        await loadSolanaWeb3();
      }

      const transaction = new solanaWeb3.Transaction();
      
      const lamports = parseFloat(photo.price) * solanaWeb3.LAMPORTS_PER_SOL;
      
      transaction.add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: new solanaWeb3.PublicKey(walletAddress),
          toPubkey: new solanaWeb3.PublicKey(TREASURY_WALLET),
          lamports: lamports,
        })
      );

      // Get recent blockhash
      const response = await fetch(`https://api.${SOLANA_NETWORK}.solana.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getLatestBlockhash',
          params: []
        })
      });
      
      const data = await response.json();
      transaction.recentBlockhash = data.result.value.blockhash;
      transaction.feePayer = new solanaWeb3.PublicKey(walletAddress);

      const signed = await solana.signAndSendTransaction(transaction);
      
      console.log('Purchase successful! Transaction:', signed.signature);

      alert(`✅ Purchase successful!

Photo: ${photo.title}
Photographer: ${photo.photographer}
Price: ${photo.price} SOL
Location: ${photo.location}

Transaction: ${signed.signature}

High-resolution download will begin shortly.

View on Solana Explorer:
https://explorer.solana.com/tx/${signed.signature}?cluster=${SOLANA_NETWORK}`);

      await updateWalletBalance(walletAddress);
      setSelectedPhoto(null);

    } catch (error) {
      console.error('Purchase failed:', error);
      if (error.message.includes('insufficient')) {
        alert('❌ Insufficient SOL balance for this purchase');
      } else {
        alert(`❌ Failed to purchase photo: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSolanaWeb3 = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/solana-web3.js/1.87.6/index.iife.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const filteredPhotos = featuredPhotos.filter(photo => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'popular':
        return b.views - a.views;
      case 'liked':
        return b.likes - a.likes;
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const formatWalletAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden relative">
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-red-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Outback Visions
                </h1>
                <p className="text-xs text-gray-500 flex items-center">
                  Solana-Powered Photography • {SOLANA_NETWORK.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveView('marketplace')}
                className={`transition-colors flex items-center hover:scale-105 transform ${
                  activeView === 'marketplace' ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Marketplace
              </button>
              <button 
                onClick={() => setActiveView('upload')}
                className={`transition-colors flex items-center hover:scale-105 transform ${
                  activeView === 'upload' ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Sell Photos
              </button>
              <button className="text-gray-600 hover:text-red-600 transition-colors flex items-center hover:scale-105 transform">
                <Users className="w-4 h-4 mr-2" />
                Community
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {walletAddress && (
                <div className="text-sm bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                  <div className="text-purple-600 font-medium text-xs">Balance</div>
                  <div className="text-gray-800 font-bold">{walletBalance} SOL</div>
                </div>
              )}
              
              {walletAddress ? (
                <div className="flex items-center space-x-2">
                  <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatWalletAddress(walletAddress)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 hover:shadow-xl text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect Phantom</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {activeView === 'marketplace' && (
        <>
          <section className={`pt-32 pb-20 transition-all duration-1000 relative z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 rounded-full px-8 py-3 mb-8 border-3 border-red-300 shadow-2xl animate-pulse">
                  <Camera className="w-6 h-6 mr-3 text-red-700" />
                  <span className="text-red-700 font-bold text-lg">Authentic Australian Outback Photography on Solana</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                  <div className="bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-4 mb-4">
                    Capture the Spirit
                  </div>
                  <div className="text-gray-800 flex items-center justify-center gap-6">
                    of the Outback
                  </div>
                </h2>
                
                <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto">
                  Discover and purchase authentic photography from Australia's remote outback. 
                  All transactions secured on Solana blockchain.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                  <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className="text-3xl font-bold text-red-600 mb-1">2,847</div>
                    <div className="text-gray-600">Photos Available</div>
                  </div>
                  <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-3xl font-bold text-orange-600 mb-1">187</div>
                    <div className="text-gray-600">Photographers</div>
                  </div>
                  <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-yellow-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-3xl font-bold text-yellow-600 mb-1">45</div>
                    <div className="text-gray-600">Outback Locations</div>
                  </div>
                  <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-3xl font-bold text-purple-600 mb-1">1,274 SOL</div>
                    <div className="text-gray-600">Total Sales</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-br from-red-100 to-orange-100 border-red-400 shadow-xl'
                        : 'bg-white/70 backdrop-blur border-gray-200 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h4 className="font-bold text-sm mb-1 text-gray-800">{category.name}</h4>
                      <p className="text-gray-600 text-xs">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/70 backdrop-blur rounded-2xl p-4 border border-gray-200">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search photos, locations, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="liked">Most Liked</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10 bg-white/30 backdrop-blur relative z-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {sortedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className={`object-cover ${viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'}`}
                      />
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {photo.resolution}
                      </div>
                      <div className="absolute top-3 right-3">
                        {photo.verified && (
                          <div className="bg-green-600 text-white p-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-purple-600" />
                        <span className="text-sm font-bold text-purple-600">{photo.price} SOL</span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="flex items-center text-gray-500 text-xs mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {photo.location}
                      </div>
                      
                      <h4 className="text-lg font-bold mb-2 text-gray-800">{photo.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{photo.description}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span className="mr-4 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {photo.views}
                        </span>
                        <span className="mr-4 flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(photo.uploadDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {photo.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          by {photo.photographer}
                          <div className="text-xs text-purple-600">{photo.photographerWallet}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedPhoto(photo)}
                            className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handlePurchase(photo)}
                            disabled={loading || !walletAddress}
                            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-1 disabled:opacity-50"
                          >
                            {loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Buy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeView === 'upload' && (
        <section className="pt-32 pb-20 min-h-screen">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Share Your Outback Photography
              </h2>
              <p className="text-xl text-gray-600">
                Earn SOL by selling your authentic Australian outback photos on Solana
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your Photo
                  </h3>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadData.preview ? (
                      <div className="relative">
                        <img 
                          src={uploadData.preview} 
                          alt="Preview" 
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadData({...uploadData, file: null, preview: null});
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-2">Click to upload your photo</p>
                        <p className="text-sm text-gray-400">Supports JPG, PNG (Max 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Photo Guidelines
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• High resolution (minimum 4K recommended)</li>
                      <li>• Original, unedited outback photography</li>
                      <li>• Respect sacred Aboriginal sites</li>
                      <li>• Include accurate location information</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Photo Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={uploadData.title}
                        onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                        placeholder="e.g., Uluru at Sunset"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                        placeholder="Describe your photo..."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={uploadData.location}
                        onChange={(e) => setUploadData({...uploadData, location: e.target.value})}
                        placeholder="e.g., Uluru-Kata Tjuta National Park, NT"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={uploadData.category}
                        onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="landscape">Landscape</option>
                        <option value="wildlife">Wildlife</option>
                        <option value="spiritual">Sacred Sites</option>
                        <option value="culture">Aboriginal Culture</option>
                        <option value="astronomy">Night Sky</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (SOL) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={uploadData.price}
                        onChange={(e) => setUploadData({...uploadData, price: e.target.value})}
                        placeholder="0.5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Listing fee: 0.001 SOL</p>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={loading || !walletAddress}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>List Photo for Sale</span>
                        </>
                      )}
                    </button>

                    {!walletAddress && (
                      <p className="text-sm text-red-600 text-center">
                        Please connect your Phantom wallet to upload photos
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-lg font-bold text-purple-600">{selectedPhoto.price} SOL</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedPhoto.title}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedPhoto.location}
                  </div>
                </div>
                {selectedPhoto.verified && (
                  <div className="flex items-center bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-700 font-medium">Verified</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6 text-lg">{selectedPhoto.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Photographer</div>
                  <div className="font-bold text-gray-800">{selectedPhoto.photographer}</div>
                  <div className="text-xs text-purple-600">{selectedPhoto.photographerWallet}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Resolution</div>
                  <div className="font-bold text-gray-800">{selectedPhoto.resolution}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    Views
                  </div>
                  <div className="font-bold text-gray-800">{selectedPhoto.views.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Likes
                  </div>
                  <div className="font-bold text-gray-800">{selectedPhoto.likes}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePurchase(selectedPhoto)}
                disabled={loading || !walletAddress}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Purchase for {selectedPhoto.price} SOL</span>
                  </>
                )}
              </button>

              {!walletAddress && (
                <p className="text-sm text-red-600 text-center mt-4">
                  Please connect your Phantom wallet to purchase this photo
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold">Outback Visions</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Authentic Australian outback photography marketplace powered by Solana blockchain.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Browse Photos</li>
                <li>Featured Collections</li>
                <li>Top Photographers</li>
                <li>Recent Sales</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>How It Works</li>
                <li>Photography Guidelines</li>
                <li>Solana Integration</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Discord</li>
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Newsletter</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Outback Visions. Powered by Solana.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Network:</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                {SOLANA_NETWORK.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </footer>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/solana-web3.js/1.87.6/index.iife.min.js"></script>
    </div>
  );
};

export default OutbackPhotoMarketplace;