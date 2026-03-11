"use server";

import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

const DEMO_LEADS = [
  {
    name: "Jordan Lee",
    company: "Blue Oak Plumbing",
    email: "jordan.lee@blueoakplumbing.com",
    phone: "6303605775",
    source: "Website form",
    status: "new",
    notes:
      "Requested an estimate for a whole-home repipe. Looking for a quick turnaround and wants pricing before Friday.",
  },
  {
    name: "Maya Patel",
    company: "Patel Family Dental",
    email: "maya@patelfamilydental.com",
    phone: "3125551842",
    source: "Referral",
    status: "contacted",
    notes:
      "Spoke briefly by phone. Interested in monthly office cleaning and wants a walk-through next week.",
  },
  {
    name: "Chris Romero",
    company: "Romero Roofing Co.",
    email: "chris@romeroroofingco.com",
    phone: "7735559021",
    source: "Instagram",
    status: "qualified",
    notes:
      "Needs help with lead follow-up process and quoting workflow. Budget range sounds healthy and decision maker is engaged.",
  },
  {
    name: "Elena Brooks",
    company: "North Shore Interiors",
    email: "elena@northshoreinteriors.com",
    phone: "8475556128",
    source: "Referral",
    status: "won",
    notes:
      "Signed off on a small retainer to streamline client onboarding and project communication.",
  },
  {
    name: "Tyler Nguyen",
    company: "Nguyen Lawn + Landscape",
    email: "tyler@nguyenlawn.com",
    phone: "7085554433",
    source: "Google Business Profile",
    status: "new",
    notes:
      "Looking for a cleaner way to manage incoming quote requests during spring rush. Wants something simple for a small team.",
  },
  {
    name: "Alicia Gomez",
    company: "Gomez HVAC Solutions",
    email: "alicia@gomezhvac.com",
    phone: "8155557712",
    source: "Website form",
    status: "contacted",
    notes:
      "Follow-up email already sent. Asked about basic CRM features and whether AI note summaries are included.",
  },
  {
    name: "Ben Carter",
    company: "Carter Custom Cabinets",
    email: "ben@cartercabinets.com",
    phone: "2245551994",
    source: "Trade show",
    status: "qualified",
    notes:
      "Met at local home expo. Wants better visibility into leads and project handoffs from estimate to install.",
  },
  {
    name: "Sofia Ramirez",
    company: "Ramirez Event Floral",
    email: "sofia@ramirezeventfloral.com",
    phone: "3315558204",
    source: "Referral",
    status: "won",
    notes:
      "Ready to move forward with a lightweight system for inquiries, proposals, and client follow-up emails.",
  },
  {
    name: "Marcus Hill",
    company: "Hill Electric Group",
    email: "marcus@hillelectricgroup.com",
    phone: "8725553147",
    source: "Cold outreach reply",
    status: "new",
    notes:
      "Replied to outbound email. Curious about a central place for estimates, lead notes, and simple reporting.",
  },
  {
    name: "Priya Shah",
    company: "Shah Wellness Studio",
    email: "priya@shahwellnessstudio.com",
    phone: "6305552901",
    source: "Instagram",
    status: "contacted",
    notes:
      "Interested in improving inquiry response time for workshop bookings and private client requests.",
  },
  {
    name: "Derek Foster",
    company: "Foster Property Services",
    email: "derek@fosterpropertyservices.com",
    phone: "8475556230",
    source: "Website form",
    status: "qualified",
    notes:
      "Needs a clean demo of dashboard visibility and better follow-up for maintenance contract opportunities.",
  },
  {
    name: "Nina Park",
    company: "Park Legal Support",
    email: "nina@parklegalsupport.com",
    phone: "7735555088",
    source: "Referral",
    status: "won",
    notes:
      "Already sold on the polished demo workflow. Wants a simple client ops system without enterprise complexity.",
  },
] as const;

const DEMO_AI_OUTPUTS = [
  {
    email: "jordan.lee@blueoakplumbing.com",
    raw_notes:
      "Owner wants a whole-home repipe estimate. Sounds motivated and wants numbers before Friday. Main concern is getting clear pricing and confidence that the crew can move fast. Mentioned they had a bad communication experience with another contractor.",
    summary:
      "Jordan Lee at Blue Oak Plumbing is looking for a whole-home repipe estimate with a fast turnaround. The lead appears motivated and is primarily looking for clear pricing, strong communication, and confidence in delivery timing before making a decision.",
    draft_email: `Hi Jordan,

Thanks again for reaching out about the whole-home repipe project. Based on our conversation, it sounds like timing and clear pricing are the biggest priorities for you right now.

I’d be happy to put together a straightforward estimate for review before Friday so you have a clear next step. If there are any property details, preferred timing, or scope notes you want included, send them over and I’ll make sure the estimate reflects them.

Looking forward to helping you move this forward.

Best,
[Your Name]`,
  },
  {
    email: "maya@patelfamilydental.com",
    raw_notes:
      "Dental office manager wants monthly office cleaning support. Asked for a walk-through next week and wants a simple proposal after that. Mentioned they value reliability and discretion because the office stays busy.",
    summary:
      "Maya Patel at Patel Family Dental is interested in monthly office cleaning services and has requested an on-site walk-through next week. Reliability, professionalism, and low-disruption service are especially important for this opportunity.",
    draft_email: `Hi Maya,

Thank you for taking the time to speak with me. I’d be glad to schedule a walk-through next week so we can better understand the office layout, cleaning needs, and preferred schedule.

After the visit, I can send over a simple proposal outlining the recommended service plan and next steps. We understand that reliability and minimal disruption are important in a busy dental office, and we’ll keep that front and center.

Let me know which day next week works best for you.

Best,
[Your Name]`,
  },
  {
    email: "derek@fosterpropertyservices.com",
    raw_notes:
      "Property services owner wants a polished demo of dashboard visibility, lead follow-up, and how notes turn into clean emails. Seems qualified and interested in something that helps the team stay organized without being too complex.",
    summary:
      "Derek Foster at Foster Property Services is a qualified lead who wants a clear demonstration of dashboard visibility, lead follow-up, and AI-assisted communication. The key fit is a simple system that improves team organization without unnecessary complexity.",
    draft_email: `Hi Derek,

Thanks for the conversation today. Based on what you shared, I think the best next step is a focused demo showing three things: lead visibility on the dashboard, a clean follow-up workflow, and how rough notes can be turned into polished client communication.

I’ll keep the walkthrough practical and specific to how a property services team would actually use it day to day. The goal will be to show you a system that feels organized and useful without adding extra complexity.

If that sounds good, I can send over a few time options for a short demo.

Best,
[Your Name]`,
  },
] as const;

function getLeadStatus(value: FormDataEntryValue | null) {
  const status = String(value ?? "new");
  return LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])
    ? status
    : "new";
}

export async function createLead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    redirect("/leads?message=Name is required.");
  }

  const { error } = await supabase.from("leads").insert({
    owner_id: user.id,
    name,
    company: company || null,
    email: email || null,
    phone: phone || null,
    source: source || null,
    notes: notes || null,
  });

  if (error) {
    redirect(`/leads?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/leads");
  redirect("/leads?message=Lead created.");
}

export async function updateLead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const leadId = String(formData.get("leadId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const status = getLeadStatus(formData.get("status"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!leadId) {
    redirect("/leads?message=Lead not found.");
  }

  if (!name) {
    redirect(`/leads/${leadId}?message=Name is required.`);
  }

  const { error } = await supabase
    .from("leads")
    .update({
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      source: source || null,
      status,
      notes: notes || null,
    })
    .eq("id", leadId)
    .eq("owner_id", user.id);

  if (error) {
    redirect(`/leads/${leadId}?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  redirect(`/leads/${leadId}?message=Lead updated.`);
}

export async function generateLeadAi(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const leadId = String(formData.get("leadId") ?? "").trim();
  const rawNotes = String(formData.get("rawNotes") ?? "").trim();

  if (!leadId) {
    redirect("/leads?message=Lead not found.");
  }

  if (!rawNotes) {
    redirect(`/leads/${leadId}?message=Add rough notes before generating.`);
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id, name, company, email, source, owner_id")
    .eq("id", leadId)
    .eq("owner_id", user.id)
    .single();

  if (!lead) {
    redirect("/leads?message=Lead not found.");
  }

  if (!process.env.OPENAI_API_KEY) {
    redirect(`/leads/${leadId}?message=Missing OPENAI_API_KEY in .env.local.`);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const model = process.env.OPENAI_MODEL || "gpt-4.1";

  try {
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are helping a small service business clean up sales notes. Return valid JSON with exactly these keys: summary and draft_email. Keep the summary concise and practical. Keep the draft email professional, friendly, and ready to send.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Lead details:
Name: ${lead.name}
Company: ${lead.company ?? "Unknown"}
Email: ${lead.email ?? "Unknown"}
Source: ${lead.source ?? "Unknown"}

Rough notes:
${rawNotes}`,
            },
          ],
        },
      ],
    });

    const outputText = response.output_text;
    const parsed = JSON.parse(outputText) as {
      summary?: string;
      draft_email?: string;
    };

    const summary = parsed.summary?.trim();
    const draftEmail = parsed.draft_email?.trim();

    if (!summary || !draftEmail) {
      redirect(
        `/leads/${leadId}?message=The AI response was incomplete. Try again.`,
      );
    }

    const { error } = await supabase.from("ai_generations").insert({
      owner_id: user.id,
      lead_id: leadId,
      raw_notes: rawNotes,
      summary,
      draft_email: draftEmail,
    });

    if (error) {
      redirect(`/leads/${leadId}?message=${encodeURIComponent(error.message)}`);
    }

    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?message=AI draft generated.`);
  } catch {
    redirect(
      `/leads/${leadId}?message=AI generation failed. Check your API key and try again.`,
    );
  }
}

export async function seedDemoLeads() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const demoEmails = DEMO_LEADS.map((lead) => lead.email);

  const { data: existingLeads, error: existingError } = await supabase
    .from("leads")
    .select("email")
    .eq("owner_id", user.id)
    .in("email", demoEmails);

  if (existingError) {
    redirect(`/leads?message=${encodeURIComponent(existingError.message)}`);
  }

  const existingEmails = new Set(
    (existingLeads ?? []).map((lead) => lead.email).filter(Boolean),
  );

  const leadsToInsert = DEMO_LEADS.filter(
    (lead) => !existingEmails.has(lead.email),
  ).map((lead) => ({
    owner_id: user.id,
    ...lead,
  }));

  if (leadsToInsert.length === 0) {
    redirect("/leads?message=Demo leads already added.");
  }

  const { error } = await supabase.from("leads").insert(leadsToInsert);

  if (error) {
    redirect(`/leads?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/leads");
  redirect(`/leads?message=Added ${leadsToInsert.length} demo leads.`);
}

export async function seedDemoAiOutputs() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const targetEmails = DEMO_AI_OUTPUTS.map((item) => item.email);

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("id, email")
    .eq("owner_id", user.id)
    .in("email", targetEmails);

  if (leadsError) {
    redirect(`/leads?message=${encodeURIComponent(leadsError.message)}`);
  }

  const leadByEmail = new Map((leads ?? []).map((lead) => [lead.email, lead.id]));
  const targetLeadIds = Array.from(leadByEmail.values());

  if (targetLeadIds.length === 0) {
    redirect("/leads?message=Seed demo leads first before adding AI outputs.");
  }

  const { data: existingOutputs, error: outputsError } = await supabase
    .from("ai_generations")
    .select("lead_id, raw_notes")
    .eq("owner_id", user.id)
    .in("lead_id", targetLeadIds);

  if (outputsError) {
    redirect(`/leads?message=${encodeURIComponent(outputsError.message)}`);
  }

  const existingPairs = new Set(
    (existingOutputs ?? []).map((item) => `${item.lead_id}:${item.raw_notes}`),
  );

  const rowsToInsert = DEMO_AI_OUTPUTS.map((item) => {
    const leadId = leadByEmail.get(item.email);

    if (!leadId) {
      return null;
    }

    const duplicateKey = `${leadId}:${item.raw_notes}`;
    if (existingPairs.has(duplicateKey)) {
      return null;
    }

    return {
      owner_id: user.id,
      lead_id: leadId,
      raw_notes: item.raw_notes,
      summary: item.summary,
      draft_email: item.draft_email,
    };
  }).filter(Boolean);

  if (rowsToInsert.length === 0) {
    redirect("/leads?message=Demo AI outputs already added.");
  }

  const { error } = await supabase.from("ai_generations").insert(rowsToInsert);

  if (error) {
    redirect(`/leads?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/leads");
  for (const leadId of targetLeadIds) {
    revalidatePath(`/leads/${leadId}`);
  }

  redirect(`/leads?message=Added ${rowsToInsert.length} demo AI outputs.`);
}
