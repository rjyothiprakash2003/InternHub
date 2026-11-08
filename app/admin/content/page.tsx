import { prisma } from "@/lib/db";
import { saveContentAction } from "@/app/admin-actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminContentPage() {
  const [settings, content] = await Promise.all([prisma.systemSetting.findMany(), prisma.websiteContent.findMany()]);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={saveContentAction} className="space-y-3 rounded-3xl bg-white p-5">
        <input type="hidden" name="kind" value="setting" />
        <h2 className="font-semibold">Website settings</h2>
        {settings.map((row) => (
          <div key={row.key}>
            <Label htmlFor={row.key}>{row.key}</Label>
            <Input id={row.key} name={row.key} defaultValue={row.value} />
          </div>
        ))}
        <Button type="submit">Save settings</Button>
      </form>
      <form action={saveContentAction} className="space-y-3 rounded-3xl bg-white p-5">
        <input type="hidden" name="kind" value="content" />
        <h2 className="font-semibold">CMS copy</h2>
        {content.map((row) => (
          <div key={row.key}>
            <Label htmlFor={row.key}>{row.key}</Label>
            <Textarea id={row.key} name={row.key} defaultValue={row.value} />
          </div>
        ))}
        <Button type="submit">Save content</Button>
      </form>
    </div>
  );
}
