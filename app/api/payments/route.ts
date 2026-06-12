import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";
import type { Database } from '@/types/database';

export const runtime = 'edge';

type ContractWithRelations = Database['public']['Tables']['contracts']['Row'] & {
  project?: { title: string | null };
  client?: { full_name: string | null };
  freelancer?: { full_name: string | null };
};
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentRow = Database['public']['Tables']['payments']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceRow = Database['public']['Tables']['invoices']['Row'];

export async function POST(request: Request) {
  const supabase = createRouteClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return new NextResponse('Malformed JSON payload', { status: 400 });
  }

  const { contractId } = (body as { contractId?: unknown }) ?? {};
  if (!contractId || typeof contractId !== 'string') {
    return new NextResponse('Missing or invalid contractId', { status: 400 });
  }

  // 1. Fetch contract details
  const { data: contractData, error: contractError } = await supabase
    .from('contracts')
    .select(`
      *,
      project:projects (title),
      client:profiles!contracts_client_id_fkey (full_name),
      freelancer:profiles!contracts_freelancer_id_fkey (full_name)
    `)
    .eq('id', contractId)
    .single();

  const contract = contractData as unknown as ContractWithRelations;

  if (contractError || !contract) {
    return new NextResponse("Contract not found", { status: 404 });
  }

  // 2. Security check
  if (contract.client_id !== user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Create payment record
  const paymentInsert: PaymentInsert = {
    contract_id: contractId,
    client_id: contract.client_id,
    freelancer_id: contract.freelancer_id,
    amount: contract.agreed_amount,
    status: 'pending',
    payment_method: 'Mock Credit Card',
  };

  const { data: paymentData, error: paymentError } = await supabase
    .from('payments')
    .insert(paymentInsert)
    .select()
    .single();

  const payment = paymentData as unknown as PaymentRow;

  if (paymentError || !payment) {
    console.error('Payment error:', paymentError);
    return new NextResponse('Failed to create payment', { status: 500 });
  }

  // 4. Generate Invoice
  const invoiceNumber = `INV-${new Date().getFullYear()}-${crypto.randomUUID()}`;
  const taxAmount = Number(contract.agreed_amount) * 0.1;
  const totalWithTax = Number(contract.agreed_amount) + taxAmount;

  const lineItems: InvoiceInsert['line_items'] = [
    {
      description: `Payment for project: ${contract.project?.title || 'Contract'}`,
      amount: contract.agreed_amount,
    },
  ];

  const invoiceInsert: InvoiceInsert = {
    payment_id: payment.id,
    contract_id: contractId,
    invoice_number: invoiceNumber,
    due_date: payment.created_at,
    total_amount: totalWithTax,
    status: 'paid',
    line_items: lineItems,
  };

  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert(invoiceInsert)
    .select()
    .single();

  const invoice = invoiceData as unknown as InvoiceRow;

  if (invoiceError || !invoice) {
    console.error('Invoice error:', invoiceError);
    await supabase.from('payments').delete().eq('id', payment.id);
    return new NextResponse('Failed to generate invoice', { status: 500 });
  }

  const { error: paymentCompleteError } = await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', payment.id);

  if (paymentCompleteError) {
    console.error('Payment finalization error:', paymentCompleteError);
    await supabase.from('invoices').delete().eq('id', invoice.id);
    await supabase.from('payments').delete().eq('id', payment.id);
    return new NextResponse('Failed to finalize payment', { status: 500 });
  }

  // 5. Send notification to freelancer
  await createNotification(
    contract.freelancer_id,
    "payment_received",
    "Payment Received",
    `You have received a payment of $${contract.agreed_amount} from ${contract.client?.full_name || 'your client'} for "${contract.project?.title}"`,
    { contractId, paymentId: payment.id, invoiceId: invoice.id }
  );

  return NextResponse.json({ payment, invoice });
}
