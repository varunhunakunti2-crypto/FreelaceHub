"use client";

import { Download, Printer, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/types/database";

type InvoiceWithDetails = Tables<"invoices"> & {
  contract: Tables<"contracts"> & {
    client: Tables<"profiles">;
    freelancer: Tables<"profiles">;
    project: Tables<"projects">;
  };
};

interface InvoiceViewProps {
  invoice: InvoiceWithDetails;
}

export default function InvoiceView({ invoice }: InvoiceViewProps) {
  const { contract, line_items, total_amount, invoice_number, issued_at, status } = invoice;
  const subtotal = (line_items as any[]).reduce((sum, item) => sum + Number(item.amount), 0);
  const tax = total_amount - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden print:shadow-none print:border-none print:my-0">
      {/* Action Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-8 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Status: {status.toUpperCase()}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">INVOICE</h1>
            <p className="text-gray-500 font-medium">#{invoice_number}</p>
            {status === 'paid' && (
              <div className="mt-4 flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full w-fit">
                <CheckCircle2 className="w-4 h-4" />
                PAID
              </div>
            )}
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-xl font-bold text-gray-900 mb-1">FreelanceHub</h2>
            <p className="text-gray-500 text-sm">123 Agency Plaza</p>
            <p className="text-gray-500 text-sm">San Francisco, CA 94103</p>
            <p className="text-gray-500 text-sm">billing@freelancehub.com</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Billed To</h3>
            <p className="text-lg font-bold text-gray-900">{contract.client.full_name}</p>
            <p className="text-gray-500 text-sm mt-1">{contract.client.location || 'Remote Client'}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Invoice Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-500 text-sm">Issued Date:</span>
                <span className="text-gray-900 font-medium text-sm">{format(new Date(issued_at), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between md:justify-end gap-4">
                <span className="text-gray-500 text-sm">Due Date:</span>
                <span className="text-gray-900 font-medium text-sm">{format(new Date(invoice.due_date), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Project</p>
          <p className="text-blue-900 font-semibold">{contract.project.title}</p>
        </div>

        {/* Line Items Table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(line_items as any[]).map((item, index) => (
                <tr key={index}>
                  <td className="py-6 text-gray-700 font-medium">{item.description}</td>
                  <td className="py-6 text-right text-gray-900 font-bold">${Number(item.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span className="text-gray-900 font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Tax (10%)</span>
              <span className="text-gray-900 font-medium">${tax.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t-2 border-gray-100 flex justify-between items-center">
              <span className="text-gray-900 font-black text-lg">Total</span>
              <span className="text-blue-600 font-black text-2xl">${total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">Thank you for your business!</p>
          <p className="text-gray-400 text-xs mt-1">If you have any questions, please contact billing@freelancehub.com</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:shadow-none, .print\:shadow-none * {
            visibility: visible;
          }
          .print\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
