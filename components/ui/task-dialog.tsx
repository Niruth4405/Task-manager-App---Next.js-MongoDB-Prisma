// components/add-task-dialog.tsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AddTaskDialog({ onAdd }: { onAdd: (data: FormData) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Add Task</Button></DialogTrigger>
      <DialogContent>
        <form action={onAdd} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" />
          </div>
          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue="todo">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
