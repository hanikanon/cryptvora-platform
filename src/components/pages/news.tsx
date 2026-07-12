import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { newsFeed } from "@/lib/market-data"

export default function NewsPage() {
  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div>
        <h1 className="text-lg font-semibold text-foreground">News</h1>
        <p className="text-xs text-muted-foreground">Institutional market wire</p>
      </div>
      <Panel>
        <PanelHeader title="Latest Headlines" subtitle="Real-time feed" />
        <ul className="divide-y divide-border/60">
          {newsFeed.map((n, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground text-pretty">{n.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {n.source} · {n.time} ago
                </p>
              </div>
              <Chip tone="cyan">{n.tag}</Chip>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
