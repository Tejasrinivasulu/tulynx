import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Building2, ArrowRight, ArrowLeft, CheckCircle2, Package, Shield, Truck, Banknote, AlertCircle, Calendar, Clock, MapPin, Phone, Mail, User, Lock, CreditCard as CreditCardIcon, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'credit' | 'upi' | 'bank' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  processingFee?: number;
}

interface DeliveryEstimate {
  standard: string;
  express: string;
  priority: string;
}

interface Order {
  id: string;
  date: string;
  items: { id: string; name: string; image: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  deliveryMethod: 'standard' | 'express' | 'priority';
  deliveryFee: number;
  estimatedDelivery: string;
  orderNotes?: string;
}

const PaymentSection: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'credit',
    processingFee: 0
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [processingAmount, setProcessingAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'priority'>('standard');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState<DeliveryEstimate>({
    standard: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    express: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    priority: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  });
  const [cardValidation, setCardValidation] = useState({
    number: true,
    expiry: true,
    cvv: true,
  });
  const [saveCard, setSaveCard] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const calculateProcessingFee = (method: string, amount: number) => {
    switch (method) {
      case 'credit':
        return amount * 0.02; // 2% processing fee
      case 'upi':
        return amount * 0.01; // 1% processing fee
      case 'bank':
        return amount * 0.015; // 1.5% processing fee
      case 'cod':
        return 0; // No processing fee for COD
      default:
        return 0;
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    const subtotal = cartState.total * 1.08 - discount;
    const fee = calculateProcessingFee(method, subtotal);
    setProcessingAmount(fee);
    setPaymentInfo({ ...paymentInfo, method: method as PaymentInfo['method'], processingFee: fee });
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleShippingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order object
      const order: Order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cartState.items,
        total: cartState.total,
        status: 'pending' as const,
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        shippingInfo: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        paymentInfo: {
          method: paymentInfo.method,
          processingFee: paymentInfo.method === 'credit' ? 2.99 : 0
        },
        deliveryMethod,
        deliveryFee: deliveryMethod === 'express' ? 9.99 : 4.99,
        estimatedDelivery: new Date(Date.now() + (deliveryMethod === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000).toISOString(),
        orderNotes
      };

      console.log('Creating new order:', order);

      // Save order to localStorage
      const existingOrders = localStorage.getItem('orders');
      console.log('Existing orders:', existingOrders);
      
      let orders = [];
      if (existingOrders) {
        try {
          orders = JSON.parse(existingOrders);
          if (!Array.isArray(orders)) {
            console.error('Invalid orders data in localStorage:', orders);
            orders = [];
          }
        } catch (err) {
          console.error('Error parsing existing orders:', err);
          orders = [];
        }
      }

      const updatedOrders = [...orders, order];
      console.log('Saving updated orders:', updatedOrders);
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      console.log('Orders saved successfully');

      // Clear cart
      cartDispatch({ type: 'CLEAR_CART' });
      console.log('Cart cleared');

      // Show success message
      setOrderSuccess(true);
      console.log('Success message set');

      // Redirect to orders page
      setTimeout(() => {
        console.log('Redirecting to orders page');
        navigate('/my-orders', { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Error in handlePaymentSubmit:', err);
      setIsProcessing(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(cartState.total * 0.1);
    }
  };

  const validateCardNumber = (number: string) => {
    return /^[0-9]{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date: string) => {
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    return (
      /^\d{2}\/\d{2}$/.test(date) &&
      parseInt(month) >= 1 &&
      parseInt(month) <= 12 &&
      (parseInt(year) > currentYear || (parseInt(year) === currentYear && parseInt(month) >= currentMonth))
    );
  };

  const validateCVV = (cvv: string) => {
    return /^[0-9]{3,4}$/.test(cvv);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setPaymentInfo({ ...paymentInfo, cardNumber: value });
    setCardValidation({ ...cardValidation, number: validateCardNumber(value) });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
    setCardValidation({ ...cardValidation, expiry: validateExpiryDate(value) });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPaymentInfo({ ...paymentInfo, cvv: value });
    setCardValidation({ ...cardValidation, cvv: validateCVV(value) });
  };

  const handleDeliveryMethodChange = (method: 'standard' | 'express' | 'priority') => {
    setDeliveryMethod(method);
    switch (method) {
      case 'standard':
        setDeliveryFee(0);
        break;
      case 'express':
        setDeliveryFee(9.99);
        break;
      case 'priority':
        setDeliveryFee(4.99);
        break;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 ${
              currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderCustomerInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
      <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              required
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            required
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderShippingInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
      <form onSubmit={handleShippingInfoSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            required
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              required
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              required
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              required
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              required
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderPaymentInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('credit')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                paymentInfo.method === 'credit'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-purple-600'
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Credit Card</span>
            </button>
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('upi')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                paymentInfo.method === 'upi'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-purple-600'
              }`}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-sm">UPI</span>
            </button>
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('bank')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                paymentInfo.method === 'bank'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-purple-600'
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm">Bank Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('cod')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                paymentInfo.method === 'cod'
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-200 hover:border-purple-600'
              }`}
            >
              <Banknote className="w-6 h-6" />
              <span className="text-sm">Cash on Delivery</span>
            </button>
          </div>

          {paymentInfo.method === 'credit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={paymentInfo.cardNumber || ''}
                    onChange={handleCardNumberChange}
                    className={`w-full px-4 py-2 border ${
                      cardValidation.number ? 'border-gray-300' : 'border-red-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <CreditCardIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {!cardValidation.number && (
                  <p className="mt-1 text-sm text-red-600">Please enter a valid card number</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={paymentInfo.expiryDate || ''}
                    onChange={handleExpiryDateChange}
                    className={`w-full px-4 py-2 border ${
                      cardValidation.expiry ? 'border-gray-300' : 'border-red-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {!cardValidation.expiry && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid expiry date</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    value={paymentInfo.cvv || ''}
                    onChange={handleCVVChange}
                    className={`w-full px-4 py-2 border ${
                      cardValidation.cvv ? 'border-gray-300' : 'border-red-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {!cardValidation.cvv && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid CVV</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.cardName || ''}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                  Save card for future purchases
                </label>
              </div>
            </div>
          )}

          {paymentInfo.method === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.upiId || ''}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="username@upi"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Processing Fee</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      A processing fee of 1% (${processingAmount.toFixed(2)}) will be added to your total amount.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentInfo.method === 'bank' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.bankName || ''}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter your bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.accountNumber || ''}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.ifscCode || ''}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, ifscCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Processing Fee</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      A processing fee of 1.5% (${processingAmount.toFixed(2)}) will be added to your total amount.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentInfo.method === 'cod' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Cash on Delivery</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You will pay the full amount of ${(cartState.total * 1.08).toFixed(2)} when your order arrives.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderDeliveryOptions = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Delivery Method</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleDeliveryMethodChange('standard')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
            deliveryMethod === 'standard'
              ? 'border-purple-600 bg-purple-50 text-purple-600'
              : 'border-gray-200 hover:border-purple-600'
          }`}
        >
          <Truck className="w-6 h-6" />
          <span className="text-sm">Standard</span>
          <span className="text-xs text-gray-500">Free</span>
          <span className="text-xs text-gray-500">Est. {estimatedDelivery.standard}</span>
        </button>
        <button
          type="button"
          onClick={() => handleDeliveryMethodChange('express')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
            deliveryMethod === 'express'
              ? 'border-purple-600 bg-purple-50 text-purple-600'
              : 'border-gray-200 hover:border-purple-600'
          }`}
        >
          <Truck className="w-6 h-6" />
          <span className="text-sm">Express</span>
          <span className="text-xs text-gray-500">$9.99</span>
          <span className="text-xs text-gray-500">Est. {estimatedDelivery.express}</span>
        </button>
        <button
          type="button"
          onClick={() => handleDeliveryMethodChange('priority')}
          className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 ${
            deliveryMethod === 'priority'
              ? 'border-purple-600 bg-purple-50 text-purple-600'
              : 'border-gray-200 hover:border-purple-600'
          }`}
        >
          <Truck className="w-6 h-6" />
          <span className="text-sm">Priority</span>
          <span className="text-xs text-gray-500">$4.99</span>
          <span className="text-xs text-gray-500">Est. {estimatedDelivery.priority}</span>
        </button>
      </div>
    </div>
  );

  const renderOrderNotes = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Order Notes (Optional)</label>
      <textarea
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        rows={3}
        placeholder="Add any special instructions or notes for your order..."
      />
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {cartState.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
            </div>
            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${cartState.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery ({deliveryMethod})</span>
          <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>${(cartState.total * 0.08).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        {processingAmount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Processing Fee</span>
            <span>${processingAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${(cartState.total * 1.08 + processingAmount + deliveryFee - discount).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Package className="w-5 h-5" />
          <span className="text-sm">Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Shield className="w-5 h-5" />
          <span className="text-sm">Secure payment processing</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Estimated delivery: {estimatedDelivery[deliveryMethod]}</span>
        </div>
      </div>

      {orderNotes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Notes</h4>
          <p className="text-sm text-gray-600">{orderNotes}</p>
        </div>
      )}
    </div>
  );

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderCustomerInfo()}
              {currentStep === 2 && renderShippingInfo()}
              {currentStep === 3 && renderPaymentInfo()}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-1">
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection; 