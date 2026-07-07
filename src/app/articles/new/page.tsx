import { AddArticleForm } from "@/components/add-article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add KB Article</h1>
        <p className="text-sm text-muted-foreground">
          Keep it short, operational, and useful for a tech moving through the property.
        </p>
      </div>
      <AddArticleForm />
    </div>
  );
}
