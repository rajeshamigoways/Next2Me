import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface Module {
  id: string
  name: string
}

interface Props {
  modules: Module[]
}

function ModuleItem({ module }: { module: Module }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-2 cursor-move"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span>{module.name}</span>
    </div>
  )
}

export default function ModulesList({ modules }: Props) {
  return (
    <div className="space-y-2">
      {modules.map((module) => (
        <ModuleItem key={module.id} module={module} />
      ))}
    </div>
  )
}

