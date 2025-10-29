import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await axios.get(
      "http://54.210.247.12:5000/cash_income_combined/NVDA",
      {
        params: {
          period: "FY",
          limit: 10,
        },
      }
    );

    const formatted = data?.data?.map((item) => ({
      date: item.date,
      researchAndDevelopmentExpenses: item.researchAndDevelopmentExpenses,
      generalAndAdministrativeExpenses:
        item.sellingGeneralAndAdministrativeExpenses,
      operatingExpenses: item.operatingExpenses,
      costAndExpenses: item.costAndExpenses,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("API route error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch expenses data" },
      { status: 500 }
    );
  }
}
