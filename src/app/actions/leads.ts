"use server";

import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

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
  const status = getLeadStatus(formData.get("status"));
  const notes = String(formData.get("notes") ?? "").trim();

  if (!leadId) {
    redirect("/leads?message=Lead not found.");
  }

  const { error } = await supabase
    .from("leads")
    .update({
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
