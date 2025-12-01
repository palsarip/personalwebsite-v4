"use client"

import { useEffect, useRef } from "react"
import Matter from "matter-js"

export function GravityScene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)

  useEffect(() => {
    if (!sceneRef.current) return

    // Prevent double initialization in Strict Mode
    if (renderRef.current) return

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events

    // Create engine
    const engine = Engine.create()
    engineRef.current = engine

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    })
    renderRef.current = render

    // Create boundaries
    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 50, // Slightly below screen
      window.innerWidth,
      100,
      { isStatic: true, render: { visible: false } }
    )
    
    const leftWall = Bodies.rectangle(
      -50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    )

    const rightWall = Bodies.rectangle(
      window.innerWidth + 50,
      window.innerHeight / 2,
      100,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    )

    // Create collidable text body
    const textBody = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      800, // Increased width for 120px text
      150, // Increased height for 120px text
      { 
        isStatic: true, 
        render: { visible: false }, // We'll draw custom text
        chamfer: { radius: 10 }
      }
    )

    Composite.add(engine.world, [ground, leftWall, rightWall, textBody])

    // Hover State
    let isHovered = false
    const mousePos = { x: 0, y: 0 }

    // Mouse Interaction Handlers
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX
      mousePos.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Custom rendering loop
    Events.on(render, "afterRender", () => {
      const ctx = render.context
      
      // Check for hover
      // We use the physics engine's query to see if the mouse is inside the text body
      const bodiesUnderMouse = Matter.Query.point([textBody], mousePos)
      isHovered = bodiesUnderMouse.length > 0

      // Get the computed font family from the body (which has the Next.js font applied)
      const bodyFont = getComputedStyle(document.body).fontFamily
      
      // Draw "Naufal Syarif" text
      ctx.save()
      ctx.translate(textBody.position.x, textBody.position.y)
      ctx.rotate(textBody.angle)
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      // Use the body's font family directly. It's already a valid CSS font string.
      ctx.font = `700 120px ${bodyFont}` 
      ctx.fillStyle = "#000000" // Always Black
      ctx.fillText("Naufal Syarif", 0, 0)
      ctx.restore()

      // Draw CV Labeling if hovered
      if (isHovered) {
        const { min, max } = textBody.bounds
        const width = max.x - min.x
        const height = max.y - min.y
        const padding = 20

        ctx.save()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        
        // Draw Bounding Box Corners (Tech style)
        const cornerSize = 20
        const x = min.x - padding
        const y = min.y - padding
        const w = width + padding * 2
        const h = height + padding * 2

        // Top Left
        ctx.beginPath()
        ctx.moveTo(x, y + cornerSize)
        ctx.lineTo(x, y)
        ctx.lineTo(x + cornerSize, y)
        ctx.stroke()

        // Top Right
        ctx.beginPath()
        ctx.moveTo(x + w - cornerSize, y)
        ctx.lineTo(x + w, y)
        ctx.lineTo(x + w, y + cornerSize)
        ctx.stroke()

        // Bottom Right
        ctx.beginPath()
        ctx.moveTo(x + w, y + h - cornerSize)
        ctx.lineTo(x + w, y + h)
        ctx.lineTo(x + w - cornerSize, y + h)
        ctx.stroke()

        // Bottom Left
        ctx.beginPath()
        ctx.moveTo(x + cornerSize, y + h)
        ctx.lineTo(x, y + h)
        ctx.lineTo(x, y + h - cornerSize)
        ctx.stroke()

        // Draw Label Tag
        ctx.fillStyle = "#000000"
        ctx.fillRect(x, y - 25, 140, 25)
        
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "12px 'Courier New', monospace"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText("OBJECT: CREATOR", x + 10, y - 12.5)
        
        // Draw Confidence Score (Randomized slightly for effect)
        ctx.fillStyle = "#000000"
        ctx.fillText("CONFIDENCE: 99.9%", x + w - 130, y + h + 15)

        ctx.restore()
      }
    })

    // Add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    })
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    // Run the engine
    Render.run(render)
    
    // Create runner
    const runner = Runner.create()
    runnerRef.current = runner
    Runner.run(runner, engine)

    // Handle resize
    const handleResize = () => {
      if (!render.canvas) return
      render.canvas.width = window.innerWidth
      render.canvas.height = window.innerHeight
      
      // Reposition ground
      Matter.Body.setPosition(ground, {
        x: window.innerWidth / 2,
        y: window.innerHeight + 50,
      })
      
      // Reposition walls
      Matter.Body.setPosition(rightWall, {
        x: window.innerWidth + 50,
        y: window.innerHeight / 2,
      })

      // Reposition Text
      Matter.Body.setPosition(textBody, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas) {
          render.canvas.remove()
      }
      Engine.clear(engine)
      renderRef.current = null
      runnerRef.current = null
      engineRef.current = null
    }
  }, [])

  return (
    <div ref={sceneRef} className="absolute inset-0 z-0 pointer-events-auto" />
  )
}
