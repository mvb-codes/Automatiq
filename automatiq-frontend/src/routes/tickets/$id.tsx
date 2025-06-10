import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tickets/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tickets/$id"!</div>
}
