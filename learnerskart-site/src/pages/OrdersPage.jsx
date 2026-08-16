import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { CreditCard, Download, FileText, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const { formatPrice } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadInvoice = (order) => {
    if (!order) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print/download the invoice.');
      return;
    }

    const orderCourses = Array.isArray(order.courses) ? order.courses : [];
    const invoiceAmount = order.finalAmount || order.totalAmount || 0;
    const subtotal = order.totalAmount || invoiceAmount;
    const discount = order.discount || 0;
    const gst = order.gst || 0;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order._id || 'Order'}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
          }
          .invoice-card {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #098ce9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #098ce9;
          }
          .logo span {
            color: #f6b40a;
          }
          .title {
            text-align: right;
          }
          .title h1 {
            margin: 0;
            color: #098ce9;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          .meta-box h3 {
            margin-top: 0;
            color: #098ce9;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .meta-box p {
            margin: 5px 0;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #098ce9;
            color: white;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .totals {
            width: 50%;
            margin-left: auto;
            margin-bottom: 40px;
          }
          .totals table {
            margin-bottom: 0;
          }
          .totals td {
            border-bottom: none;
            padding: 8px 12px;
          }
          .totals tr.final-row td {
            border-top: 2px solid #098ce9;
            font-size: 16px;
            font-weight: 800;
            color: #098ce9;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 40px;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-card {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div class="logo">Learners<span>Kart</span></div>
            <div class="title">
              <h1>Invoice</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Order ID: ${order._id || 'N/A'}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-box">
              <h3>Billed To</h3>
              <p><strong>Name:</strong> ${user?.name || 'Customer'}</p>
              <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${user?.phone || 'N/A'}</p>
              ${order.billingInfo?.address ? `
                <p><strong>Address:</strong> ${order.billingInfo.address}, ${order.billingInfo.city}, ${order.billingInfo.state}, ${order.billingInfo.country} - ${order.billingInfo.pincode}</p>
              ` : ''}
            </div>
            <div class="meta-box" style="text-align: right;">
              <h3>Invoice Details</h3>
              <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
              <p><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${order.paymentStatus || 'Paid'}</span></p>
              <p><strong>Transaction ID:</strong> ${order.paymentId || 'N/A'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Certification Course Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orderCourses.map(c => `
                <tr>
                  <td><strong>${c?.title || 'Certification Training Program'}</strong><br><span style="font-size: 11px; color: #666;">Professional Cohort Training & Accreditation</span></td>
                  <td style="text-align: right;">${formatPrice(c?.price || subtotal / orderCourses.length)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">${formatPrice(subtotal)}</td>
              </tr>
              ${discount > 0 ? `
                <tr>
                  <td style="color: green;">Coupon Discount:</td>
                  <td style="text-align: right; color: green;">- ${formatPrice(discount)}</td>
                </tr>
              ` : ''}
              <tr>
                <td>GST (18%):</td>
                <td style="text-align: right;">${formatPrice(gst)}</td>
              </tr>
              <tr class="final-row">
                <td>Total Amount Paid:</td>
                <td style="text-align: right;">${formatPrice(invoiceAmount)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for choosing LearnersKart! Learn, Certify, and Lead with Confidence.</p>
            <p style="color: #bbb; margin-top: 5px;">This is a system-generated document. No signature required.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Sidebar navigation */}
          <DashboardSidebar />

          {/* RIGHT: Orders Content Area */}
          <main className="flex-grow space-y-6 w-full">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-textdark uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                Order History & Invoices
              </h2>
              <p className="text-xs text-textmuted mt-1.5 font-semibold">
                View your past billing transactions and download purchase receipts.
              </p>
            </div>

            {loading ? (
              <div className="bg-white border rounded-xl h-48 animate-pulse"></div>
            ) : !orders || orders.length === 0 ? (
              <div className="bg-white border border-slate-100 shadow-sm rounded-xl py-16 px-6 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-lg text-textdark">No orders found</h4>
                <p className="text-xs text-textmuted mt-1 max-w-sm mx-auto">
                  You haven't purchased any certification programs yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const orderCourses = Array.isArray(order.courses) ? order.courses : [];
                  const orderDate = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'N/A';
                  const orderAmount = order.finalAmount || order.totalAmount || 0;

                  return (
                    <div 
                      key={order._id || Math.random()} 
                      className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center md:justify-between md:space-y-0 gap-4"
                    >
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-[#098ce9] bg-blue-50 px-2.5 py-1 rounded">
                            Order ID: {order._id || 'N/A'}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-400">
                            {orderDate}
                          </span>
                        </div>
                        
                        {/* Courses list */}
                        <div className="space-y-1 pl-1">
                          {orderCourses.map((course, idx) => {
                            if (!course) return null;
                            return (
                              <p key={course._id || idx} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#f6b40a]" />
                                {course.title || 'Certification Course'}
                              </p>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Total Paid</p>
                          <p className="font-black text-sm text-[#098ce9] mt-0.5">{formatPrice(orderAmount)}</p>
                        </div>

                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="bg-white hover:bg-slate-50 text-textdark border border-slate-200 font-bold px-4 py-2.5 rounded-lg text-xs shadow-sm transition-all flex items-center gap-1.5 hover:border-[#098ce9] hover:text-[#098ce9]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;
