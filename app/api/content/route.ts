import { NextRequest, NextResponse } from "next/server";
import { savePage, deletePage } from "ditwaru-aws-helpers";
import { Page } from "ditwaru-aws-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName, ...pageData } = body;

    if (!tableName) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    if (!pageData.page) {
      return NextResponse.json({ error: "Page name is required" }, { status: 400 });
    }

    // Validate the page data structure
    const page: Page = {
      page: pageData.page,
      title: pageData.title || pageData.page,
      sections: pageData.sections || [
        {
          type: "hero",
          title: pageData.title || pageData.page,
          text: "New page description",
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    await savePage(tableName, page);

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName, ...pageData } = body;

    if (!tableName) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    if (!pageData.page) {
      return NextResponse.json({ error: "Page name is required" }, { status: 400 });
    }

    // Update the page with new data
    const page: Page = {
      ...pageData,
      updatedAt: new Date().toISOString(),
    };

    await savePage(tableName, page);

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableName, pageName } = body;

    if (!tableName) {
      return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    if (!pageName) {
      return NextResponse.json({ error: "Page name is required" }, { status: 400 });
    }

    await deletePage(tableName, pageName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
