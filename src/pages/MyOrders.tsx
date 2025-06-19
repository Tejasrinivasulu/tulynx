import React, { useEffect, useState } from 'react';
import { PackageCheck, Download, ArrowRight, Truck, CreditCard, MapPin, Filter, Search, SortAsc, SortDesc, X, AlertCircle, RefreshCw, Star, MessageSquare, Calendar, Clock, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '../context/CartContext';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    processingFee?: number;
    cardType?: string;
    last4Digits?: string;
    expiryDate?: string;
    paypalEmail?: string;
    accountHolder?: string;
    accountNumber?: string;
    bankName?: string;
  };
  deliveryMethod: string;
  deliveryFee: number;
  estimatedDelivery: string;
  orderNotes?: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = localStorage.getItem('orders');
        console.log('Loading orders from localStorage:', storedOrders);
        
        if (storedOrders) {
          try {
            const parsedOrders = JSON.parse(storedOrders);
            console.log('Parsed orders:', parsedOrders);
            
            if (Array.isArray(parsedOrders)) {
              // Ensure all required fields are present
              const validOrders = parsedOrders.filter(order => {
                return order && 
                       order.id && 
                       order.date && 
                       Array.isArray(order.items) && 
                       typeof order.total === 'number' &&
                       order.status &&
                       order.customerInfo &&
                       order.shippingInfo &&
                       order.paymentInfo &&
                       order.deliveryMethod &&
                       typeof order.deliveryFee === 'number' &&
                       order.estimatedDelivery;
              });
              
              console.log('Valid orders:', validOrders);
              setOrders(validOrders);
            } else {
              console.error('Orders data is not an array:', parsedOrders);
              setOrders([]);
            }
          } catch (err) {
            console.error('Error parsing orders:', err);
            setOrders([]);
          }
        } else {
          console.log('No orders found in localStorage');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log('Current orders state:', orders);
  }, [orders]);

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const handleReorder = (order: Order) => {
    try {
      // Add items to cart
      order.items.forEach(item => {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: item.id,
            quantity: item.quantity
          }
        });
      });
      
      // Show success message
      alert('Items have been added to your cart!');
      
      // Navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to add items to cart. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <PackageCheck className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5" />;
      case 'cancelled':
        return <X className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        order.items.some(item => (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      }
    });

  const generateInvoice = (order: Order) => {
    try {
      const doc = new jsPDF();
      
      // Add company logo and header
      doc.setFontSize(20);
      doc.setTextColor(107, 70, 193); // Purple color
      doc.text('Tulynx Perfumes', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text('Invoice', 105, 30, { align: 'center' });
      
      // Add order details
      doc.setFontSize(10);
      doc.text(`Order #: ${order.id}`, 20, 40);
      doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 45);
      doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 50);
      
      // Add customer information
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information:', 20, 65);
      doc.setFont('helvetica', 'normal');
      doc.text(`${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 20, 70);
      doc.text(order.customerInfo.email, 20, 75);
      doc.text(order.customerInfo.phone, 20, 80);
      
      // Add shipping address
      doc.setFont('helvetica', 'bold');
      doc.text('Shipping Address:', 20, 95);
      doc.setFont('helvetica', 'normal');
      doc.text(order.shippingInfo.address, 20, 100);
      doc.text(`${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`, 20, 105);
      doc.text(order.shippingInfo.country, 20, 110);
      
      // Add payment information with more details
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Information:', 20, 125);
      doc.setFont('helvetica', 'normal');
      doc.text(`Method: ${order.paymentInfo.method.charAt(0).toUpperCase() + order.paymentInfo.method.slice(1)}`, 20, 130);
      
      // Add payment method specific details
      if (order.paymentInfo.method === 'credit_card') {
        doc.text(`Card Type: ${order.paymentInfo.cardType || 'N/A'}`, 20, 135);
        doc.text(`Last 4 Digits: ${order.paymentInfo.last4Digits || 'N/A'}`, 20, 140);
        doc.text(`Expiry: ${order.paymentInfo.expiryDate || 'N/A'}`, 20, 145);
      } else if (order.paymentInfo.method === 'paypal') {
        doc.text(`PayPal Email: ${order.paymentInfo.paypalEmail || 'N/A'}`, 20, 135);
      } else if (order.paymentInfo.method === 'bank_transfer') {
        doc.text(`Account Holder: ${order.paymentInfo.accountHolder || 'N/A'}`, 20, 135);
        doc.text(`Account Number: ${order.paymentInfo.accountNumber || 'N/A'}`, 20, 140);
        doc.text(`Bank Name: ${order.paymentInfo.bankName || 'N/A'}`, 20, 145);
      }
      
      if (order.paymentInfo.processingFee) {
        doc.text(`Processing Fee: $${order.paymentInfo.processingFee.toFixed(2)}`, 20, 150);
      }
      
      // Adjust delivery information position based on payment details
      const deliveryStartY = order.paymentInfo.method === 'bank_transfer' ? 165 : 155;
      
      // Add delivery information
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Information:', 20, deliveryStartY);
      doc.setFont('helvetica', 'normal');
      doc.text(`Method: ${order.deliveryMethod.charAt(0).toUpperCase() + order.deliveryMethod.slice(1)}`, 20, deliveryStartY + 5);
      doc.text(`Delivery Fee: $${order.deliveryFee.toFixed(2)}`, 20, deliveryStartY + 10);
      doc.text(`Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`, 20, deliveryStartY + 15);
      
      // Adjust items table position
      const tableStartY = deliveryStartY + 25;
      
      // Add items table
      const tableColumn = ['Product', 'Quantity', 'Price', 'Total'];
      const tableRows = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: tableStartY,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [107, 70, 193] },
        margin: { top: tableStartY }
      });
      
      // Add total
      const finalY = (doc as any).lastAutoTable.finalY || 200;
      doc.setFont('helvetica', 'bold');
      doc.text('Subtotal:', 140, finalY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`$${(order.total - order.deliveryFee - (order.paymentInfo.processingFee || 0)).toFixed(2)}`, 180, finalY + 10);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Fee:', 140, finalY + 15);
      doc.setFont('helvetica', 'normal');
      doc.text(`$${order.deliveryFee.toFixed(2)}`, 180, finalY + 15);
      
      if (order.paymentInfo.processingFee) {
        doc.setFont('helvetica', 'bold');
        doc.text('Processing Fee:', 140, finalY + 20);
        doc.setFont('helvetica', 'normal');
        doc.text(`$${order.paymentInfo.processingFee.toFixed(2)}`, 180, finalY + 20);
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 140, finalY + 30);
      doc.text(`$${order.total.toFixed(2)}`, 180, finalY + 30);
      
      // Add footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 70, 193); // Purple color
      doc.text('Thank you for shopping with Tulynx Perfumes!', 105, finalY + 50, { align: 'center' });
      doc.text('For any questions, please contact our customer service.', 105, finalY + 55, { align: 'center' });
      
      // Save the PDF
      doc.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">Track and manage your orders</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent w-full md:w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="total">Sort by Total</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAndSortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start shopping to see your orders here.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                          {getStatusIcon(order.status || 'pending')}
                          {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Placed on {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {(order.status || 'pending') === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="mt-4 md:mt-0 text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Information
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{order.shippingInfo.address}</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">{order.shippingInfo.country}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Information
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Method: {(order.paymentInfo.method || '').charAt(0).toUpperCase() + (order.paymentInfo.method || '').slice(1)}
                        </p>
                        {order.paymentInfo.processingFee && (
                          <p className="text-sm text-gray-600">
                            Processing Fee: ${order.paymentInfo.processingFee.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                                  <span className="ml-3 text-sm text-gray-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {(order.deliveryMethod || '').charAt(0).toUpperCase() + (order.deliveryMethod || '').slice(1)} Delivery
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal: ${(order.total - order.deliveryFee - (order.paymentInfo.processingFee || 0)).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
                        {order.paymentInfo.processingFee && (
                          <p className="text-sm text-gray-500">Processing Fee: ${order.paymentInfo.processingFee.toFixed(2)}</p>
                        )}
                        <p className="text-lg font-semibold text-gray-900 mt-2">Total: ${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {order.orderNotes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Notes</h4>
                      <p className="text-sm text-gray-600">{order.orderNotes}</p>
                    </div>
                  )}

                  {/* Download invoice button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => generateInvoice(order)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders; 