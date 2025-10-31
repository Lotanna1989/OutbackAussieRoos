import React, { useState, useEffect } from 'react';
import { Sprout, TrendingUp, Users, DollarSign, MapPin, Calendar, Award, BarChart3, Clock, CheckCircle, AlertCircle, Wallet, ArrowRight, Target, Percent, X, Info } from 'lucide-react';
import * as solanaWeb3 from '@solana/web3.js';

const SOLANA_NETWORK = 'devnet';
const TREASURY_WALLET = 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH';

const OutbackAgriInvestment = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState('marketplace');
  const [selectedProject, setSelectedProject] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    { id: 'all', name: 'All Projects', icon: '🌾', count: 47 },
    { id: 'wheat', name: 'Wheat Farms', icon: '🌾', count: 12 },
    { id: 'maize', name: 'Maize Farms', icon: '🌽', count: 8 },
    { id: 'cattle', name: 'Cattle Ranches', icon: '🐄', count: 15 },
    { id: 'dairy', name: 'Dairy Farms', icon: '🥛', count: 7 },
    { id: 'organic', name: 'Organic Farms', icon: '🥬', count: 5 },
  ];

  const projects = [
    {
      id: 1,
      name: "Golden Wheat Fields",
      owner: "John Farmer",
      ownerWallet: "8xK9...mN2p",
      location: "Moree, NSW",
      type: "wheat",
      description: "500-hectare premium wheat farm with modern irrigation systems. Expected harvest in 6 months with strong market demand.",
      fundingGoal: "50",
      minInvestment: "1",
      raised: "32.5",
      investors: 28,
      expectedReturn: 15,
      duration: 6,
      status: "fundraising",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
      progress: 65,
      rating: 4.8,
      harvest: "June 2025",
      verified: true,
      tags: ["Premium Quality", "Modern Equipment", "Experienced Farmer"]
    },
    {
      id: 2,
      name: "Riverina Maize Plantation",
      owner: "Sarah Green",
      ownerWallet: "7yJ8...kL3q",
      location: "Griffith, NSW",
      type: "maize",
      description: "300-hectare maize plantation with organic certification. High-yield variety with locked-in buyer contracts.",
      fundingGoal: "35",
      minInvestment: "0.5",
      raised: "35",
      investors: 42,
      expectedReturn: 18,
      duration: 5,
      status: "funded",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
      progress: 100,
      rating: 4.9,
      harvest: "May 2025",
      verified: true,
      tags: ["Organic Certified", "Contract Secured", "High Yield"]
    },
    {
      id: 3,
      name: "Outback Cattle Station",
      owner: "Mike Rancher",
      ownerWallet: "9zA7...pQ4r",
      location: "Alice Springs, NT",
      type: "cattle",
      description: "Premium Angus cattle breeding program. 200 head of certified Black Angus with excellent genetics.",
      fundingGoal: "80",
      minInvestment: "2",
      raised: "56",
      investors: 35,
      expectedReturn: 20,
      duration: 12,
      status: "active",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=400&fit=crop",
      progress: 70,
      rating: 4.7,
      harvest: "December 2025",
      verified: true,
      tags: ["Premium Genetics", "Export Quality", "Sustainable"]
    },
    {
      id: 4,
      name: "Heritage Dairy Farm",
      owner: "Emma Milkman",
      ownerWallet: "6xI9...nM5s",
      location: "Gippsland, VIC",
      type: "dairy",
      description: "Award-winning dairy farm producing premium milk and cheese. Expanding production facilities.",
      fundingGoal: "45",
      minInvestment: "1",
      raised: "18",
      investors: 15,
      expectedReturn: 12,
      duration: 8,
      status: "fundraising",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&h=400&fit=crop",
      progress: 40,
      rating: 4.6,
      harvest: "Quarterly Returns",
      verified: true,
      tags: ["Award Winner", "Premium Products", "Growing Market"]
    },
    {
      id: 5,
      name: "Northern Wheat Co-op",
      owner: "David Harvest",
      ownerWallet: "5wH8...oP6t",
      location: "Dalby, QLD",
      type: "wheat",
      description: "Large-scale wheat cooperative with proven track record. Seeking expansion funding for additional 800 hectares.",
      fundingGoal: "120",
      minInvestment: "5",
      raised: "95",
      investors: 52,
      expectedReturn: 14,
      duration: 7,
      status: "fundraising",
      image: "https://images.unsplash.com/photo-1625246296225-6f37a8c4d5e5?w=600&h=400&fit=crop",
      progress: 79,
      rating: 4.9,
      harvest: "July 2025",
      verified: true,
      tags: ["Co-op Structure", "Proven Returns", "Large Scale"]
    },
    {
      id: 6,
      name: "Organic Vegetable Farm",
      owner: "Lisa Greenthumb",
      ownerWallet: "4vG7...mO7u",
      location: "Yarra Valley, VIC",
      type: "organic",
      description: "Certified organic farm supplying premium restaurants and farmers markets. Expanding greenhouse operations.",
      fundingGoal: "25",
      minInvestment: "0.5",
      raised: "25",
      investors: 38,
      expectedReturn: 16,
      duration: 4,
      status: "completed",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
      progress: 100,
      rating: 5.0,
      harvest: "Completed - Returns Paid",
      verified: true,
      tags: ["Organic", "Premium Market", "Restaurant Supply"]
    }
  ];

  const handleInvest = async () => {
    if (!walletAddress) {
      alert('Please connect your Phantom Wallet first');
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) < parseFloat(selectedProject.minInvestment)) {
      alert(`Minimum investment is ${selectedProject.minInvestment} SOL`);
      return;
    }

    setLoading(true);

    try {
      const { solana } = window;
      
      if (typeof solanaWeb3 === 'undefined') {
        await loadSolanaWeb3();
      }

      const transaction = new solanaWeb3.Transaction();
      const lamports = parseFloat(investmentAmount) * solanaWeb3.LAMPORTS_PER_SOL;
      
      transaction.add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: new solanaWeb3.PublicKey(walletAddress),
          toPubkey: new solanaWeb3.PublicKey(TREASURY_WALLET),
          lamports: lamports,
        })
      );

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
      
      const expectedReturn = (parseFloat(investmentAmount) * selectedProject.expectedReturn / 100).toFixed(2);
      const totalReturn = (parseFloat(investmentAmount) + parseFloat(expectedReturn)).toFixed(2);

      alert(`✅ Investment Successful!

Project: ${selectedProject.name}
Investment: ${investmentAmount} SOL
Expected Return: ${selectedProject.expectedReturn}%
Estimated Profit: ${expectedReturn} SOL
Total Expected: ${totalReturn} SOL
Duration: ${selectedProject.duration} months
Harvest: ${selectedProject.harvest}

Transaction: ${signed.signature}

View on Solana Explorer:
https://explorer.solana.com/tx/${signed.signature}?cluster=${SOLANA_NETWORK}`);

      setInvestmentAmount('');
      setSelectedProject(null);
      await updateWalletBalance(walletAddress);

    } catch (error) {
      console.error('Investment failed:', error);
      alert(`❌ Failed to invest: ${error.message}`);
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

  const filteredProjects = projects.filter(p => 
    selectedCategory === 'all' || p.type === selectedCategory
  );

  const formatWalletAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'fundraising': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'funded': return 'bg-green-100 text-green-700 border-green-300';
      case 'active': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'fundraising': return 'Raising Funds';
      case 'funded': return 'Fully Funded';
      case 'active': return 'In Production';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden relative">
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-green-200 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Outback AgriVest
                </h1>
                <p className="text-xs text-gray-500">Australian Agricultural Investments • {SOLANA_NETWORK.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-600 hover:text-green-600 transition-colors flex items-center hover:scale-105 transform font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Invest
              </button>
              <button className="text-gray-600 hover:text-green-600 transition-colors flex items-center hover:scale-105 transform">
                <BarChart3 className="w-4 h-4 mr-2" />
                Portfolio
              </button>
              <button className="text-gray-600 hover:text-green-600 transition-colors flex items-center hover:scale-105 transform">
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
                  className="bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 hover:shadow-xl text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center space-x-2 disabled:opacity-50"
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

      <section className={`pt-32 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 rounded-full px-8 py-3 mb-8 border-3 border-green-300 shadow-2xl animate-pulse">
              <Sprout className="w-6 h-6 mr-3 text-green-700" />
              <span className="text-green-700 font-bold text-lg">Invest in Australia's Agricultural Future</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 bg-clip-text text-transparent mb-4">
                Grow Your Wealth
              </div>
              <div className="text-gray-800">
                With the Outback
              </div>
            </h2>
            
            <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto">
              Invest in real Australian agricultural projects. Earn returns from wheat, maize, cattle, and more.
              All secured on Solana blockchain.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold text-green-600 mb-1">47</div>
                <div className="text-gray-600">Active Projects</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <div className="text-3xl font-bold text-emerald-600 mb-1">1,247</div>
                <div className="text-gray-600">Investors</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-teal-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                <div className="text-3xl font-bold text-teal-600 mb-1">8,450 SOL</div>
                <div className="text-gray-600">Total Invested</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur rounded-2xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-purple-600 mb-1">16.5%</div>
                <div className="text-gray-600">Avg Return</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400 shadow-xl'
                    : 'bg-white/70 backdrop-blur border-gray-200 shadow-lg hover:shadow-xl'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h4 className="font-bold text-sm mb-1 text-gray-800">{category.name}</h4>
                  <p className="text-gray-600 text-xs">{category.count} projects</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-white/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </div>
                  {project.verified && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Award className="w-4 h-4 mr-1" />
                      <span className="text-sm font-bold">{project.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-green-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{project.raised} SOL raised</span>
                      <span>{project.fundingGoal} SOL goal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Percent className="w-3 h-3 mr-1" />
                        Return
                      </div>
                      <div className="font-bold text-green-600">{project.expectedReturn}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Duration
                      </div>
                      <div className="font-bold text-gray-800">{project.duration} months</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Min Investment</div>
                      <div className="font-bold text-purple-600">{project.minInvestment} SOL</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        Investors
                      </div>
                      <div className="font-bold text-gray-800">{project.investors}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    disabled={project.status === 'completed'}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{project.status === 'completed' ? 'Completed' : 'Invest Now'}</span>
                    {project.status !== 'completed' && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="text-xs text-gray-500 mt-2 text-center">
                    by {project.owner} • {project.ownerWallet}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedProject.status)}`}>
                {getStatusText(selectedProject.status)}
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedProject.name}</h3>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedProject.location}
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                  <Award className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="text-lg font-bold text-yellow-700">{selectedProject.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">{selectedProject.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Target className="w-5 h-5 mr-2" />
                      <span className="font-medium">Funding Goal</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{selectedProject.fundingGoal} SOL</div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span className="font-medium">Raised</span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">{selectedProject.raised} SOL</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Funding Progress</span>
                    <span className="text-sm font-bold text-green-600">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Percent className="w-4 h-4 mr-1" />
                    Expected Return
                  </div>
                  <div className="text-2xl font-bold text-green-600">{selectedProject.expectedReturn}%</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Duration
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{selectedProject.duration} mo</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4 mr-1" />
                    Investors
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{selectedProject.investors}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Harvest
                  </div>
                  <div className="text-sm font-bold text-gray-800">{selectedProject.harvest}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Investment Details</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Minimum Investment: <strong>{selectedProject.minInvestment} SOL</strong></li>
                      <li>• Returns paid at harvest completion</li>
                      <li>• Project owner: {selectedProject.owner} ({selectedProject.ownerWallet})</li>
                      <li>• All transactions secured on Solana blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>

              {selectedProject.status !== 'completed' && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount (SOL)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={selectedProject.minInvestment}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={`Min: ${selectedProject.minInvestment} SOL`}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                    />
                    {investmentAmount && parseFloat(investmentAmount) >= parseFloat(selectedProject.minInvestment) && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Investment</div>
                            <div className="font-bold text-gray-800">{investmentAmount} SOL</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Expected Return</div>
                            <div className="font-bold text-green-600">
                              {(parseFloat(investmentAmount) * selectedProject.expectedReturn / 100).toFixed(2)} SOL
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Total Expected</div>
                            <div className="font-bold text-purple-600">
                              {(parseFloat(investmentAmount) * (1 + selectedProject.expectedReturn / 100)).toFixed(2)} SOL
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">In {selectedProject.duration} months</div>
                            <div className="font-bold text-blue-600">{selectedProject.harvest}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleInvest}
                    disabled={loading || !walletAddress || !investmentAmount || parseFloat(investmentAmount) < parseFloat(selectedProject.minInvestment)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Investment...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        <span>Invest {investmentAmount || '0'} SOL</span>
                      </>
                    )}
                  </button>

                  {!walletAddress && (
                    <p className="text-sm text-red-600 text-center mt-4">
                      Please connect your Phantom wallet to invest
                    </p>
                  )}
                </>
              )}

              {selectedProject.status === 'completed' && (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Investment Completed</h4>
                  <p className="text-gray-600">This project has been completed and all returns have been distributed to investors.</p>
                </div>
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
                <Sprout className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold">Outback AgriVest</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting investors with Australian agricultural opportunities through blockchain technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Investment</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Browse Projects</li>
                <li>How It Works</li>
                <li>Risk Disclosure</li>
                <li>Expected Returns</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">For Farmers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>List Your Project</li>
                <li>Funding Process</li>
                <li>Success Stories</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>Smart Contracts</li>
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Outback AgriVest. Powered by Solana Blockchain.
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

export default OutbackAgriInvestment;