import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const supabase = createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { contractId } = await request.json();

  // 1. Fetch contract details
  const { data: contract, error: contractError } = await (supabase
    .from("contracts")
    .select(`
      *,
      project:projects (title),
      client:profiles!contracts_client_id_fkey (full_name),
      freelancer:profiles!contracts_freelancer_id_fkey (full_name)
    `)
    .eq("id", contractId)
    .single() as any);

  if (contractError || !contract) {
    return new NextResponse("Contract not found", { status: 404 });
  }

  // 2. Security check
  if (contract.client_id !== user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Create payment record
  const { data: payment, error: paymentError } = await (supabase
    .from("payments")
    .insert({
      contract_id: contractId,
      client_id: contract.client_id,
      freelancer_id: contract.freelancer_id,
      amount: contract.agreed_amount,
      status: "completed",
      payment_method: "Mock Credit Card",
    })
    .select()
    .single() as any);

  if (paymentError) {
    console.error("Payment error:", paymentError);
    return new NextResponse("Failed to create payment", { status: 500 });
  }

  // 4. Generate Invoice
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
  const taxAmount = Number(contract.agreed_amount) * 0.1;
  const totalWithTax = Number(contract.agreed_amount) + taxAmount;

  const lineItems = [
    {
      description: `Payment for project: ${contract.project?.title || 'Contract'}`,
      amount: contract.agreed_amount,
    }
  ];

  const { data: invoice, error: invoiceError } = await (supabase
    .from("invoices")
    .insert({
      payment_id: payment.id,
      contract_id: contractId,
      invoice_number: invoiceNumber,
      due_date: new Date().toISOString(),
      total_amount: totalWithTax,
      status: "paid",
      line_items: lineItems as any,
    })
    .select()
    .single() as any);

  if (invoiceError) {
    console.error("Invoice error:", invoiceError);
    return new NextResponse("Failed to generate invoice", { status: 500 });
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
