import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "../../button"

interface Module {
  id: string
  name: string
}

interface Props {
  modules: { id: string; name: string }[];
  onRemove?: (id: string) => void; // Make it optional
}

function AssignedModuleItem({ module,  }: { module: Module; }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2"
      {...attributes}
      {...listeners}
     
    >
      <div className="flex items-center gap-2" >
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
        <span>{module.name}</span>
      </div>
     
    </div>
  )
}

export default function AssignedModules({ modules, onRemove }: Props) {
  return (
    <div className="space-y-2">
      {modules.map((module) => (
        <AssignedModuleItem key={module.id} module={module}  />
      ))}
      {modules.length === 0 && (
        <div className="text-center p-6 text-muted-foreground border-2 border-dashed rounded-lg">
          Drop modules here to assign them
        </div>
      )}
    </div>
  )
}

