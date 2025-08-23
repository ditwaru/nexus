import ApplicationsList from "@/pages/ApplicationsList";
import { listApplications } from "ditwaru-aws-helpers";

export default async function HomePage() {
  try {
    // Fetch all DynamoDB tables (each table represents an application)
    const tableNames = await listApplications();

    // Transform table names into application objects
    const applications = tableNames.map((tableName) => ({
      id: tableName,
      name: tableName.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), // Convert "daniel-itwaru" to "Daniel Itwaru"
      description: `Content management for ${tableName.replace(/-/g, " ")}`,
      type: "Application", // You could make this more specific based on table naming conventions
      lastUpdated: new Date().toISOString().split("T")[0], // Today's date as placeholder
      status: "active",
    }));

    return <ApplicationsList applications={applications} />;
  } catch (error) {
    console.error("Failed to fetch applications:", error);

    // Fallback to empty list if there's an error
    return <ApplicationsList applications={[]} />;
  }
}
