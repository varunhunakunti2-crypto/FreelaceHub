import { createServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import InvoiceView from "@/components/payments/InvoiceView";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(`
      *,
      contract:contracts (
        *,
        client:profiles!contracts_client_id_fkey (*),
        freelancer:profiles!contracts_freelancer_id_fkey (*),
        project:projects (*)
      )
    `)
    .eq("id", params.id)
    .single();

  // Mock data fallback for demonstration purposes
  if (error || !invoice) {
    if (params.id.startsWith('inv-')) {
      const mockData: Record<string, any> = {
        'inv-001': { project: 'E-commerce Redesign', client: 'Urban Outfitters', amount: 1500, status: 'paid' },
        'inv-002': { project: 'Next.js API Integration', client: 'TechVision Inc.', amount: 3200, status: 'pending' },
        'inv-003': { project: 'Brand Identity', client: 'Global Logistics', amount: 2500, status: 'overdue' },
        'inv-004': { project: 'Mobile App Wireframes', client: 'HealthFlow', amount: 1200, status: 'paid' },
        'inv-005': { project: 'SEO Optimization', client: 'Organic Greens', amount: 800, status: 'pending' },
        'inv-006': { project: 'Social Media Assets', client: 'SnapSync', amount: 600, status: 'paid' },
        'inv-007': { project: 'Landing Page Dev', client: 'LaunchPad', amount: 2000, status: 'pending' },
        'inv-008': { project: 'Copywriting Services', client: 'WordSmith', amount: 450, status: 'overdue' },
        'inv-009': { project: 'React Native App', client: 'FinTrack', amount: 5000, status: 'pending' },
        'inv-010': { project: 'Database Migration', client: 'DataKeep', amount: 1800, status: 'paid' },
      };

      const details = mockData[params.id] || mockData['inv-001'];
      
      const mockInvoice = {
        id: params.id,
        invoice_number: params.id.toUpperCase(),
        amount: details.amount,
        total_amount: details.amount,
        status: details.status,
        issued_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        line_items: [
          { description: `Work for ${details.project}`, amount: details.amount }
        ],
        contract: {
          client: { full_name: details.client, location: 'Remote' },
          freelancer: { full_name: 'Appi' },
          project: { title: details.project }
        }
      };
      
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors print:hidden font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Invoices
            </Link>
            
            <InvoiceView invoice={mockInvoice as any} />
          </div>
        </div>
      );
    }
    notFound();
  }

  // Security check: Only client or freelancer involved can see the invoice
  if (invoice.contract.client_id !== user.id && invoice.contract.freelancer_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors print:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <InvoiceView invoice={invoice as any} />
      </div>
    </div>
  );
}
