import Panzoom from '@panzoom/panzoom'

declare global {
	interface Window {
		__panzoomImageSetup?: boolean
	}
}

// Panzoom must live in a real module file so Vite can rewrite the bare import
// (@panzoom/panzoom). Inline <script> tags won't be transformed by Vite, which
// causes "Failed to resolve module specifier" in the browser.

const cleanupByContainer = new WeakMap<HTMLElement, () => void>()

function initPanzoom() {
	document.querySelectorAll<HTMLElement>('.pan-zoom-container').forEach((container) => {
		if (container.dataset.initialized === 'true') return

		const img = container.querySelector('.pan-zoom-img')
		if (!(img instanceof HTMLImageElement)) return

		container.dataset.initialized = 'true'

		// Pan/zoom the image, but allow pointer events anywhere inside the container (canvas mode).
		const panzoom = Panzoom(img, {
			canvas: true,
			maxScale: 5,
			minScale: 0.5
		})

		const wheelHandler = (event: WheelEvent) => {
			event.preventDefault()
			panzoom.zoomWithWheel(event)
		}

		const dblClickHandler = () => panzoom.reset()

		container.addEventListener('wheel', wheelHandler, { passive: false })
		container.addEventListener('dblclick', dblClickHandler)

		cleanupByContainer.set(container, () => {
			container.removeEventListener('wheel', wheelHandler)
			container.removeEventListener('dblclick', dblClickHandler)
			try {
				panzoom.destroy()
			} catch {
				// Ignore double-destroy.
			}
			container.dataset.initialized = 'false'
		})
	})
}

function cleanupPanzoom() {
	document
		.querySelectorAll<HTMLElement>('.pan-zoom-container[data-initialized="true"]')
		.forEach((container) => {
			const cleanup = cleanupByContainer.get(container)
			if (cleanup) cleanup()
			cleanupByContainer.delete(container)
		})
}

export function setupPanzoomImages() {
	if (window.__panzoomImageSetup) return
	window.__panzoomImageSetup = true

	initPanzoom()
	document.addEventListener('astro:after-swap', initPanzoom)
	document.addEventListener('astro:before-swap', cleanupPanzoom)
}
