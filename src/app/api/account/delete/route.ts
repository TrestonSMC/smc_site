import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the logged-in user from the token sent by the app
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const userId = user.id;

    // Delete child/user-owned data first
    // Keep only the tables that actually exist in your project
    const operations = await Promise.allSettled([
      admin.from("profiles").delete().eq("id", userId),

      // Uncomment / adjust these only if they exist and match your schema
      // admin.from("clients").delete().eq("profile_id", userId),
      // admin.from("contracts").delete().eq("client_id", userId),
      // admin.from("invoices").delete().eq("client_id", userId),
    ]);

    const failed = operations.filter(
      (result) => result.status === "fulfilled" && result.value.error
    );

    if (failed.length > 0) {
      return NextResponse.json(
        { error: "Failed deleting related user data", details: failed },
        { status: 500 }
      );
    }

    // Delete auth user last
    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      return NextResponse.json(
        { error: deleteAuthError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}