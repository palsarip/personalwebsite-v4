import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function ContactPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Have a project in mind or just want to say hi? Send me a message!
        </p>
        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Message
            </label>
            <textarea
              id="message"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell me about your project..."
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Send Message
          </Button>
        </form>
        <Separator className="my-12" />
        <div className="text-center text-muted-foreground">
          <p>Or email me directly at</p>
          <a
            href="mailto:hello@example.com"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            hello@example.com
          </a>
        </div>
      </div>
    </Container>
  )
}
